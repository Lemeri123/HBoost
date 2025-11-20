import { Web3Auth, WEB3AUTH_NETWORK } from "@web3auth/modal";
import { AccountId, Client, AccountBalanceQuery } from "@hashgraph/sdk";

// This file is the main entry point for the @hboost/client package.
// It is browser-safe and contains NO private keys or secrets.

console.log("Loading @hboost/client...");

export class HboostClient {
  private web3auth: Web3Auth | null = null;
  private mirrorNodeClient: Client;

  constructor(network: "mainnet" | "testnet" = "testnet") {
    if (network === "mainnet") {
      this.mirrorNodeClient = Client.forMainnet();
    } else {
      this.mirrorNodeClient = Client.forTestnet();
    }
    console.log(`Client initialized for ${network}`);
  }

  /**
   * Initializes and shows the Web3Auth modal for creator onboarding.
   * @param clientId - Your Web3Auth Client ID
   * @param network - The network to use for the Web3Auth modal
   * @returns The Web3Auth provider
   */
  async onboardCreator(
    clientId: string,
    network: "mainnet" | "testnet" = "testnet"
  ) {
    this.web3auth = new Web3Auth({
      clientId,
      web3AuthNetwork:
        network === "mainnet"
          ? WEB3AUTH_NETWORK.MAINNET
          : WEB3AUTH_NETWORK.TESTNET,
    });

    await this.web3auth.init();
    const provider = await this.web3auth.connect();
    // Here you would derive a Hedera account from the Web3Auth provider
    // and return the account ID.
    console.log("Web3Auth provider:", provider);
    return {
      message: "Creator onboarding initiated (simulated).",
    };
  }

  /**
   * NEW FLOW: Launches the donation widget.
   * This function calls OUR OWN backend to get a secure widget URL,
   * then injects it into an iframe.
   *
   * @param containerId - The HTML element ID (e.g., "donate-widget-container")
   * @param options - Donation parameters
   */
  async launchDonation(
    containerId: string,
    options: {
      fiatAmount: number;
      fiatCurrency: string;
      walletAddress: string; // The creator's recipient address
    }
  ) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(
        `[Client] Error: Container element "${containerId}" not found.`
      );
      return;
    }

    try {
      // 1. Call our OWN server's API endpoint (e.g., /api/generate-widget-url)
      const response = await fetch("/api/generate-widget-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fiatAmount: options.fiatAmount,
          fiatCurrency: options.fiatCurrency,
          cryptoCurrencyCode: "HBAR", // We can hardcode this
          walletAddress: options.walletAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get widget URL from server");
      }

      const { widgetUrl } = await response.json();

      if (!widgetUrl) {
        throw new Error("Server response did not include a widgetUrl");
      }

      // 2. Create and inject the iframe
      container.innerHTML = ""; // Clear previous widget
      const iframe = document.createElement("iframe");
      iframe.src = widgetUrl;
      iframe.width = "100%";
      iframe.height = "625"; // Transak's recommended height
      iframe.style.border = "none";
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");

      container.appendChild(iframe);
    } catch (error) {
      console.error("[Client] Error launching donation:", error);
      // Display a user-friendly error in the container
      container.innerHTML =
        "<p>Error: Could not load the donation widget. Please try again later.</p>";
    }
  }

  /**
   * Gets the HBAR balance for a given account.
   * @param accountId - The Hedera account ID to query
   */
  async getAccountBalance(accountId: string) {
    try {
      const query = new AccountBalanceQuery().setAccountId(accountId);
      const balance = await query.execute(this.mirrorNodeClient);
      console.log(`Balance for ${accountId}: ${balance.hbars.toString()}`);
      return balance.hbars.toString();
    } catch (error) {
      console.error("Error getting account balance:", error);
      throw error;
    }
  }
}
