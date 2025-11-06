"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getGameSession, storeGameSession, getStoredPointUpdates, clearPointUpdates } from "@/lib/game-session"
import { createClient } from "@/lib/supabase/client"
import { ProfileService } from "@/lib/supabase/services/profile.service"
import type { Wallet } from "thirdweb/wallets"

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
  wallet: Wallet | null
  profile: UserProfile
  cards: Card[]
  connect: () => void
  disconnect: () => void
  setWalletConnection: (address: string | null, wallet: Wallet | null) => void
  syncProfileWithWallet: (address: string) => Promise<void>
  addTxn: (txn: Transaction) => void
  updateTxn: (id: string, updates: Partial<Transaction>) => void
  removeTxn: (id: string) => void
  addTickets: (amount: number) => void
  addPoints: (amount: number) => void
  setTickets: (amount: number) => void
  setPoints: (amount: number) => void
  addCard: (card: Card) => void
  generateReferralCode: () => string
  trackReferral: (code: string) => void
  updateProfile: (updates: Partial<UserProfile>) => void
}

const ArcadeContext = createContext<ArcadeContextType | null>(null)

export function Providers({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState(5)
  const [points, setPoints] = useState(1250)
  const [txns, setTxns] = useState<Transaction[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [cards, setCards] = useState<Card[]>([])

  const [profile, setProfile] = useState<UserProfile>({
    username: "CryptoRabbit",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Artboard-1-83QWedD6ivnkXqy5WoMh05oLPpdMO6.png",
    referralCode: "RABBIT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    referralCount: 3,
    referralEarnings: 450,
    joinedAt: new Date("2024-01-15"),
    stats: {
      gamesPlayed: 127,
      totalScore: 15420,
      achievements: ["First Win", "10 Games", "High Roller", "Card Collector"],
    },
  })

  useEffect(() => {
    const session = getGameSession()
    if (session) {
      setTickets(session.tickets)
      setPoints(session.points)
      setProfile((prev) => ({ ...prev, username: session.username }))
      if (session.address) {
        setIsConnected(true)
        setAddress(session.address)
      }
    }

    const updates = getStoredPointUpdates()
    if (updates.length > 0) {
      updates.forEach((update) => {
        setPoints((prev) => prev + update.points)
        setTickets((prev) => prev + update.tickets)
        if (update.achievements) {
          setProfile((prev) => ({
            ...prev,
            stats: {
              ...prev.stats,
              achievements: [...new Set([...prev.stats.achievements, ...update.achievements])],
            },
          }))
        }
      })
      clearPointUpdates()
    }

    const handlePointUpdate = (event: CustomEvent) => {
      const update = event.detail
      setPoints((prev) => prev + update.points)
      setTickets((prev) => prev + update.tickets)
    }

    window.addEventListener("gamePointsUpdated", handlePointUpdate as EventListener)
    return () => {
      window.removeEventListener("gamePointsUpdated", handlePointUpdate as EventListener)
    }
  }, [])

  useEffect(() => {
    if (isConnected || tickets > 0 || points > 0) {
      storeGameSession({
        sessionId: `session_${Date.now()}`,
        userId: profile.username,
        username: profile.username,
        address,
        thirdwebClientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
        tickets,
        points,
        timestamp: Date.now(),
      })
    }
  }, [tickets, points, isConnected, address, profile.username])

  const setWalletConnection = (newAddress: string | null, newWallet: Wallet | null) => {
    setAddress(newAddress)
    setWallet(newWallet)
    setIsConnected(!!newAddress)
  }

  const syncProfileWithWallet = async (walletAddress: string) => {
    try {
      const supabase = createClient()
      const profileService = new ProfileService(supabase)

      const existingProfile = await profileService.getProfileByWallet(walletAddress)

      if (existingProfile) {
        setProfile({
          username: existingProfile.username,
          avatar: existingProfile.avatar_url || profile.avatar,
          referralCode: existingProfile.referral_code,
          referralCount: existingProfile.referral_count,
          referralEarnings: existingProfile.referral_earnings,
          joinedAt: new Date(existingProfile.created_at),
          stats: {
            gamesPlayed: existingProfile.games_played,
            totalScore: existingProfile.total_score,
            achievements: existingProfile.achievements || [],
          },
        })
        setTickets(existingProfile.tickets)
        setPoints(existingProfile.ape_balance)
      } else {
        const newProfile = await profileService.createProfile({
          wallet_address: walletAddress,
          username: `Rabbit${walletAddress.slice(2, 8)}`,
          ape_balance: points,
          tickets: tickets,
          referral_code: profile.referralCode,
        })

        if (newProfile) {
          setProfile((prev) => ({
            ...prev,
            username: newProfile.username,
            referralCode: newProfile.referral_code,
            joinedAt: new Date(newProfile.created_at),
          }))
        }
      }
    } catch (error) {
      console.error("[v0] Error syncing profile:", error)
    }
  }

  const connect = () => {
    console.log("[v0] Use WalletConnect component to connect wallet")
  }

  const disconnect = () => {
    console.log("[v0] Use WalletConnect component to disconnect wallet")
  }

  const addTxn = (txn: Transaction) => {
    setTxns((prev) => [txn, ...prev])
  }

  const updateTxn = (id: string, updates: Partial<Transaction>) => {
    setTxns((prev) => prev.map((txn) => (txn.id === id ? { ...txn, ...updates } : txn)))
  }

  const removeTxn = (id: string) => {
    setTxns((prev) => prev.filter((txn) => txn.id !== id))
  }

  const addTickets = (amount: number) => {
    setTickets((prev) => prev + amount)
  }

  const addPoints = (amount: number) => {
    setPoints((prev) => prev + amount)
  }

  const setTicketsValue = (amount: number) => {
    setTickets(amount)
  }

  const setPointsValue = (amount: number) => {
    setPoints(amount)
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
    setProfile((prev) => ({ ...prev, ...updates }))
  }

  return (
    <ArcadeContext.Provider
      value={{
        tickets,
        points,
        txns,
        isConnected,
        address,
        wallet,
        profile,
        cards,
        connect,
        disconnect,
        setWalletConnection,
        syncProfileWithWallet,
        addTxn,
        updateTxn,
        removeTxn,
        addTickets,
        addPoints,
        setTickets: setTicketsValue,
        setPoints: setPointsValue,
        addCard,
        generateReferralCode,
        trackReferral,
        updateProfile,
      }}
    >
      {children}
    </ArcadeContext.Provider>
  )
}

export function useArcade() {
  const context = useContext(ArcadeContext)
  if (!context) {
    throw new Error("useArcade must be used within Providers")
  }
  return context
}
