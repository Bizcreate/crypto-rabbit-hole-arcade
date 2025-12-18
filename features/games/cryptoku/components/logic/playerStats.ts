// Local player statistics and game session tracking for Cryptoku

export type Difficulty = "noob" | "degen" | "ape"

export interface GameSession {
  id: string
  difficulty: Difficulty
  startTime: Date
  endTime?: Date
  status: "in-progress" | "completed" | "forfeited"
  errors: number
  hintsUsed: number
  timeInSeconds?: number
  score?: number
  verificationProofId?: string
}

export interface PlayerStats {
  totalGames: number
  completions: number
  forfeits: number
  averageTime: number
  bestTime: number
  totalErrors: number
  totalHintsUsed: number
  gamesPerDifficulty: {
    noob: { played: number; completed: number; forfeited: number }
    degen: { played: number; completed: number; forfeited: number }
    ape: { played: number; completed: number; forfeited: number }
  }
  currentStreak: number
  bestStreak: number
  lastPlayed?: Date
}

const STATS_STORAGE_KEY = "cryptoku-player-stats"
const SESSIONS_STORAGE_KEY = "cryptoku-game-sessions"

export function getPlayerStats(): PlayerStats {
  if (typeof window === "undefined") {
    return getDefaultStats()
  }

  try {
    const stored = window.localStorage.getItem(STATS_STORAGE_KEY)
    if (stored) {
      const stats = JSON.parse(stored) as PlayerStats
      if (stats.lastPlayed) {
        stats.lastPlayed = new Date(stats.lastPlayed)
      }
      return stats
    }
  } catch (error) {
    console.error("Error loading player stats:", error)
  }

  return getDefaultStats()
}

export function savePlayerStats(stats: PlayerStats): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats))
  } catch (error) {
    console.error("Error saving player stats:", error)
  }
}

export function getGameSessions(): GameSession[] {
  if (typeof window === "undefined") return []

  try {
    const stored = window.localStorage.getItem(SESSIONS_STORAGE_KEY)
    if (stored) {
      const sessions = JSON.parse(stored) as GameSession[]
      return sessions.map((session) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined,
      }))
    }
  } catch (error) {
    console.error("Error loading game sessions:", error)
  }

  return []
}

export function saveGameSessions(sessions: GameSession[]): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions))
  } catch (error) {
    console.error("Error saving game sessions:", error)
  }
}

export function startGameSession(difficulty: Difficulty): GameSession {
  const session: GameSession = {
    id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    difficulty,
    startTime: new Date(),
    status: "in-progress",
    errors: 0,
    hintsUsed: 0,
  }

  const sessions = getGameSessions()
  sessions.push(session)
  saveGameSessions(sessions)

  return session
}

export function completeGameSession(
  sessionId: string,
  timeInSeconds: number,
  errors: number,
  hintsUsed: number,
  score: number,
  verificationProofId?: string,
): void {
  const sessions = getGameSessions()
  const session = sessions.find((s) => s.id === sessionId)

  if (!session) return

  session.status = "completed"
  session.endTime = new Date()
  session.timeInSeconds = timeInSeconds
  session.errors = errors
  session.hintsUsed = hintsUsed
  session.score = score
  session.verificationProofId = verificationProofId

  saveGameSessions(sessions)
  updateStatsOnCompletion(session)
}

export function forfeitGameSession(sessionId: string, errors: number, hintsUsed: number): void {
  const sessions = getGameSessions()
  const session = sessions.find((s) => s.id === sessionId)

  if (!session) return

  session.status = "forfeited"
  session.endTime = new Date()
  session.errors = errors
  session.hintsUsed = hintsUsed

  saveGameSessions(sessions)
  updateStatsOnForfeit(session)
}

function updateStatsOnCompletion(session: GameSession): void {
  const stats = getPlayerStats()

  stats.totalGames++
  stats.completions++
  stats.totalErrors += session.errors
  stats.totalHintsUsed += session.hintsUsed
  stats.lastPlayed = session.endTime

  const diffStats = stats.gamesPerDifficulty[session.difficulty]
  diffStats.played++
  diffStats.completed++

  if (session.timeInSeconds != null) {
    const totalGames = stats.completions
    stats.averageTime = Math.floor(
      (stats.averageTime * (totalGames - 1) + session.timeInSeconds) / totalGames,
    )

    if (stats.bestTime === 0 || session.timeInSeconds < stats.bestTime) {
      stats.bestTime = session.timeInSeconds
    }
  }

  stats.currentStreak++
  if (stats.currentStreak > stats.bestStreak) {
    stats.bestStreak = stats.currentStreak
  }

  savePlayerStats(stats)
}

function updateStatsOnForfeit(session: GameSession): void {
  const stats = getPlayerStats()

  stats.totalGames++
  stats.forfeits++
  stats.totalErrors += session.errors
  stats.totalHintsUsed += session.hintsUsed
  stats.lastPlayed = session.endTime
  stats.currentStreak = 0

  const diffStats = stats.gamesPerDifficulty[session.difficulty]
  diffStats.played++
  diffStats.forfeited++

  savePlayerStats(stats)
}

export function getActiveSession(): GameSession | null {
  const sessions = getGameSessions()
  return sessions.find((s) => s.status === "in-progress") ?? null
}

function getDefaultStats(): PlayerStats {
  return {
    totalGames: 0,
    completions: 0,
    forfeits: 0,
    averageTime: 0,
    bestTime: 0,
    totalErrors: 0,
    totalHintsUsed: 0,
    gamesPerDifficulty: {
      noob: { played: 0, completed: 0, forfeited: 0 },
      degen: { played: 0, completed: 0, forfeited: 0 },
      ape: { played: 0, completed: 0, forfeited: 0 },
    },
    currentStreak: 0,
    bestStreak: 0,
  }
}

export function getCompletionRate(stats: PlayerStats): number {
  if (stats.totalGames === 0) return 0
  return Math.round((stats.completions / stats.totalGames) * 100)
}

export function getForfeitRate(stats: PlayerStats): number {
  if (stats.totalGames === 0) return 0
  return Math.round((stats.forfeits / stats.totalGames) * 100)
}

export function resetPlayerStats(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STATS_STORAGE_KEY)
  window.localStorage.removeItem(SESSIONS_STORAGE_KEY)
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}


