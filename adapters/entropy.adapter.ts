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
  try {
    // Mock implementation for demo - generates a random request ID
    const randomId = crypto
      .getRandomValues(new Uint32Array(4))
      .reduce((acc, val) => acc + val.toString(16).padStart(8, "0"), "0x")

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return { requestId: randomId }
  } catch (e: any) {
    return { error: e?.message || "Entropy request failed" }
  }
}
