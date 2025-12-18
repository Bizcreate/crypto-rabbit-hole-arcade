"use client"

import { ConnectButton, useActiveAccount, useActiveWallet, useDisconnect } from "thirdweb/react"
import { thirdwebClient, apeChain } from "@/lib/thirdweb"
import { createWallet } from "thirdweb/wallets"
import { useEffect } from "react"
import { useArcade } from "./providers"

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("app.phantom"),
]

export function WalletConnect() {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { disconnect: disconnectWallet } = useDisconnect()
  const { setWalletConnection, syncProfileWithWallet } = useArcade()

  useEffect(() => {
    if (account?.address && wallet) {
      console.log("[v0] Wallet connected:", account.address)
      setWalletConnection(account.address, wallet)

      // Sync with Supabase profile
      syncProfileWithWallet(account.address).catch((error) => {
        console.error("[v0] Failed to sync profile:", error)
      })
    } else if (!account && !wallet) {
      console.log("[v0] Wallet disconnected")
      setWalletConnection(null, null)
    }
  }, [account, wallet, setWalletConnection, syncProfileWithWallet])

  return (
    <ConnectButton
      client={thirdwebClient}
      wallets={wallets}
      chain={apeChain}
      connectButton={{
        label: "Connect Wallet",
        className:
          "!bg-primary !text-primary-foreground hover:!bg-primary/90 !text-xs md:!text-sm !px-3 md:!px-4 !py-2 !rounded-lg !font-medium",
      }}
      connectModal={{
        size: "compact",
        title: "Connect to Crypto Rabbit Arcade",
        titleIcon: "/images/design-mode/Artboard-1.png",
        showThirdwebBranding: false,
      }}
      detailsButton={{
        displayBalanceToken: {
          [apeChain.id]: "0x0000000000000000000000000000000000000000", // Native APE token
        },
        className:
          "!px-2 md:!px-4 !py-2 !rounded-lg !bg-primary/10 !border !border-primary/20 !font-medium !text-xs md:!text-sm",
      }}
      onDisconnect={() => {
        disconnectWallet(wallet!)
      }}
    />
  )
}
