import { GameMode } from '../types/game'

// Australian Central Daylight Time (ACDT) - Adelaide, South Australia
// ACDT is UTC+10:30
const ACDT_OFFSET = 10.5 * 60 * 60 * 1000 // 10.5 hours in milliseconds

export interface DailyFreeGame {
  gameMode: GameMode
  walletAddress: string
  dateUsed: string // YYYY-MM-DD format in ACDT
  timestamp: number
}

export class DailyFreeGameService {
  private static getACDTDate(): string {
    const now = new Date()
    const acdtTime = new Date(now.getTime() + ACDT_OFFSET)
    return acdtTime.toISOString().split('T')[0] // YYYY-MM-DD format
  }

  private static getStorageKey(walletAddress: string): string {
    return `dailyFreeGames_${walletAddress.toLowerCase()}`
  }

  static hasUsedDailyFreeGame(walletAddress: string, gameMode: GameMode): boolean {
    if (!walletAddress) return false
    
    const storageKey = this.getStorageKey(walletAddress)
    const stored = localStorage.getItem(storageKey)
    
    if (!stored) return false
    
    try {
      const dailyGames: DailyFreeGame[] = JSON.parse(stored)
      const today = this.getACDTDate()
      
      return dailyGames.some(game => 
        game.gameMode === gameMode && 
        game.dateUsed === today
      )
    } catch (error) {
      console.error('Error parsing daily free games:', error)
      return false
    }
  }

  static useDailyFreeGame(walletAddress: string, gameMode: GameMode): void {
    if (!walletAddress) return
    
    const storageKey = this.getStorageKey(walletAddress)
    const today = this.getACDTDate()
    const now = Date.now()
    
    let dailyGames: DailyFreeGame[] = []
    
    // Get existing games
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        dailyGames = JSON.parse(stored)
      } catch (error) {
        console.error('Error parsing existing daily free games:', error)
        dailyGames = []
      }
    }
    
    // Remove old entries (older than today)
    dailyGames = dailyGames.filter(game => game.dateUsed === today)
    
    // Add new entry
    dailyGames.push({
      gameMode,
      walletAddress: walletAddress.toLowerCase(),
      dateUsed: today,
      timestamp: now
    })
    
    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(dailyGames))
  }

  static getDailyFreeGamesRemaining(walletAddress: string): { aida: boolean, enj1n: boolean } {
    if (!walletAddress) return { aida: false, enj1n: false }
    
    return {
      aida: !this.hasUsedDailyFreeGame(walletAddress, 'aida'),
      enj1n: !this.hasUsedDailyFreeGame(walletAddress, 'enj1n')
    }
  }

  static getNextResetTime(): Date {
    const now = new Date()
    const acdtTime = new Date(now.getTime() + ACDT_OFFSET)
    
    // Get tomorrow at midnight ACDT
    const tomorrow = new Date(acdtTime)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    // Convert back to local time
    return new Date(tomorrow.getTime() - ACDT_OFFSET)
  }

  static formatTimeUntilReset(): string {
    const resetTime = this.getNextResetTime()
    const now = new Date()
    const diff = resetTime.getTime() - now.getTime()
    
    if (diff <= 0) return 'Available now'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  static isEligibleForDailyFree(walletAddress: string, gameMode: GameMode): boolean {
    // Only Aida and En-J1n have daily free games
    if (gameMode !== 'aida' && gameMode !== 'enj1n') return false
    
    return !this.hasUsedDailyFreeGame(walletAddress, gameMode)
  }
}
