import { defineChain } from "thirdweb/chains"

export const apeChainMainnet = defineChain({
  id: 33139,
  name: "ApeChain",
  nativeCurrency: { name: "ApeCoin", symbol: "APE", decimals: 18 },
  rpc: "https://rpc.apechain.com",
  blockExplorers: [{ name: "ApeScan", url: "https://apescan.io" }],
  testnet: false,
})

export const apeChainTestnet = defineChain({
  id: 33111,
  name: "ApeChain Curtis",
  nativeCurrency: { name: "ApeCoin", symbol: "APE", decimals: 18 },
  rpc: "https://curtis.rpc.caldera.xyz/http",
  blockExplorers: [{ name: "ApeScan Curtis", url: "https://curtis.explorer.caldera.xyz" }],
  testnet: true,
})
