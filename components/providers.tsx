"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ThirdwebProvider } from "thirdweb/react"
import { createWallet } from "thirdweb/wallets"
import { thirdwebClient } from "@/lib/thirdweb"
import { apeChainMainnet } from "@/lib/chains"
import { getApeBalance } from "@/adapters/wallet.adapter"
import {
  getAuthToken,
  storeAuthToken,
  clearAuthToken,
  getWalletInfo,
  type AuthResult,
} from "@/lib/auth"
import { saveProfileByAddress, loadProfileByAddress } from "@/lib/profile-storage"
import {
  createArcadeSession,
  updateArcadeSession,
  clearArcadeSession,
  getArcadeSession,
} from "@/lib/arcade-session"
import { ENV } from "@/lib/env"

type Transaction = {
  id: string
  title: string
  status: "prepare" | "sign" | "pending" | "confirmed" | "error"
  hash?: string
  error?: string
}

type UserProfile = {
  username: string
  avatar: string
  referralCode: string
  referralCount: number
  referralEarnings: number
  joinedAt: Date
  stats: {
    gamesPlayed: number
    totalScore: number
    achievements: string[]
  }
}

type Card = {
  id: string
  name: string
  image: string
  rarity: "common" | "rare" | "epic" | "legendary"
  power: number
}

type ArcadeContextType = {
  tickets: number
  points: number
  txns: Transaction[]
  isConnected: boolean
  address: string | null
  apeBalance: string
  profile: UserProfile
  cards: Card[]
  isAuthenticated: boolean
  authToken: string | null
  connect: () => void | Promise<void>
  disconnect: () => void | Promise<void>
  handleAuthSuccess: (result: AuthResult) => Promise<void>
  logout: () => void
  addTxn: (txn: Transaction) => void
  updateTxn: (id: string, updates: Partial<Transaction>) => void
  addTickets: (amount: number) => void
  addPoints: (amount: number) => void
  addCard: (card: Card) => void
  generateReferralCode: () => string
  trackReferral: (code: string) => void
  updateProfile: (updates: Partial<UserProfile>) => void
}

const ArcadeContext = createContext<ArcadeContextType | null>(null)

const metamaskWallet = createWallet("io.metamask")

