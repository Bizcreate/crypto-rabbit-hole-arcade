import { ENV } from "@/lib/env"

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
    const randomBytes = crypto.getRandomValues(new Uint8Array(32))
    const requestId =
      "0x" +
      Array.from(randomBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return { requestId }
  } catch (e: any) {
    return { error: e?.message || "Entropy request failed" }
  }
}
