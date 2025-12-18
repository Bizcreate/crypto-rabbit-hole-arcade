import { createThirdwebClient, defineChain } from "thirdweb"
import { ENV } from "./env"

// Get Client ID with proper validation and logging
const clientId = ENV.THIRDWEB_CLIENT_ID || process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID

if (!clientId) {
  const errorMsg = "❌ THIRDWEB_CLIENT_ID not found! Please set NEXT_PUBLIC_THIRDWEB_CLIENT_ID in .env.local"
  console.error(errorMsg)
  if (typeof window !== "undefined") {
    // Only throw in browser to avoid breaking SSR
    throw new Error(errorMsg)
  }
}

// Log Client ID loading (masked for security)
if (typeof window !== "undefined") {
  console.log("✅ Thirdweb Client ID loaded:", clientId.substring(0, 8) + "..." + clientId.substring(clientId.length - 4))
}

export const thirdwebClient = createThirdwebClient({
  clientId: ENV.THIRDWEB_CLIENT_ID || process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "c9199aa4c25c849a9014f465e22ec9e4",
})

// Define ApeChain (Curtis testnet)
export const apeChain = defineChain({
  id: 33111,
  name: "ApeChain Curtis",
  nativeCurrency: {
    name: "ApeCoin",
    symbol: "APE",
    decimals: 18,
  },
  rpc: "https://curtis.rpc.caldera.xyz/http",
  testnet: true,
})

// Helper to get contract addresses
export const contracts = {
  pythEntropy: ENV.PYTH_ENTROPY,
  apeOFT: ENV.APE_OFT,
  apeToken: ENV.APE_ADDRESS,
} as const
