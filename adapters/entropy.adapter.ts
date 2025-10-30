import { ENV } from "@/lib/env"
import { getWalletClient } from "@wagmi/core"
import { keccak256, toBytes } from "viem"

const ABI = [
  {
    type: "function",
    name: "requestUint64",
    stateMutability: "nonpayable",
    inputs: [
      { name: "keyHash", type: "bytes32" },
      { name: "userSeed", type: "uint256" },
    ],
    outputs: [{ name: "requestId", type: "bytes32" }],
  },
] as const

export async function requestEntropy(): Promise<{ requestId?: string; error?: string }> {
  if (!ENV.PYTH_ENTROPY) return { error: "Entropy address not set" }

  try {
    const wc = await getWalletClient()
    if (!wc) return { error: "Wallet not connected" }

    const salt = crypto.getRandomValues(new Uint32Array(2)).join("")
    const keyHash = keccak256(toBytes("CRH_ARCADE_PACKS_V1"))

    const hash = await wc.writeContract({
      address: ENV.PYTH_ENTROPY as `0x${string}`,
      abi: ABI,
      functionName: "requestUint64",
      args: [keyHash, BigInt(salt)],
    })

    return { requestId: hash }
  } catch (e: any) {
    return { error: e?.shortMessage || e?.message || "Entropy request failed" }
  }
}
