# 🎮 Cryptoku Arcade Hub Integration Instructions

## Overview

This guide provides exact instructions for integrating Cryptoku with The Crypto Rabbit Hole Arcade Hub, matching the integration pattern used in Ape In!

---

## 📋 Integration Checklist

- [ ] Create `lib/arcade-session.ts` utility
- [ ] Update Thirdweb client to use session Client ID
- [ ] Add session guard in main entry point
- [ ] Update header/auth components to use session username
- [ ] Add point syncing on game completion
- [ ] Test integration

---

## Step 1: Create Arcade Session Utility

**File**: `src/lib/arcade-session.ts` (create new file)

```typescript
/**
 * Arcade Hub Session Management
 * 
 * This module handles integration with The Crypto Rabbit Hole Arcade Hub.
 * It manages session reading, validation, and point synchronization.
 */

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

/**
 * Get the arcade session from localStorage or sessionStorage
 * Sessions are stored by the arcade hub and shared across games
 */
export function getArcadeSession(): ArcadeSession | null {
  if (typeof window === 'undefined') return null

  // Try localStorage first, then sessionStorage (for cross-tab compatibility)
  const stored = localStorage.getItem('crypto_rabbit_session') ||
                 sessionStorage.getItem('crypto_rabbit_session')

  if (!stored) {
    console.log('🔍 No arcade session found')
    return null
  }

  try {
    const session = JSON.parse(stored) as ArcadeSession

    // Validate required fields
    if (!session.sessionId || !session.userId || !session.username || !session.thirdwebClientId) {
      console.warn('⚠️ Invalid arcade session: missing required fields')
      return null
    }

    // Check if session is still valid (24 hours)
    const SESSION_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    const sessionAge = Date.now() - session.timestamp

    if (sessionAge > SESSION_EXPIRY) {
      console.log('⏰ Arcade session expired')
      // Clean up expired session
      localStorage.removeItem('crypto_rabbit_session')
      sessionStorage.removeItem('crypto_rabbit_session')
      return null
    }

    console.log('✅ Arcade session found:', {
      userId: session.userId,
      username: session.username,
      sessionAge: Math.floor(sessionAge / 1000 / 60) + ' minutes old'
    })

    return session
  } catch (error) {
    console.error('❌ Failed to parse arcade session:', error)
    return null
  }
}

/**
 * Sync points and tickets earned in the game back to the arcade hub
 */
export function syncPointsToHub(update: PointUpdate): void {
  if (typeof window === 'undefined') return

  // Get existing updates
  const existingUpdates = JSON.parse(
    localStorage.getItem('crypto_rabbit_point_updates') || '[]'
  )

  // Add timestamp to update
  const updateWithTimestamp = {
    ...update,
    timestamp: Date.now()
  }

  // Append new update
  existingUpdates.push(updateWithTimestamp)

  // Store back to localStorage
  localStorage.setItem('crypto_rabbit_point_updates', JSON.stringify(existingUpdates))

  console.log('💰 Synced points to hub:', update)

  // Dispatch event for real-time sync if hub is open in another tab
  window.dispatchEvent(new CustomEvent('gamePointsUpdated', {
    detail: updateWithTimestamp
  }))
}

/**
 * Check if user is authenticated via arcade hub
 */
export function isArcadeAuthenticated(): boolean {
  return getArcadeSession() !== null
}

/**
 * Calculate points earned based on game result
 * Adjust these values based on your Cryptoku game mechanics
 */
export function calculateGamePoints(
  difficulty: string,
  completed: boolean,
  score?: number,
  perfectScore?: boolean
): number {
  if (!completed) return 0

  // Base points by difficulty (adjust based on your game)
  const basePoints: Record<string, number> = {
    easy: 50,
    medium: 100,
    hard: 150,
    expert: 250,
    extreme: 500,
  }

  let points = basePoints[difficulty.toLowerCase()] || 100

  // Perfect score bonus
  if (perfectScore) {
    points += 50
    console.log('🎯 Perfect score bonus: +50 points')
  }

  // High score bonus (if score-based)
  if (score && score > 1000) {
    points += 25
    console.log('🌟 High score bonus: +25 points')
  }

  return points
}

/**
 * Get achievements based on game result
 * Customize based on your Cryptoku game mechanics
 */
export function getGameAchievements(
  difficulty: string,
  completed: boolean,
  isFirstWin: boolean = false,
  perfectScore: boolean = false,
  streak?: number
): string[] {
  if (!completed) return []

  const achievements: string[] = []

  if (isFirstWin) {
    achievements.push('First Win')
  }

  if (perfectScore) {
    achievements.push('Perfect Score')
  }

  // Difficulty-specific achievements
  const difficultyAchievements: Record<string, string> = {
    easy: 'Easy Master',
    medium: 'Medium Champion',
    hard: 'Hard Expert',
    expert: 'Expert Slayer',
    extreme: 'Extreme Legend',
  }

  if (difficultyAchievements[difficulty.toLowerCase()]) {
    achievements.push(difficultyAchievements[difficulty.toLowerCase()])
  }

  // Streak achievement
  if (streak && streak >= 5) {
    achievements.push(`${streak} Game Streak`)
  }

  return achievements
}

/**
 * Redirect to arcade hub for authentication
 */
export function redirectToArcadeHub(returnUrl?: string): void {
  const hubUrl = 'https://arcade.thecryptorabbithole.io'
  const encodedReturnUrl = encodeURIComponent(returnUrl || window.location.href)
  const redirectUrl = `${hubUrl}?return=${encodedReturnUrl}`
  
  console.log('🔀 Redirecting to arcade hub:', redirectUrl)
  window.location.href = redirectUrl
}
```

