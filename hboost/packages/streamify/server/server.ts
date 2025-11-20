import { HboostServer } from "../../server/src";

// Initialize HboostServer with environment variables
export const server = new HboostServer({
  network: (process.env.HEDERA_NETWORK as "mainnet" | "testnet") || "testnet",
  // Hedera Credentials
  hederaAccountId: process.env.HEDERA_ACCOUNT_ID || "",
  hederaPrivateKey: process.env.HEDERA_PRIVATE_KEY || "",
  hcsTopicId: process.env.HCS_TOPIC_ID || "",
  // Transak Credentials
  transakApiKey: process.env.TRANSAK_API_KEY || "",
  transakApiSecret: process.env.TRANSAK_API_SECRET || "", // Must be refreshed periodically
  appDomain:
    process.env.APP_DOMAIN ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "localhost:3000",
});
