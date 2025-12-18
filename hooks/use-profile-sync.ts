"use client"

import { useEffect, useCallback } from "react"
import { useActiveAccount } from "thirdweb/react"
import { useArcade } from "@/components/providers"
import { ProfileService } from "@/lib/supabase/services/profile.service"
import { createGameSession, storeGameSession } from "@/lib/game-session"

export function useProfileSync() {
  const account = useActiveAccount()
  const { profile, tickets, points, updateProfile, setTickets, setPoints } = useArcade()

  const syncProfile = useCallback(async () => {
    if (!account?.address) return

    try {
      // Get or create profile in Supabase
      let supabaseProfile = await ProfileService.getProfile(account.address)

      if (!supabaseProfile) {
        // Create new profile
        supabaseProfile = await ProfileService.createProfile({
          wallet_address: account.address,
          username: profile.username || `Player${account.address.slice(2, 8)}`,
          ape_balance: points,
          ticket_balance: tickets,
        })
      } else {
        // Update existing profile with current balances
        await ProfileService.updateBalance(account.address, {
          ape_balance: points,
          ticket_balance: tickets,
        })
      }

      // Update local profile with Supabase data
      if (supabaseProfile) {
        updateProfile({
          username: supabaseProfile.username,
          avatar: supabaseProfile.avatar_url || undefined,
        })
        setTickets(supabaseProfile.ticket_balance)
        setPoints(supabaseProfile.ape_balance)

        // Create and store game session for cross-game access
        const session = createGameSession({
          userId: supabaseProfile.id,
          username: supabaseProfile.username,
          address: account.address,
          tickets: supabaseProfile.ticket_balance,
          points: supabaseProfile.ape_balance,
        })
        storeGameSession(session)
      }
    } catch (error) {
      console.error("[v0] Failed to sync profile:", error)
    }
  }, [account?.address, profile.username, points, tickets, updateProfile, setTickets, setPoints])

  // Sync on wallet connection
  useEffect(() => {
    if (account?.address) {
      syncProfile()
    }
  }, [account?.address, syncProfile])

  return { syncProfile }
}
