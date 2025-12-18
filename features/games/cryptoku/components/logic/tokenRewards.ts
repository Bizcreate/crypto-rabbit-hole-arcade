// Lightweight local token reward helpers for Cryptoku.
// These mirror the original behaviour but avoid any on-chain or thirdweb dependencies.

import type { Difficulty } from "./playerStats"

// Reward amounts for different difficulty levels (RHT-style points)
const REWARDS: Record<Difficulty, number> = {
  noob: 0,
  degen: 1,
  ape: 3,
}

const BALANCE_KEY_PREFIX = "cryptoku_rht_balance_"

export function getRewardForDifficulty(difficulty: Difficulty): number {
  return REWARDS[difficulty]
}

export function getUserLocalBalance(playerAddress: string): number {
  if (typeof window === "undefined") return 0
  const key = BALANCE_KEY_PREFIX + playerAddress.toLowerCase()
  const stored = window.localStorage.getItem(key)
  return stored ? parseInt(stored, 10) || 0 : 0
}

export function setUserLocalBalance(playerAddress: string, amount: number): void {
  if (typeof window === "undefined") return
  const key = BALANCE_KEY_PREFIX + playerAddress.toLowerCase()
  window.localStorage.setItem(key, Math.max(0, Math.floor(amount)).toString())
}

export function updateUserLocalBalance(playerAddress: string, delta: number): number {
  if (typeof window === "undefined") return 0
  const current = getUserLocalBalance(playerAddress)
  const next = Math.max(0, current + delta)
  const key = BALANCE_KEY_PREFIX + playerAddress.toLowerCase()
  window.localStorage.setItem(key, next.toString())
  return next
}