---

## Step 2: Update Thirdweb Client Configuration

**File**: `src/lib/thirdweb.ts` (or wherever your Thirdweb client is configured)

**Find this:**
```typescript
export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "placeholder-client-id-replace-me",
});
```

**Replace with:**
```typescript
import { getArcadeSession } from "./arcade-session";

/**
 * Get Thirdweb Client ID from arcade session or environment variable
 * Priority: Arcade Session > Environment Variable > Placeholder
 */
function getThirdwebClientId(): string {
  const session = getArcadeSession()
  
  if (session?.thirdwebClientId) {
    console.log('✅ Using Thirdweb Client ID from arcade session')
    return session.thirdwebClientId
  }
  
  const envClientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID
  if (envClientId) {
    console.log('✅ Using Thirdweb Client ID from environment variable')
    return envClientId
  }
  
  console.warn('⚠️ No Thirdweb Client ID found, using placeholder')
  return "placeholder-client-id-replace-me"
}

// Create the ThirdWeb client
// Client ID comes from arcade session (if available) or environment variable
const clientId = getThirdwebClientId()
console.log('🔧 Thirdweb Client ID source:', clientId ? 'Found' : 'Missing')

export const client = createThirdwebClient({
  clientId,
});
```

---

## Step 3: Add Session Guard to App Entry Point

**File**: `src/main.tsx` or `src/App.tsx` (depending on your structure)

**Find your app render code** (usually looks like):
```typescript
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThirdwebProvider>
  </React.StrictMode>,
)
```

**Replace with:**
```typescript
import { getArcadeSession, redirectToArcadeHub } from './lib/arcade-session'

/**
 * Arcade Session Checker Component
 * Checks for arcade session and redirects to hub if not authenticated
 */
function ArcadeSessionGuard({ children }: { children: React.ReactNode }) {
  const [checkingSession, setCheckingSession] = useState(true)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    // Check for arcade session
    const session = getArcadeSession()
    
    if (session) {
      console.log('✅ Arcade session found, proceeding with app')
      setHasSession(true)
      setCheckingSession(false)
    } else {
      // Allow standalone mode if env var is set (for development/testing)
      const allowStandalone = import.meta.env.VITE_ALLOW_STANDALONE === 'true'
      
      if (allowStandalone) {
        console.log('⚠️ No arcade session, but standalone mode enabled')
        setHasSession(true)
        setCheckingSession(false)
      } else {
        // No session and standalone not allowed - redirect to hub
        console.log('🔀 No arcade session found, redirecting to hub...')
        redirectToArcadeHub()
        // Don't set checkingSession to false - keep showing loading
      }
    }
  }, [])

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Connecting to arcade...</p>
        </div>
      </div>
    )
  }

  if (!hasSession) {
    return null // Will redirect, so don't render anything
  }

  return <>{children}</>
}

// Then wrap your app:
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <BrowserRouter>
        <ArcadeSessionGuard>
          <App />
        </ArcadeSessionGuard>
      </BrowserRouter>
    </ThirdwebProvider>
  </React.StrictMode>,
)
```

**Don't forget to add imports at the top:**
```typescript
import { useEffect, useState } from 'react'
```

---

## Step 4: Update Authentication/Header Component

**File**: Wherever you handle user authentication/display (header, auth component, etc.)

**Find your user profile/username loading code** (usually in a `useEffect`):

```typescript
// BEFORE: Loading from localStorage or state
useEffect(() => {
  const savedProfile = localStorage.getItem(`profile_${address}`)
  // ... set username from local profile
}, [address])
```

