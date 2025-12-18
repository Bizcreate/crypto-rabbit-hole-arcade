import { createClient } from "../client"
import type { Profile } from "../database.types"

export class ProfileService {
  private supabase = createClient()

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("[v0] Error fetching profile:", error)
      return null
    }

    return data
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
    const { error } = await this.supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)

    if (error) {
      console.error("[v0] Error updating profile:", error)
      return false
    }

    return true
  }

  async updateBalance(userId: string, apeChange = 0, ticketChange = 0, pointsChange = 0): Promise<boolean> {
    const { error } = await this.supabase.rpc("update_user_balance", {
      p_user_id: userId,
      p_ape_change: apeChange,
      p_ticket_change: ticketChange,
      p_points_change: pointsChange,
    })

    if (error) {
      console.error("[v0] Error updating balance:", error)
      return false
    }

    return true
  }

  async recordGameResult(userId: string, won: boolean, pointsEarned: number): Promise<boolean> {
    const { error } = await this.supabase.rpc("record_game_result", {
      p_user_id: userId,
      p_won: won,
      p_points_earned: pointsEarned,
    })

    if (error) {
      console.error("[v0] Error recording game result:", error)
      return false
    }

    return true
  }
}
