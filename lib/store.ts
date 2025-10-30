import { create } from "zustand"

export type Txn = {
  id: string
  title: string
  status: "prepare" | "sign" | "pending" | "confirmed" | "error"
  hash?: string
  error?: string
}

type ArcadeState = {
  tickets: number
  points: number
  txns: Txn[]
  addTxn: (t: Txn) => void
  updateTxn: (id: string, patch: Partial<Txn>) => void
  addTickets: (amount: number) => void
  addPoints: (amount: number) => void
}

export const useArcade = create<ArcadeState>((set) => ({
  tickets: 42,
  points: 1337,
  txns: [],
  addTxn: (t) => set((s) => ({ txns: [t, ...s.txns] })),
  updateTxn: (id, patch) =>
    set((s) => ({
      txns: s.txns.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    })),
  addTickets: (amount) => set((s) => ({ tickets: s.tickets + amount })),
  addPoints: (amount) => set((s) => ({ points: s.points + amount })),
}))
