import { HboostClient } from "@hboost/client";
const hboost = new HboostClient("testnet");

// Initialize Web3Auth modal and connect the user
await hboost.onboardCreator("randon string", "testnet"); //The random string will have to be updated with the real clientId from web3auth on deployment
