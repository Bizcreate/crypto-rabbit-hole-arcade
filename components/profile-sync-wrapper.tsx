"use client"

import { useEffect, type ReactNode } from "react"
import { useActiveAccount } from "thirdweb/react"
import { useArcade } from "@/components/providers"

export function ProfileSyncWrapper({ children }: { children: ReactNode }) {
  const account = useActiveAccount()
  const { setWalletConnection, syncProfileWithWallet } = useArcade()

  useEffect(() => {
    if (account?.address) {
      console.log("[v0] Wallet connected:", account.address)
      setWalletConnection(account.address, null)
      syncProfileWithWallet(account.address)
    } else {
      console.log("[v0] Wallet disconnected")
      setWalletConnection(null, null)
    }
  }, [account?.address, setWalletConnection, syncProfileWithWallet])

  return <>{children}</>
}
