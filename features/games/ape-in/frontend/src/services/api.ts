import axios from 'axios'
import { Card, GameState, LeaderboardEntry, GameMode } from '../types/game'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ape-in-game-backend.onrender.com'

// Debug environment variables
console.log('🔧 Environment Variables:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE,
  API_BASE_URL: API_BASE_URL
})

// Cache bust timestamp
const CACHE_BUST_TIMESTAMP = '2025-10-21-13-25-00'
console.log('🔄 Cache bust timestamp:', CACHE_BUST_TIMESTAMP)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Cache-Bust': CACHE_BUST_TIMESTAMP,
  },
  timeout: 10000, // 10 second timeout
})

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🌐 API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    })
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    })
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config
    })
    return Promise.reject(error)
  }
)

// Test API health
export const testAPI = {
  healthCheck: async () => {
    try {
      const response = await api.get('/health')
      console.log('🏥 Health check response:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Health check failed:', error)
      throw error
    }
  }
}

// Game API
export const gameAPI = {
  // Create a new game
  createGame: async (mode: GameMode, playerName: string, walletAddress?: string, isDailyFree?: boolean) => {
    console.log('🚀 API: Creating game with data:', { mode, playerName, walletAddress, isDailyFree })
    console.log('🌐 API: Using base URL:', API_BASE_URL)
    
    try {
      const requestData = {
        mode,
        playerName,
        ...(walletAddress && { walletAddress }),
        isDailyFree: isDailyFree || false,
      }
      console.log('📤 API: Sending request data:', requestData)
      
      const response = await api.post<GameState>('/api/game/create', requestData)
      console.log('✅ API: Game created successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ API: Game creation failed:', error)
      console.error('❌ API: Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      })
      throw error
    }
  },

  // Join an existing game (for PvP/multiplayer)
  joinGame: async (gameId: string, playerName: string, walletAddress?: string) => {
    const response = await api.post(`/api/game/${gameId}/join`, {
      playerName,
      walletAddress,
    })
    return response.data
  },

  // Draw a card
  drawCard: async (gameId: string) => {
    const response = await api.post<Card>(`/api/game/${gameId}/draw`)
    return response.data
  },

  // Roll dice
  rollDice: async (gameId: string) => {
    const response = await api.post<{ value: number; success: boolean; message?: string }>(
      `/api/game/${gameId}/roll`
    )
    return response.data
  },

  // Stack sats (end turn)
  stackSats: async (gameId: string) => {
    const response = await api.post(`/api/game/${gameId}/stack`)
    return response.data
  },

  // Forfeit game
  forfeitGame: async (gameId: string) => {
    const response = await api.post(`/api/game/${gameId}/forfeit`)
    return response.data
  },

  // Get game state
  getGameState: async (gameId: string) => {
    const response = await api.get<GameState>(`/api/game/${gameId}`)
    return response.data
  },
}

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: async (limit: number = 20) => {
    const response = await api.get<LeaderboardEntry[]>(`/api/leaderboard?limit=${limit}`)
    return response.data
  },

  getPlayerStats: async (walletAddress: string) => {
    const response = await api.get(`/api/leaderboard/player/${walletAddress}`)
    return response.data
  },
}

export default api


