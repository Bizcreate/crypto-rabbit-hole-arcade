/**
 * Profile Storage by Wallet Address
 * 
 * Stores user profile data keyed by wallet address so it persists across sessions
 * while still requiring fresh wallet authentication each time.
 */

export interface StoredUserProfile {
  username: string
  avatar: string
  referralCode: string
  referralCount: number
  referralEarnings: number
  joinedAt: string // ISO date string for serialization
  points: number // Accumulated points from gameplay
  tickets: number // Accumulated tickets from gameplay
  stats: {
    gamesPlayed: number
    totalScore: number
    achievements: string[]
  }
}

const PROFILE_KEY_PREFIX = "arcade_profile_"

/**
 * Save user profile by wallet address
 */
export function saveProfileByAddress(address: string, profile: StoredUserProfile): void {
  if (typeof window === "undefined") return
  
  const key = `${PROFILE_KEY_PREFIX}${address.toLowerCase()}`
  try {
    localStorage.setItem(key, JSON.stringify(profile))
    console.log("💾 Saved profile for address:", address.slice(0, 8) + "...")
  } catch (error) {
    console.error("Failed to save profile:", error)
  }
}

/**
 * Load user profile by wallet address
 */
export function loadProfileByAddress(address: string): StoredUserProfile | null {
  if (typeof window === "undefined") return null
  
  const key = `${PROFILE_KEY_PREFIX}${address.toLowerCase()}`
  try {
    const stored = localStorage.getItem(key)
    if (!stored) return null
    
    const profile = JSON.parse(stored) as StoredUserProfile
    console.log("📂 Loaded profile for address:", address.slice(0, 8) + "...")
    return profile
  } catch (error) {
    console.error("Failed to load profile:", error)
    return null
  }
}

/**
 * Clear profile for a specific address (optional - usually not needed)
 */
export function clearProfileByAddress(address: string): void {
  if (typeof window === "undefined") return
  
  const key = `${PROFILE_KEY_PREFIX}${address.toLowerCase()}`
  localStorage.removeItem(key)
  console.log("🗑️ Cleared profile for address:", address.slice(0, 8) + "...")
}