**Replace with:**
```typescript
import { getArcadeSession } from '../lib/arcade-session' // Adjust path as needed

useEffect(() => {
  // Check for arcade session first
  const arcadeSession = getArcadeSession()
  
  if (arcadeSession) {
    // Use arcade session data
    setUsername(arcadeSession.username)
    setUserId(arcadeSession.userId)
    // Don't show local auth UI for arcade users
    return
  }
  
  // Fall back to local profile for standalone mode
  if (address) {
    const savedProfile = localStorage.getItem(`profile_${address}`)
    if (savedProfile) {
      // ... set from local profile
    } else {
      // Only show auth UI in standalone mode
      const allowStandalone = import.meta.env.VITE_ALLOW_STANDALONE === 'true'
      if (allowStandalone) {
        // Show login/auth UI
      }
    }
  }
}, [address])
```

**To display arcade stats** (points/tickets) in your header/user menu:
```typescript
import { getArcadeSession } from '../lib/arcade-session'

// In your component:
const arcadeSession = getArcadeSession()

// Then in your JSX where you show user info:
{arcadeSession && (
  <div className="arcade-stats">
    <div>⭐ Points: {arcadeSession.points.toLocaleString()}</div>
    <div>🎫 Tickets: {arcadeSession.tickets}</div>
  </div>
)}
```

---

## Step 5: Add Point Syncing on Game Completion

**File**: Wherever you handle game completion/winning (game component, result screen, etc.)

**Find where game completes/wins** (look for completion handlers, win conditions, etc.):

```typescript
// Example: When game completes
const handleGameComplete = () => {
  // ... your existing completion logic
}
```

**Add point syncing:**
```typescript
import { syncPointsToHub, calculateGamePoints, getGameAchievements } from '../lib/arcade-session'

// In your game completion handler:
const handleGameComplete = (result: {
  won: boolean
  difficulty: string
  score?: number
  perfectScore?: boolean
}) => {
  // ... your existing completion logic
  
  // Sync points if won
  if (result.won) {
    const points = calculateGamePoints(
      result.difficulty,
      true,
      result.score,
      result.perfectScore
    )
    const tickets = 1 // Always 1 ticket per win
    const achievements = getGameAchievements(
      result.difficulty,
      true,
      isFirstWin, // Track first win in localStorage if needed
      result.perfectScore || false,
      currentStreak // If tracking streaks
    )
    
    // Sync to hub
    syncPointsToHub({
      gameId: 'cryptoku',
      points,
      tickets,
      achievements
    })
    
    console.log('💰 Synced points to arcade hub:', { points, tickets, achievements })
  }
}
```

**Example: If you have a game state management:**
```typescript
// In a useEffect that watches for game completion:
useEffect(() => {
  if (gameState.status === 'completed' && gameState.won && !pointsSynced) {
    const points = calculateGamePoints(
      gameState.difficulty,
      true,
      gameState.finalScore,
      gameState.isPerfectScore
    )
    const tickets = 1
    const achievements = getGameAchievements(
      gameState.difficulty,
      true,
      !localStorage.getItem(`hasWon_${account?.address || 'guest'}`),
      gameState.isPerfectScore
    )
    
    syncPointsToHub({
      gameId: 'cryptoku',
      points,
      tickets,
      achievements
    })
    
    setPointsSynced(true)
    
    // Track first win
    if (account?.address) {
      localStorage.setItem(`hasWon_${account.address}`, 'true')
    }
  }
}, [gameState, pointsSynced, account])
```

**Add state variable:**
```typescript
const [pointsSynced, setPointsSynced] = useState(false)
```

---

## Step 6: Adjust Point Calculation for Cryptoku

**In `src/lib/arcade-session.ts`**, customize the `calculateGamePoints` function based on your Cryptoku game mechanics:

```typescript
export function calculateGamePoints(
  difficulty: string,
  completed: boolean,
  score?: number,
  perfectScore?: boolean,
  timeBonus?: boolean,
  movesUsed?: number
): number {
  if (!completed) return 0

  // Base points by difficulty - ADJUST THESE VALUES
  const basePoints: Record<string, number> = {
    easy: 50,      // Easy puzzles
    medium: 100,    // Medium puzzles
    hard: 150,      // Hard puzzles
    expert: 250,    // Expert puzzles
    extreme: 500,   // Extreme/legendary puzzles
  }

  let points = basePoints[difficulty.toLowerCase()] || 100

  // Perfect score bonus
  if (perfectScore) {
    points += 50
  }

  // Speed bonus (if completed quickly)
  if (timeBonus) {
    points += 25
  }

  // Efficiency bonus (if used minimal moves)
  if (movesUsed && movesUsed <= 20) {
    points += 25
  }

  // Score-based bonus (if you have score system)
  if (score && score > 1000) {
    points += Math.floor(score / 1000) * 10 // Bonus per 1000 points
  }

  return points
}
```

