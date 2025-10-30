import { ENV } from "@/lib/env"
import { getWalletClient } from "@wagmi/core"

const ABI = [
  {
    type: "function",
    name: "send",
    stateMutability: "payable",
    inputs: [
      { name: "_dstEid", type: "uint32" },
      { name: "_to", type: "bytes32" },
      { name: "_amountLD", type: "uint256" },
      { name: "_minAmountLD", type: "uint256" },
      { name: "_options", type: "bytes" },
      { name: "_composeMsg", type: "bytes" },
      { name: "_refundAddress", type: "address" },
    ],
    outputs: [{ name: "guid", type: "bytes32" }],
  },
] as const

export async function bridgeApe(to: `0x${string}`, amountWei: bigint) {
  if (!ENV.APE_OFT) throw new Error("APE OFT not set")

  const wc = await getWalletClient()
  if (!wc) throw new Error("Wallet not connected")

  const res = await wc.writeContract({
    address: ENV.APE_OFT as `0x${string}`,
    abi: ABI,
    functionName: "send",
    value: 0n,
    args: [Number(ENV.LZ_DST_EID), to as any, amountWei, 0n, "0x", "0x", to],
  })

  return res
}
