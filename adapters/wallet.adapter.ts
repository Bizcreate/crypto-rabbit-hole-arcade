import { getContract, readContract } from "thirdweb"
import { APE_ADDRESS } from "./well-known"
import { thirdwebClient } from "@/lib/thirdweb"
import { apeChainMainnet } from "@/lib/chains"

export async function getApeBalance(address: string): Promise<string> {
  if (!address) return "0"

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
  } catch (error) {
    console.error("Error fetching APE balance:", error)
    return "0"
  }
}
