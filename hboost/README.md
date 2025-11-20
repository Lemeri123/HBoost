## Hboost

Hboost is a small monorepo that provides a client and server toolkit to onboard creators and accept on-chain donations on Hedera. It wraps:

- Web3Auth Modal SDK v10 for seamless user login
- Transak API (v4) for secure fiat on-ramp (HBAR/other assets) via server-generated widget URLs
- Hedera SDK for account balance queries and optional HCS logging

### Packages

- `packages/client` — Browser-safe client library (TypeScript, no secrets)
- `packages/server` — Server-side helpers with Transak API integration (Node/TypeScript)

### Prerequisites

- Node.js 18+
- PNPM

### Install

```bash
pnpm install
```

### Build all

```bash
pnpm build
```

### Develop

- Client: `pnpm dev:client`
- Server: `pnpm dev:server`

## Usage (Client)

The client package is browser-safe and contains no secrets. It calls your backend API to securely get Transak widget URLs.

### Initialize the Client

```ts
import { HboostClient } from "@hboost/client";

const hboost = new HboostClient("testnet");
```

### Onboard Creators with Web3Auth

Initialize Web3Auth (v10) with your Client ID. You can choose either `mainnet` or `testnet` for the Web3Auth network.

```ts
// Initialize Web3Auth modal and connect the user
await hboost.onboardCreator("YOUR_WEB3AUTH_CLIENT_ID", "testnet");
```

### Launch Donation Widget

The `launchDonation()` method calls your backend API (`/api/generate-widget-url`) to get a secure widget URL, then renders it in an iframe. **You must implement the backend endpoint** that calls `server.generateWidgetUrl()`.

```ts
// Launch donation widget - calls your backend API
await hboost.launchDonation("donate-widget-container", {
  fiatAmount: 25,
  fiatCurrency: "USD",
  walletAddress: "0.0.12345", // Creator's recipient address
});
```

The method expects a container element with the specified ID to exist in your HTML:

```html
<div id="donate-widget-container"></div>
```

### Query Account Balance

```ts
const balance = await hboost.getAccountBalance("0.0.12345");
console.log("HBAR balance:", balance);
```

## Usage (Server)

The server package handles all sensitive operations, including Transak API calls with your credentials.

### Initialize the Server

```ts
import { HboostServer } from "@hboost/server";

const server = new HboostServer({
  network: "testnet",
  // Hedera Credentials
  hederaAccountId: "YOUR_ACCOUNT_ID",
  hederaPrivateKey: "YOUR_PRIVATE_KEY",
  hcsTopicId: "YOUR_TOPIC_ID",
  // Transak Credentials
  transakApiKey: "YOUR_TRANSAK_API_KEY",
  transakAccessToken: "YOUR_TRANSAK_ACCESS_TOKEN", // Must be refreshed periodically
  appDomain: "your-app.com", // Your whitelisted domain
});
```

### Generate Transak Widget URL

Securely generate a one-time widget URL for the client. This should be called from your backend API endpoint.

```ts
// Generate widget URL (call from your API endpoint)
const widgetUrl = await server.generateWidgetUrl({
  fiatAmount: 25,
  fiatCurrency: "USD",
  cryptoCurrencyCode: "HBAR",
  walletAddress: "0.0.12345", // Creator's recipient address
});

// Return widgetUrl to client in your API response
// { widgetUrl: "https://..." }
```

### Log Donations to HCS

Log donation receipts to Hedera Consensus Service (HCS) for immutable proof.

```ts
await server.logDonation({
  recipient: "0.0.12345",
  usdValue: 25,
  txId: "SOME_TX_ID",
});
```

### Example Backend API Endpoint

Here's a simple example of how to wire up the backend endpoint:

```ts
// Example: Express.js endpoint
app.post("/api/generate-widget-url", async (req, res) => {
  try {
    const { fiatAmount, fiatCurrency, walletAddress } = req.body;

    const widgetUrl = await server.generateWidgetUrl({
      fiatAmount,
      fiatCurrency,
      cryptoCurrencyCode: "HBAR",
      walletAddress,
    });

    res.json({ widgetUrl });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate widget URL" });
  }
});
```

## Key Integrations

- **Web3Auth (Modal SDK v10)**: `@web3auth/modal`
  - See reference and examples: [Web3Auth web repo](https://github.com/Web3Auth/web3auth-web)
- **Transak API (v4)**: Server-side integration
  - v4 requires server-generated `widgetUrl` via API session endpoint
  - See reference: [Transak SDK repo](https://github.com/Transak/transak-sdk)
- **Hedera SDK**: `@hashgraph/sdk`
  - For account queries and HCS logging

## Security Model

- **Client**: No secrets, no Transak SDK. Only calls your backend API.
- **Server**: Holds all Transak credentials and generates secure widget URLs.
- **Widget URLs**: One-time, session-based URLs generated server-side with proper authentication.

## Scripts

- `pnpm build` — build all workspace packages
- `pnpm clean` — clean all workspace package builds
- `pnpm dev:client` — watch client
- `pnpm dev:server` — watch server

## Notes

- Web3Auth v10 uses `await web3auth.init()` (not `initModal`) and `WEB3AUTH_NETWORK` for selecting `MAINNET`/`TESTNET` variants.
- Transak v4 requires server-side widget URL generation. The client no longer includes the Transak SDK.
- The `transakAccessToken` must be refreshed periodically according to Transak's API documentation.
