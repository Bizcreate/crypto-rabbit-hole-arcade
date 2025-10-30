"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

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
  profile: UserProfile
  cards: Card[]
  connect: () => void
  disconnect: () => void
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

export function Providers({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState(5)
  const [points, setPoints] = useState(1250)
  const [txns, setTxns] = useState<Transaction[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
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

  const connect = () => {
    setIsConnected(true)
    setAddress("0x" + Math.random().toString(16).slice(2, 42))
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
  }

  const addTxn = (txn: Transaction) => {
    setTxns((prev) => [txn, ...prev])
  }

  const updateTxn = (id: string, updates: Partial<Transaction>) => {
    setTxns((prev) => prev.map((txn) => (txn.id === id ? { ...txn, ...updates } : txn)))
  }

  const addTickets = (amount: number) => {
    setTickets((prev) => prev + amount)
  }

  const addPoints = (amount: number) => {
    setPoints((prev) => prev + amount)
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
        profile,
        cards,
        connect,
        disconnect,
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
  )
}

export function useArcade() {
  const context = useContext(ArcadeContext)
  if (!context) {
    throw new Error("useArcade must be used within Providers")
  }
  return context
}