export function Providers({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState(0)
  const [points, setPoints] = useState(0) // Will be loaded from profile storage
  const [txns, setTxns] = useState<Transaction[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [apeBalance, setApeBalance] = useState<string>("0.0000")
  const [cards, setCards] = useState<Card[]>([])
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [profile, setProfile] = useState<UserProfile>({
    username: "Guest",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Artboard-1-83QWedD6ivnkXqy5WoMh05oLPpdMO6.png",
    referralCode: "RABBIT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    referralCount: 0,
    referralEarnings: 0,
    joinedAt: new Date(),
    stats: {
      gamesPlayed: 0,
      totalScore: 0,
      achievements: [],
    },
  })

  // Don't auto-load auth token on mount - require fresh sign-in each time
  // This ensures security and prevents unauthorized access from shared computers
  useEffect(() => {
    // Clear any existing auth tokens on mount to force fresh login
    clearAuthToken()
    clearArcadeSession()
    setAuthToken(null)
    setIsAuthenticated(false)
    setIsConnected(false)
    setAddress(null)

    // Listen for game point updates (from embedded games)
    const handleGamePointsUpdated = (event: CustomEvent) => {
      const update = event.detail
      if (update.gameId && update.points !== undefined) {
        addPoints(update.points)
        if (update.tickets !== undefined) {
          addTickets(update.tickets)
        }
      }
    }

    window.addEventListener('gamePointsUpdated', handleGamePointsUpdated as EventListener)
    return () => {
      window.removeEventListener('gamePointsUpdated', handleGamePointsUpdated as EventListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadUserInfo(token: string) {
    try {
      // Only try to load user info if token is a valid auth token format
      // External wallets use addresses as tokens (0x...42 chars), skip API call for those
      // Auth tokens from thirdweb are JWT tokens (don't start with 0x)
      if (token.startsWith("0x") && token.length === 42) {
        // This is an address (external wallet), skip API call but load saved profile
        console.log("External wallet address used as token, loading saved profile if available")
        
        // Check if we have a saved profile for this address
        const savedProfile = loadProfileByAddress(token)
        if (savedProfile) {
        // Use saved profile data (preserves username, avatar, stats, points, tickets, etc.)
        setProfile({
          username: savedProfile.username,
          avatar: savedProfile.avatar,
          referralCode: savedProfile.referralCode,
          referralCount: savedProfile.referralCount,
          referralEarnings: savedProfile.referralEarnings,
          joinedAt: new Date(savedProfile.joinedAt),
          stats: savedProfile.stats,
        })
        // Restore accumulated points and tickets
        setPoints(savedProfile.points || 0)
        setTickets(savedProfile.tickets || 0)
        console.log("📂 Restored saved profile for external wallet")
        }
        return
      }
      
      // This is likely an auth token, try to get wallet info
      const walletInfo = await getWalletInfo(token)
      setAddress(walletInfo.address)
      setIsConnected(true)
      
      // Fetch balance asynchronously (don't block on it)
      refreshApeBalanceFor(walletInfo.address).catch((error) => {
        console.warn("Balance fetch failed (non-blocking):", error)
      })

      // Check if we have a saved profile for this address
      const savedProfile = loadProfileByAddress(walletInfo.address)
      
      if (savedProfile) {
        // Use saved profile data (preserves username, avatar, stats, points, tickets, etc.)
        setProfile({
          username: savedProfile.username,
          avatar: savedProfile.avatar,
          referralCode: savedProfile.referralCode,
          referralCount: savedProfile.referralCount,
          referralEarnings: savedProfile.referralEarnings,
          joinedAt: new Date(savedProfile.joinedAt),
          stats: savedProfile.stats,
        })
        // Restore accumulated points and tickets
        setPoints(savedProfile.points || 0)
        setTickets(savedProfile.tickets || 0)
      } else {
        // New user - extract email from profiles if available
        const emailProfile = walletInfo.profiles.find((p) => p.type === "email" && p.email)
        const username = emailProfile?.email?.split("@")[0] || 
                         walletInfo.address.slice(0, 6) + "..." + walletInfo.address.slice(-4)

        // Update profile with authenticated user info
        setProfile((prev) => ({
          ...prev,
          username,
          joinedAt: new Date(walletInfo.createdAt),
        }))
      }

      // Create or update arcade session
      const clientId = ENV.THIRDWEB_CLIENT_ID || process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || ""
      const existingSession = getArcadeSession()
      
      if (existingSession && existingSession.userId === walletInfo.address) {
        // Update existing session
        updateArcadeSession({
          username,
          address: walletInfo.address,
          thirdwebClientId: clientId,
          tickets,
          points,
          avatar: profile.avatar,
        })
      } else {
        // Create new session
        createArcadeSession({
          userId: walletInfo.address,
          username,
          address: walletInfo.address,
          thirdwebClientId: clientId,
          tickets,
          points,
          avatar: profile.avatar,
        })
      }
    } catch (error) {
      console.error("Failed to load user info", error)
      // If token is invalid, clear it
      clearAuthToken()
      clearArcadeSession()
      setAuthToken(null)
      setIsAuthenticated(false)
    }
  }

  async function handleAuthSuccess(result: AuthResult) {
    storeAuthToken(result.token)
    setAuthToken(result.token)
    setIsAuthenticated(true)
    setAddress(result.walletAddress)
    setIsConnected(true)
    
    // Fetch balance asynchronously (don't block on it)
    // This prevents connection errors from blocking the auth flow
    refreshApeBalanceFor(result.walletAddress).catch((error) => {
      console.warn("Balance fetch failed (non-blocking):", error)
    })

    // Try to load saved profile for this wallet address
    const savedProfile = loadProfileByAddress(result.walletAddress)
    
    let usernameToUse: string
    let avatarToUse: string
    
    if (savedProfile) {
      // Restore saved profile data (username, avatar, stats, points, tickets, etc.)
      setProfile({
        username: savedProfile.username,
        avatar: savedProfile.avatar,
        referralCode: savedProfile.referralCode,
        referralCount: savedProfile.referralCount,
        referralEarnings: savedProfile.referralEarnings,
        joinedAt: new Date(savedProfile.joinedAt),
        stats: savedProfile.stats,
      })
      // Restore accumulated points and tickets
      setPoints(savedProfile.points || 0)
      setTickets(savedProfile.tickets || 0)
      usernameToUse = savedProfile.username
      avatarToUse = savedProfile.avatar
      console.log("📂 Restored saved profile for wallet:", result.walletAddress.slice(0, 8) + "...")
    } else {
      // New user or no saved profile - try to get info from thirdweb API
      // For external wallets, loadUserInfo will load saved profile if it exists
      await loadUserInfo(result.token)
      
      // After loadUserInfo, re-check for saved profile (loadUserInfo loads it for external wallets)
      const profileAfterLoad = loadProfileByAddress(result.walletAddress)
      if (profileAfterLoad) {
        usernameToUse = profileAfterLoad.username
        avatarToUse = profileAfterLoad.avatar
        // Restore accumulated points and tickets
        setPoints(profileAfterLoad.points || 0)
        setTickets(profileAfterLoad.tickets || 0)
        console.log("📂 Loaded saved profile via loadUserInfo with points:", profileAfterLoad.points || 0, "tickets:", profileAfterLoad.tickets || 0)
      } else {
        // No saved profile found - use defaults
        usernameToUse = result.walletAddress.slice(0, 6) + "..." + result.walletAddress.slice(-4)
        avatarToUse = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Artboard-1-83QWedD6ivnkXqy5WoMh05oLPpdMO6.png"
      }
    }

    // Create arcade session for sharing with games
    const clientId = ENV.THIRDWEB_CLIENT_ID || process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || ""
    const finalUsername = usernameToUse || result.walletAddress.slice(0, 6) + "..." + result.walletAddress.slice(-4)
    
    createArcadeSession({
      userId: result.walletAddress, // Use wallet address as user ID
      username: finalUsername,
      address: result.walletAddress,
      thirdwebClientId: clientId, // Share Client ID with games
      tickets,
      points,
      avatar: avatarToUse,
    })

    console.log("✅ Arcade session created and shared with games")
  }

  function logout() {
    // Save current profile before logout so it persists
    const currentAddress = address
    if (currentAddress && isAuthenticated) {
      saveProfileByAddress(currentAddress, {
        username: profile.username,
        avatar: profile.avatar,
        referralCode: profile.referralCode,
        referralCount: profile.referralCount,
        referralEarnings: profile.referralEarnings,
        joinedAt: profile.joinedAt.toISOString(),
        points: points, // Save accumulated points
        tickets: tickets, // Save accumulated tickets
        stats: profile.stats,
      })
    }
    
    clearAuthToken()
    clearArcadeSession() // Clear shared session
    setAuthToken(null)
    setIsAuthenticated(false)
    setIsConnected(false)
    setAddress(null)
    setApeBalance("0.0000")
    
    // Reset to default guest profile (profile data persists in localStorage by address)
    setProfile({
      username: "Guest",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Artboard-1-83QWedD6ivnkXqy5WoMh05oLPpdMO6.png",
      referralCode: "RABBIT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      referralCount: 0,
      referralEarnings: 0,
      joinedAt: new Date(),
      stats: {
        gamesPlayed: 0,
        totalScore: 0,
        achievements: [],
      },
    })
    
    // Clear thirdweb's stored wallet connections (but NOT profile data)
    if (typeof window !== "undefined") {
      // Clear thirdweb's localStorage keys (but preserve arcade_profile_* keys)
      const keysToRemove: string[] = []
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i)
        if (key && (key.startsWith("thirdweb") || key.startsWith("wagmi")) && !key.startsWith("arcade_profile_")) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => window.localStorage.removeItem(key))
      console.log("🧹 Cleared wallet connections on logout (profile data preserved)")
    }
  }

  async function refreshApeBalanceFor(addressToUse: string | null) {
    if (!addressToUse) {
      setApeBalance("0.0000")
      return
    }
    
    // Add a small delay to ensure wallet is fully connected
    // This prevents errors from reading contract before wallet is ready
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      const balance = await getApeBalance(addressToUse)
      setApeBalance(balance)
    } catch (error: any) {
      // Suppress AbiDecodingZeroDataError - it's a transient issue
      if (error?.message?.includes("Cannot decode zero data") || 
          error?.name === "AbiDecodingZeroDataError") {
        console.warn("Balance fetch failed, will retry later")
        setApeBalance("0.0000")
        return
      }
      console.error("Failed to refresh APE balance", error)
      setApeBalance("0.0000")
    }
  }

  const connect = async () => {
    try {
      const account = await metamaskWallet.connect({
        client: thirdwebClient,
        chain: apeChainMainnet,
      })
      setIsConnected(true)
      setAddress(account.address)
      
      // Fetch balance asynchronously (don't block on it)
      refreshApeBalanceFor(account.address).catch((error) => {
        console.warn("Balance fetch failed (non-blocking):", error)
      })
      
      // If not authenticated, update profile with wallet address
      if (!isAuthenticated) {
        const walletUsername = account.address.slice(0, 6) + "..." + account.address.slice(-4)
        setProfile((prev) => ({
          ...prev,
          username: walletUsername,
        }))
      }
    } catch (error) {
      console.error("Wallet connection failed", error)
    }
  }

  const disconnect = async () => {
    // If authenticated, logout handles all cleanup including wallet disconnect
    if (isAuthenticated) {
      logout()
    } else {
      // For non-authenticated connections, just clear local state
      setIsConnected(false)
      setAddress(null)
      setApeBalance("0.0000")
    }
  }

  const addTxn = (txn: Transaction) => {
    setTxns((prev) => [txn, ...prev])
  }

  const updateTxn = (id: string, updates: Partial<Transaction>) => {
    setTxns((prev) => prev.map((txn) => (txn.id === id ? { ...txn, ...updates } : txn)))
  }

  const addTickets = (amount: number) => {
    setTickets((prev) => {
      const newTickets = prev + amount
      // Update session when tickets change
      if (isAuthenticated) {
        updateArcadeSession({ tickets: newTickets })
      }
      // Save to profile storage to persist accumulated tickets
      // Save even if not fully authenticated, as long as we have an address
      if (address) {
        const savedProfile = loadProfileByAddress(address)
        if (savedProfile) {
          saveProfileByAddress(address, {
            ...savedProfile,
            tickets: newTickets,
            points: points, // Include current points
          })
        } else {
          // If no saved profile exists, create minimal profile entry
          const minimalProfile = {
            username: address.slice(0, 6) + "..." + address.slice(-4),
            avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Artboard-1-83QWedD6ivnkXqy5WoMh05oLPpdMO6.png",
            referralCode: "RABBIT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
            referralCount: 0,
            referralEarnings: 0,
            joinedAt: new Date().toISOString(),
            points: points || 0,
            tickets: newTickets,
            stats: {
              gamesPlayed: 0,
              totalScore: 0,
              achievements: [],
            },
          }
          saveProfileByAddress(address, minimalProfile)
        }
      }
      return newTickets
    })
  }

  const addPoints = (amount: number) => {
    console.log("➕ addPoints called with amount:", amount)
    setPoints((prev) => {
      const newPoints = prev + amount
      console.log("💰 Points updated:", prev, "->", newPoints)
      // Update session when points change
      if (isAuthenticated) {
        updateArcadeSession({ points: newPoints })
      }
      // Save to profile storage to persist accumulated points
      // Save even if not fully authenticated, as long as we have an address
      if (address) {
        const savedProfile = loadProfileByAddress(address)
        if (savedProfile) {
          saveProfileByAddress(address, {
            ...savedProfile,
            points: newPoints,
            tickets: tickets, // Include current tickets
          })
          console.log("💾 Saved points to profile:", newPoints)
        } else {
          // If no saved profile exists, we still want to save points
          // Create a minimal profile entry for this address
          const minimalProfile = {
            username: address.slice(0, 6) + "..." + address.slice(-4),
            avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Artboard-1-83QWedD6ivnkXqy5WoMh05oLPpdMO6.png",
            referralCode: "RABBIT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
            referralCount: 0,
            referralEarnings: 0,
            joinedAt: new Date().toISOString(),
            points: newPoints,
            tickets: tickets,
            stats: {
              gamesPlayed: 0,
              totalScore: 0,
              achievements: [],
            },
          }
          saveProfileByAddress(address, minimalProfile)
          console.log("💾 Created new profile entry with points:", newPoints)
        }
      } else {
        console.warn("⚠️ No address available when trying to save points")
      }
      return newPoints
    })
  }

  const addCard = (card: Card) => {
    setCards((prev) => [...prev, card])
  }

  const generateReferralCode = () => {
    const newCode = "RABBIT" + Math.random().toString(36).substring(2, 8).toUpperCase()
    setProfile((prev) => ({ ...prev, referralCode: newCode }))
    return newCode
  }

  const trackReferral = (code: string) => {
    setProfile((prev) => ({
      ...prev,
      referralCount: prev.referralCount + 1,
      referralEarnings: prev.referralEarnings + 150,
    }))
    setTickets((prev) => prev + 5)
    setPoints((prev) => prev + 150)
  }

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates }
      
      // Save profile to localStorage keyed by wallet address
      if (address && isAuthenticated) {
        saveProfileByAddress(address, {
          username: updated.username,
          avatar: updated.avatar,
          referralCode: updated.referralCode,
          referralCount: updated.referralCount,
          referralEarnings: updated.referralEarnings,
          joinedAt: updated.joinedAt.toISOString(),
          points: points, // Include current accumulated points
          tickets: tickets, // Include current accumulated tickets
          stats: updated.stats,
        })
      }
      
      // Update session when profile changes
      if (isAuthenticated) {
        updateArcadeSession({
          username: updated.username,
          avatar: updated.avatar,
        })
      }
      return updated
    })
  }

  // Auto-save profile whenever it changes (for stats updates from games, etc.)
  useEffect(() => {
    if (address && isAuthenticated) {
      saveProfileByAddress(address, {
        username: profile.username,
        avatar: profile.avatar,
        referralCode: profile.referralCode,
        referralCount: profile.referralCount,
        referralEarnings: profile.referralEarnings,
        joinedAt: profile.joinedAt.toISOString(),
        points: points, // Include current accumulated points
        tickets: tickets, // Include current accumulated tickets
        stats: profile.stats,
      })
    }
  }, [address, isAuthenticated, profile.username, profile.avatar, profile.referralCode, profile.referralCount, profile.referralEarnings, profile.stats.gamesPlayed, profile.stats.totalScore, profile.stats.achievements.length, points, tickets])

  return (
    <ThirdwebProvider client={thirdwebClient}>
      <ArcadeContext.Provider
        value={{
          tickets,
          points,
          txns,
          isConnected,
          address,
          apeBalance,
          profile,
          cards,
          isAuthenticated,
          authToken,
          connect,
          disconnect,
          handleAuthSuccess,
          logout,
          addTxn,
          updateTxn,
          addTickets,
          addPoints,
          addCard,
          generateReferralCode,
          trackReferral,
          updateProfile,
        }}
      >
        {children}
      </ArcadeContext.Provider>
    </ThirdwebProvider>
  )
}

export function useArcade() {
  const context = useContext(ArcadeContext)
  if (!context) {
    throw new Error("useArcade must be used within Providers")
  }
  return context
}
