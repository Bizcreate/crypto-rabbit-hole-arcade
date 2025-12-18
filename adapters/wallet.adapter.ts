import { getContract, readContract } from "thirdweb"
import { APE_ADDRESS } from "./well-known"
import { thirdwebClient } from "@/lib/thirdweb"
import { apeChainMainnet } from "@/lib/chains"

export async function getApeBalance(address: string): Promise<string> {
  if (!address) return "0.0000"

  try {
    const contract = getContract({
      client: thirdwebClient,
      chain: apeChainMainnet,
      address: APE_ADDRESS,
    })

    const balance = await readContract({
      contract,
      method: "function balanceOf(address) view returns (uint256)",
      params: [address],
    })

    return (Number(balance) / 1e18).toFixed(4)
  } catch (error: any) {
    // Handle specific errors gracefully
    if (error?.message?.includes("Cannot decode zero data") || 
        error?.name === "AbiDecodingZeroDataError") {
      // Contract call returned empty data - wallet might not be ready or contract issue
      console.warn("Balance fetch returned empty data, wallet may not be ready yet")
      return "0.0000"
    }
    console.error("Error fetching APE balance:", error)
    return "0.0000"
  }
}