**Also customize achievements:**
```typescript
export function getGameAchievements(
  difficulty: string,
  completed: boolean,
  isFirstWin: boolean = false,
  perfectScore: boolean = false,
  streak?: number,
  speedRun?: boolean
): string[] {
  if (!completed) return []

  const achievements: string[] = []

  if (isFirstWin) {
    achievements.push('First Win')
  }

  if (perfectScore) {
    achievements.push('Perfect Solve')
  }

  if (speedRun) {
    achievements.push('Speed Runner')
  }

  // Difficulty-specific achievements
  const difficultyAchievements: Record<string, string> = {
    easy: 'Cryptoku Novice',
    medium: 'Cryptoku Solver',
    hard: 'Cryptoku Master',
    expert: 'Cryptoku Expert',
    extreme: 'Cryptoku Legend',
  }

  if (difficultyAchievements[difficulty.toLowerCase()]) {
    achievements.push(difficultyAchievements[difficulty.toLowerCase()])
  }

  // Streak achievement
  if (streak && streak >= 5) {
    achievements.push(`${streak} Puzzle Streak`)
  }

  if (streak && streak >= 10) {
    achievements.push('On Fire! 🔥')
  }

  return achievements
}
```

---

## Step 7: Testing

After implementing all changes:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Test locally with standalone mode:**
   - Set `VITE_ALLOW_STANDALONE=true` in `.env`
   - Run `npm run dev`
   - Game should work normally

3. **Test with arcade hub:**
   - Remove `VITE_ALLOW_STANDALONE` or set to `false`
   - Open arcade hub, connect wallet
   - Navigate to Cryptoku
   - Should auto-login with hub username
   - Play and win → Check points sync

---

## 📋 Quick Reference: What to Change

1. **Create**: `src/lib/arcade-session.ts` (copy entire file from Step 1)

2. **Update**: Thirdweb client file
   - Import `getArcadeSession`
   - Use session Client ID with fallback

3. **Update**: Main app entry (`main.tsx` or `App.tsx`)
   - Add `ArcadeSessionGuard` component
   - Wrap app with guard

4. **Update**: Auth/Header component
   - Use arcade username from session
   - Display arcade stats (points/tickets)

5. **Update**: Game completion handler
   - Add point syncing on win
   - Calculate points based on difficulty
   - Include achievements

---

## ⚙️ Configuration

### Environment Variables

**Production (Arcade Hub):**
```env
# No env vars needed! Everything comes from session.
```

**Development/Standalone:**
```env
VITE_ALLOW_STANDALONE=true
VITE_THIRDWEB_CLIENT_ID=your_client_id_here
```

---

## 🎯 Point System Customization

Adjust these values in `arcade-session.ts` based on your Cryptoku game:

| Difficulty | Base Points | Suggested Values |
|-----------|-------------|------------------|
| Easy | 50 | Beginner puzzles |
| Medium | 100 | Standard puzzles |
| Hard | 150 | Challenging puzzles |
| Expert | 250 | Very difficult |
| Extreme | 500 | Legendary puzzles |

**Bonuses:**
- Perfect Score: +50 points
- Speed Run: +25 points
- Minimal Moves: +25 points
- High Score: +10 per 1000 points

---

## ✅ Integration Complete Checklist

- [ ] `arcade-session.ts` created
- [ ] Thirdweb client uses session Client ID
- [ ] Session guard added to app entry
- [ ] Username from session displays
- [ ] Points sync on game completion
- [ ] Achievements tracked and sent
- [ ] Points calculation customized for Cryptoku
- [ ] Build passes (`npm run build`)
- [ ] Tested with arcade hub
- [ ] Tested in standalone mode

---

## 🐛 Common Issues

**Session not found:**
- Verify localStorage is accessible
- Check browser console for session structure
- Ensure hub is creating sessions correctly

**Points not syncing:**
- Check console for "💰 Synced points to hub" message
- Verify `localStorage.crypto_rabbit_point_updates` exists
- Ensure game completion handler is called

**Redirect loop:**
- Don't set `VITE_ALLOW_STANDALONE=true` in production
- Verify redirect URL is correct

---

**Ready to integrate! Follow these steps and Cryptoku will be seamlessly connected to the arcade hub!** 🚀

