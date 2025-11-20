import {
  Client,
  PrivateKey,
  TopicMessageSubmitTransaction,
  AccountId,
} from "@hashgraph/sdk";

// This file is the main entry point for the @hboost/server package.
// It is NOT browser-safe and runs on a secure backend.

console.log("Loading @hboost/server...");

// Use the STAGING URLs for testing
const TRANSAK_API_URL =
  "https://api-gateway-stg.transak.com/api/v2/auth/session";
const TRANSAK_REFRESH_URL =
  "https://api-stg.transak.com/partners/api/v2/refresh-token";

/**
 * Updated configuration to include Transak secrets
 */
export interface ServerConfig {
  network: "mainnet" | "testnet";
  // Hedera Credentials
  hederaAccountId: string;
  hederaPrivateKey: string;
  hcsTopicId: string;
  // Transak Credentials
  transakApiKey: string;
  transakApiSecret: string; // Used to programmatically refresh the partner access token
  appDomain: string; // Your whitelisted domain (e.g., "my-app.com")
}

export class HboostServer {
  private hederaClient: Client;
  private config: ServerConfig;
  private currentAccessToken: string | null = null;

  constructor(config: ServerConfig) {
    this.config = config;
    if (config.network === "mainnet") {
      this.hederaClient = Client.forMainnet();
    } else {
      this.hederaClient = Client.forTestnet();
    }

    this.hederaClient.setOperator(
      AccountId.fromString(config.hederaAccountId),
      PrivateKey.fromString(config.hederaPrivateKey)
    );

    console.log(
      `Server client initialized for ${config.network} and account ${config.hederaAccountId}`
    );
  }

  /**
   * Fetches a fresh Transak access token using the refresh-token endpoint.
   * This keeps access-token management on the server and out of the client.
   */
  private async refreshAccessToken(): Promise<string> {
    try {
      const response = await fetch(TRANSAK_REFRESH_URL, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          apiKey: this.config.transakApiKey,
          apiSecret: this.config.transakApiSecret,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.data?.accessToken) {
        console.error("Transak refresh-token API error:", data);
        throw new Error(`Transak refresh-token error: ${response.statusText}`);
      }

      this.currentAccessToken = data.data.accessToken as string;
      return this.currentAccessToken;
    } catch (error) {
      console.error("[Server] Error refreshing Transak access token:", error);
      throw new Error("Could not refresh Transak access token");
    }
  }

  /**
   * NEW FUNCTION: Securely generates a one-time Transak widget URL.
   * This MUST be called from the server.
   */
  async generateWidgetUrl(widgetParams: {
    fiatAmount: number;
    fiatCurrency: string;
    cryptoCurrencyCode: string;
    walletAddress: string;
  }) {
    const accessToken = await this.refreshAccessToken();

    const body = {
      widgetParams: {
        apiKey: this.config.transakApiKey,
        referrerDomain: this.config.appDomain,
        ...widgetParams,
        disableWalletAddressForm: true, // Good practice to lock the address
      },
    };

    try {
      // This uses the built-in Node.js fetch (v18+)
      const response = await fetch(TRANSAK_API_URL, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          // This is the critical security header
          "access-token": accessToken,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok || !data?.data?.widgetUrl) {
        console.error("Transak API Error:", data);
        throw new Error(`Transak API error: ${response.statusText}`);
      }

      // Return only the URL to be sent back to the client
      return data.data.widgetUrl as string;
    } catch (error) {
      console.error("[Server] Error generating Transak URL:", error);
      throw new Error("Could not create donation session");
    }
  }

  /**
   * Logs a donation receipt to the Hedera Consensus Service (HCS).
   * This provides an immutable, verifiable proof of the donation.
   * @param donationData - The donation data to log
   */
  async logDonation(donationData: {
    recipient: string;
    usdValue: number;
    txId: string;
  }) {
    const message = JSON.stringify(donationData);

    try {
      const txResponse = await new TopicMessageSubmitTransaction({
        topicId: this.config.hcsTopicId,
        message: message,
      }).execute(this.hederaClient);

      const receipt = await txResponse.getReceipt(this.hederaClient);

      const sequenceNumber =
        receipt.topicSequenceNumber?.toString() ??
        String(receipt.topicSequenceNumber);
      console.log(`Donation logged to HCS: ${sequenceNumber}`);
      return {
        sequenceNumber,
        transactionId: txResponse.transactionId.toString(),
      };
    } catch (error) {
      console.error("[Server] Error logging donation to HCS:", error);
      throw new Error("Could not log donation");
    }
  }
}
