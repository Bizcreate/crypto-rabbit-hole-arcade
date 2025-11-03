import { createClient } from "../client"
import type { CardInventory } from "../database.types"

export class CardService {
  private supabase = createClient()

  async getUserCards(userId: string): Promise<CardInventory[]> {
    const { data, error } = await this.supabase
      .from("card_inventory")
      .select("*")
      .eq("user_id", userId)
      .order("acquired_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching cards:", error)
      return []
    }

    return data || []
  }

  async addCard(userId: string, card: Omit<CardInventory, "id" | "user_id" | "acquired_at">): Promise<boolean> {
    const { error } = await this.supabase.from("card_inventory").insert({
      user_id: userId,
      ...card,
    })

    if (error) {
      console.error("[v0] Error adding card:", error)
      return false
    }

    return true
  }

  async stakeCard(userId: string, cardId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("card_inventory")
      .update({
        is_staked: true,
        stake_start_date: new Date().toISOString(),
      })
      .eq("id", cardId)
      .eq("user_id", userId)

    if (error) {
      console.error("[v0] Error staking card:", error)
      return false
    }

    return true
  }

  async unstakeCard(userId: string, cardId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("card_inventory")
      .update({
        is_staked: false,
        stake_start_date: null,
      })
      .eq("id", cardId)
      .eq("user_id", userId)

    if (error) {
      console.error("[v0] Error unstaking card:", error)
      return false
    }

    return true
  }
}
