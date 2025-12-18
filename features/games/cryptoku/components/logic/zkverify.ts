/**
 * zkVerify Integration for Cryptoku Sudoku Verification
 *
 * This is a copy of the original app-level zkverify helper, scoped locally so
 * the Cryptoku game can be embedded as a self-contained feature.
 */

export interface SudokuBoard {
    board: number[][]
  }
  
  export interface ZkVerifyProofRequest {
    puzzle: number[][]
    solution: number[][]
  }
  
  export interface ZkVerifyProofResponse {
    success: boolean
    proofId?: string
    verified?: boolean
    error?: string
    timestamp?: number
  }
  
  export interface ZkVerifyVerificationResult {
    isValid: boolean
    proofId?: string
    error?: string
    message?: string
  }
  
  export function formatBoardForZkVerify(board: number[][]): number[] {
    return board.flat()
  }
  
  export function isValidBoardFormat(board: number[][]): boolean {
    if (!board || board.length !== 9) return false
  
    for (const row of board) {
      if (!row || row.length !== 9) return false
      for (const cell of row) {
        if (cell < 0 || cell > 9 || !Number.isInteger(cell)) return false
      }
    }
  
    return true
  }
  
  export async function verifySudokuWithZkVerify(
    puzzle: number[][],
    solution: number[][],
  ): Promise<ZkVerifyVerificationResult> {
    const apiKey = process.env.NEXT_PUBLIC_ZKVERIFY_API_KEY
  
    if (!apiKey) {
      console.error("zkVerify API key not configured")
      return {
        isValid: false,
        error: "zkVerify API key not configured",
        message: "Please set NEXT_PUBLIC_ZKVERIFY_API_KEY in your environment",
      }
    }
  
    if (!isValidBoardFormat(puzzle) || !isValidBoardFormat(solution)) {
      return {
        isValid: false,
        error: "Invalid board format",
        message: "Puzzle or solution board has invalid format",
      }
    }
  
    try {
      const formattedPuzzle = formatBoardForZkVerify(puzzle)
      const formattedSolution = formatBoardForZkVerify(solution)
  
      const proofResponse = await submitProofToZkVerify({
        puzzle: formattedPuzzle,
        solution: formattedSolution,
        apiKey,
      })
  
      if (!proofResponse.success) {
        return {
          isValid: false,
          error: proofResponse.error || "Proof submission failed",
          message: "Failed to generate zero-knowledge proof",
        }
      }
  
      const verificationResult = await pollVerificationStatus(proofResponse.proofId!, apiKey)
  
      return {
        isValid: verificationResult.verified || false,
        proofId: proofResponse.proofId,
        message: verificationResult.verified
          ? "Solution verified via zero-knowledge proof"
          : "Solution verification failed",
      }
    } catch (error) {
      console.error("zkVerify verification error:", error)
      console.log("Falling back to mock verification...")
  
      return mockVerifySudoku(puzzle, solution)
    }
  }
  
  async function submitProofToZkVerify(params: {
    puzzle: number[]
    solution: number[]
    apiKey: string
  }): Promise<ZkVerifyProofResponse> {
    const { puzzle, solution, apiKey } = params
    const zkVerifyEndpoint = "https://testnet-rpc.zkverify.io"
  
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
  
      const response = await fetch(`${zkVerifyEndpoint}/submit-proof`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "X-Proof-Type": "sudoku",
        },
        body: JSON.stringify({
          proofType: "sudoku",
          publicInputs: {
            puzzle,
            solution,
          },
          timestamp: Date.now(),
        }),
        signal: controller.signal,
      })
  
      clearTimeout(timeoutId)
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: (errorData as any).message || `HTTP error ${response.status}`,
        }
      }
  
      const data = await response.json()
      return {
        success: true,
        proofId: (data as any).proofId || (data as any).id,
        timestamp: (data as any).timestamp || Date.now(),
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return {
          success: false,
          error: "Request timeout - zkVerify testnet may be unavailable",
        }
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      }
    }
  }
  
  async function pollVerificationStatus(
    proofId: string,
    apiKey: string,
    maxAttempts: number = 10,
    intervalMs: number = 2000,
  ): Promise<{ verified: boolean; error?: string }> {
    const zkVerifyEndpoint = "https://testnet-rpc.zkverify.io"
  
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(`${zkVerifyEndpoint}/proof-status/${proofId}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        })
  
        if (!response.ok) {
          if (attempt === maxAttempts - 1) {
            return { verified: false, error: "Polling timeout" }
          }
          await delay(intervalMs)
          continue
        }
  
        const data = await response.json()
  
        if ((data as any).status === "verified" || (data as any).verified === true) {
          return { verified: true }
        }
        if ((data as any).status === "failed" || (data as any).verified === false) {
          return { verified: false, error: (data as any).error || "Verification failed" }
        }
  
        if (attempt < maxAttempts - 1) {
          await delay(intervalMs)
        }
      } catch (error) {
        if (attempt === maxAttempts - 1) {
          return {
            verified: false,
            error: error instanceof Error ? error.message : "Polling error",
          }
        }
        await delay(intervalMs)
      }
    }
  
    return { verified: false, error: "Verification timeout" }
  }
  
  function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  
  /**
   * Mock verification for development/testing when zkVerify is unavailable.
   * Performs local Sudoku validation only.
   */
  export function mockVerifySudoku(puzzle: number[][], solution: number[][]): ZkVerifyVerificationResult {
    const isComplete = solution.every((row) => row.every((cell) => cell !== 0))
  
    if (!isComplete) {
      return {
        isValid: false,
        message: "Solution is incomplete",
      }
    }
  
    // Validate rows
    for (let r = 0; r < 9; r++) {
      const rowSet = new Set(solution[r])
      if (rowSet.size !== 9 || rowSet.has(0)) {
        return { isValid: false, message: `Invalid row ${r + 1}` }
      }
    }
  
    // Validate columns
    for (let c = 0; c < 9; c++) {
      const colSet = new Set<number>()
      for (let r = 0; r < 9; r++) {
        colSet.add(solution[r][c])
      }
      if (colSet.size !== 9 || colSet.has(0)) {
        return { isValid: false, message: `Invalid column ${c + 1}` }
      }
    }
  
    // Validate 3x3 boxes
    for (let boxR = 0; boxR < 3; boxR++) {
      for (let boxC = 0; boxC < 3; boxC++) {
        const boxSet = new Set<number>()
        for (let r = boxR * 3; r < boxR * 3 + 3; r++) {
          for (let c = boxC * 3; c < boxC * 3 + 3; c++) {
            boxSet.add(solution[r][c])
          }
        }
        if (boxSet.size !== 9 || boxSet.has(0)) {
          return { isValid: false, message: `Invalid box (${boxR + 1}, ${boxC + 1})` }
        }
      }
    }
  
    return {
      isValid: true,
      proofId: "mock-proof-" + Date.now(),
      message: "Solution verified (mock mode)",
    }
  }
  