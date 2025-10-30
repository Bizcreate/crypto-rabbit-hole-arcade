"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Transaction = {
  id: string
  title: string
  status: "prepare" | "sign" | "pending" | "confirmed" | "error"
  hash?: string
  error?: string
}

type ArcadeContextType = {
  tickets: number
  points: number
  txns: Transaction[]
  isConnected: boolean
  address: string | null
  connect: () => void
  disconnect: () => void
  addTxn: (txn: Transaction) => void
  updateTxn: (id: string, updates: Partial<Transaction>) => void
}

const ArcadeContext = createContext<ArcadeContextType | null>(null)

export function Providers({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState(5)
  const [points, setPoints] = useState(1250)
  const [txns, setTxns] = useState<Transaction[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)

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

  return (
    <ArcadeContext.Provider
      value={{
        tickets,
        points,
        txns,
        isConnected,
        address,
        connect,
        disconnect,
        addTxn,
        updateTxn,
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
