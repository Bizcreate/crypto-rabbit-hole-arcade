# 🚀 Cryptoku Arcade Integration - Quick Start

## Copy & Paste Instructions for Cursor

---

## Step 1: Create `src/lib/arcade-session.ts`

**Full file content** - Copy entire file:

```typescript
export interface ArcadeSession {
  sessionId: string
  userId: string
  username: string
  address: string | null
  thirdwebClientId: string
  tickets: number
  points: number
  timestamp: number
}

export interface PointUpdate {
  gameId: 'cryptoku'
  points: number
  tickets: number
  achievements?: string[]
}

export function getArcadeSession(): ArcadeSession | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('crypto_rabbit_session') || sessionStorage.getItem('crypto_rabbit_session')
  if (!stored) return null
  try {
    const session = JSON.parse(stored) as ArcadeSession
    if (!session.sessionId || !session.userId || !session.username || !session.thirdwebClientId) return null
    const SESSION_EXPIRY = 24 * 60 * 60 * 1000
    if (Date.now() - session.timestamp > SESSION_EXPIRY) {
      localStorage.removeItem('crypto_rabbit_session')
      sessionStorage.removeItem('crypto_rabbit_session')
      return null
    }
    return session
  } catch { return null }
}

export function syncPointsToHub(update: PointUpdate): void {
  if (typeof window === 'undefined') return
  const existingUpdates = JSON.parse(localStorage.getItem('crypto_rabbit_point_updates') || '[]')
  existingUpdates.push({ ...update, timestamp: Date.now() })
  localStorage.setItem('crypto_rabbit_point_updates', JSON.stringify(existingUpdates))
  window.dispatchEvent(new CustomEvent('gamePointsUpdated', { detail: update }))
}

export function calculateGamePoints(difficulty: string, completed: boolean, score?: number, perfectScore?: boolean): number {
  if (!completed) return 0
  const basePoints: Record<string, number> = { easy: 50, medium: 100, hard: 150, expert: 250, extreme: 500 }
  let points = basePoints[difficulty.toLowerCase()] || 100
  if (perfectScore) points += 50
  if (score && score > 1000) points += 25
  return points
}

export function getGameAchievements(difficulty: string, completed: boolean, isFirstWin = false, perfectScore = false, streak?: number): string[] {
  if (!completed) return []
  const achievements: string[] = []
  if (isFirstWin) achievements.push('First Win')
  if (perfectScore) achievements.push('Perfect Solve')
  const difficultyAchievements: Record<string, string> = {
    easy: 'Cryptoku Novice', medium: 'Cryptoku Solver', hard: 'Cryptoku Master',
    expert: 'Cryptoku Expert', extreme: 'Cryptoku Legend'
  }
  if (difficultyAchievements[difficulty.toLowerCase()]) achievements.push(difficultyAchievements[difficulty.toLowerCase()])
  if (streak && streak >= 5) achievements.push(`${streak} Puzzle Streak`)
  return achievements
}

export function redirectToArcadeHub(returnUrl?: string): void {
  window.location.href = `https://arcade.thecryptorabbithole.io?return=${encodeURIComponent(returnUrl || window.location.href)}`
}
```

---

## Step 2: Update Thirdweb Client

**In your Thirdweb config file**, add at top:
```typescript
import { getArcadeSession } from "./arcade-session"
```

**Replace Client ID line:**
```typescript
// BEFORE:
export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "placeholder"
})

// AFTER:
function getThirdwebClientId(): string {
  const session = getArcadeSession()
  return session?.thirdwebClientId || import.meta.env.VITE_THIRDWEB_CLIENT_ID || "placeholder"
}
export const client = createThirdwebClient({ clientId: getThirdwebClientId() })
```

---

## Step 3: Add Session Guard

**In `main.tsx` or `App.tsx`**, add imports:
```typescript
import { useEffect, useState } from 'react'
import { getArcadeSession, redirectToArcadeHub } from './lib/arcade-session'
```

**Before app render, add this component:**
```typescript
function ArcadeSessionGuard({ children }: { children: React.ReactNode }) {
  const [checkingSession, setCheckingSession] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  useEffect(() => {
    const session = getArcadeSession()
    if (session) {
      setHasSession(true)
      setCheckingSession(false)
    } else {
      const allowStandalone = import.meta.env.VITE_ALLOW_STANDALONE === 'true'
      if (allowStandalone) {
        setHasSession(true)
        setCheckingSession(false)
      } else {
        redirectToArcadeHub()
      }
    }
  }, [])
  if (checkingSession) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin">Loading...</div></div>
  if (!hasSession) return null
  return <>{children}</>
}
```

**Wrap your app:**
```typescript
<ArcadeSessionGuard><App /></ArcadeSessionGuard>
```

---

## Step 4: Use Session Username

**In your auth/header component**, add:
```typescript
import { getArcadeSession } from '../lib/arcade-session'

// In component:
const arcadeSession = getArcadeSession()
const username = arcadeSession?.username || localUsername
```

---

## Step 5: Sync Points on Game Win

**In your game completion handler**, add:
```typescript
import { syncPointsToHub, calculateGamePoints, getGameAchievements } from '../lib/arcade-session'

// When game completes/wins:
if (gameWon) {
  const points = calculateGamePoints(difficulty, true, score, perfectScore)
  const tickets = 1
  const achievements = getGameAchievements(difficulty, true, isFirstWin, perfectScore)
  syncPointsToHub({ gameId: 'cryptoku', points, tickets, achievements })
}
```

---

## Done! ✅

Build and test:
```bash
npm run build
```

**For standalone mode testing**, add to `.env`:
```
VITE_ALLOW_STANDALONE=true
```

