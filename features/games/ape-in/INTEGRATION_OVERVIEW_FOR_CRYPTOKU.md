# 🎮 Arcade Hub Integration Overview

## Context: What Was Requested

We were asked to integrate Ape In! (and subsequently Cryptoku) with The Crypto Rabbit Hole Arcade Hub (`arcade.thecryptorabbithole.io` or `cryptorabbitholearcade.vercel.app`). The goal was to create a unified gaming platform where:

- Users log in once at the hub and are automatically authenticated in all games
- Points and tickets earned in games sync back to the user's hub profile
- All game stats and achievements appear in one central profile
- Thirdweb Client ID is shared across all games from the hub session

---

## Integration Guide Provided

The following integration guide was provided (this is what you'll implement in Cryptoku):

### Key Concepts:

1. **Session Management**
   - Hub creates a game session when users connect wallet
   - Session stored in `localStorage` and `sessionStorage` as `crypto_rabbit_session`
   - Session structure:
     ```typescript
     {
       sessionId: string
       userId: string
       username: string
       address: string | null
       thirdwebClientId: string
       tickets: number
       points: number
       timestamp: number
     }
     ```
   - Sessions expire after 24 hours

2. **Reading Session in External Games**
   - Check `localStorage.getItem('crypto_rabbit_session')` or `sessionStorage.getItem('crypto_rabbit_session')`
   - Validate session structure and expiry
   - Use session data for authentication

3. **Auto-Login with Session**
   - Use `session.username` for display name
   - Use `session.thirdwebClientId` for Thirdweb client
   - Connect wallet if `session.address` exists

4. **Syncing Points Back to Hub**
   - Store updates in `localStorage.crypto_rabbit_point_updates` (array)
   - Each update structure:
     ```typescript
     {
       gameId: 'ape-in' | 'cryptoku' | 'card-battle'
       points: number
       tickets: number
       achievements?: string[]
       timestamp: number
     }
     ```
   - Dispatch `gamePointsUpdated` event for real-time sync

5. **Remove Duplicate Auth Systems**
   - Remove/disable separate login forms
   - Remove account creation flows
   - Use hub's wallet connection
   - Use shared Thirdweb credentials from session

6. **Redirect to Hub for Login**
   - If no session found, redirect to: `https://arcade.thecryptorabbithole.io?return={currentUrl}`
   - Hub handles authentication and redirects back

---

## What Was Implemented for Ape In!

### Files Created:

1. **`frontend/src/lib/arcade-session.ts`** (NEW - 250 lines)
   - `getArcadeSession()` - Reads and validates session from localStorage/sessionStorage
   - `syncPointsToHub()` - Stores point updates for hub to pick up
   - `calculateGamePoints()` - Calculates points based on game mode difficulty
   - `getGameAchievements()` - Generates achievement list (First Win, Perfect Score, mode-specific)
   - `redirectToArcadeHub()` - Redirects to hub with return URL
   - Session validation with 24-hour expiry check
   - Cross-tab compatibility support

### Files Modified:

2. **`frontend/src/lib/thirdweb.ts`**
   - **Before**: Used `VITE_THIRDWEB_CLIENT_ID` from environment variables only
   - **After**: 
     - Imports `getArcadeSession`
     - Creates function `getThirdwebClientId()` that checks session first, then env var
     - Priority: Arcade Session > Environment Variable > Placeholder
     - Maintains backward compatibility for standalone mode

3. **`frontend/src/main.tsx`**
   - **Before**: Directly rendered app with providers
   - **After**:
     - Added `ArcadeSessionGuard` component that:
       - Checks for arcade session on mount
       - Shows loading screen during check
       - Redirects to hub if no session (unless `VITE_ALLOW_STANDALONE=true`)
       - Allows app to proceed if session exists
     - Wraps app with guard: `<ArcadeSessionGuard><App /></ArcadeSessionGuard>`

4. **`frontend/src/components/NewHeader.tsx`**
   - **Before**: Loaded user profile from localStorage only, showed name modal for new users
   - **After**:
     - Imports `getArcadeSession`
     - Checks arcade session first in profile loading `useEffect`
     - Uses `arcadeSession.username` instead of local profile (if session exists)
     - Hides name modal for arcade users (name comes from hub)
     - Displays arcade stats (points and tickets) in account dropdown menu
     - Falls back to local profile only in standalone mode

5. **`frontend/src/components/GameBoard.tsx`**
   - **Before**: Game completion tracked internally only
   - **After**:
     - Imports `syncPointsToHub`, `calculateGamePoints`, `getGameAchievements`
     - Added `pointsSynced` state to prevent double-syncing
     - Added `useEffect` that watches for game completion:
       - Triggers when `gameStatus === 'finished'` and `winner === playerName`
       - Calculates points based on game mode:
         - Sandy: 50 points
         - Aida: 100 points
         - Lana: 150 points
         - EnJ1n: 250 points
         - Nifty: 150 points
       - Awards 1 ticket per win
       - Calculates bonuses (Perfect Score: +50, High Score: +25)
       - Generates achievements
       - Calls `syncPointsToHub()` with game results
       - Tracks first win in localStorage for achievement

### Point System Implemented:

| Game Mode | Base Points | Tickets |
|-----------|-------------|---------|
| Sandy (Tutorial) | 50 | 1 |
| Aida (Easy) | 100 | 1 |
| Lana (Medium) | 150 | 1 |
| EnJ1n (Hard) | 250 | 1 |
| Nifty (Medium) | 150 | 1 |

**Bonuses:**
- Perfect Score (exact target): +50 points
- High Score (20+ over target): +25 points

**Achievements Tracked:**
- First Win
- Perfect Score
- Mode-specific (Sandy Master, Aida Victory, Lana Champion, EnJ1n Slayer, Nifty Navigator)

---

## Implementation Details

### Session Validation:
- Checks both `localStorage` and `sessionStorage` (cross-tab compatibility)
- Validates required fields: `sessionId`, `userId`, `username`, `thirdwebClientId`
- Validates timestamp (24-hour expiry)
- Cleans up expired sessions automatically

### Point Syncing Flow:
1. Game completes with player win
2. `GameBoard` component detects completion via `useEffect`
3. Calculates points based on difficulty/mode
4. Generates achievements based on game result
5. Calls `syncPointsToHub()` which:
   - Reads existing updates array from localStorage
   - Appends new update with timestamp
   - Stores back to localStorage as `crypto_rabbit_point_updates`
   - Dispatches `gamePointsUpdated` custom event
6. Hub reads from `crypto_rabbit_point_updates` and syncs to user profile

### Backward Compatibility:
- Standalone mode supported via `VITE_ALLOW_STANDALONE=true` env var
- Environment variable fallback for Thirdweb Client ID
- Local profile system still functions for standalone users
- No breaking changes to existing game functionality

### Security Considerations:
- Session validation prevents using invalid/expired sessions
- No sensitive data exposed (zkVerify API key remains server-side only)
- HTTPS only (localStorage is origin-specific)
- Session expiry enforced

---

## Code Patterns to Follow

### 1. Session Check Pattern:
```typescript
const arcadeSession = getArcadeSession()
if (arcadeSession) {
  // Use session data
  const username = arcadeSession.username
  const clientId = arcadeSession.thirdwebClientId
} else {
  // Fall back to local/default behavior
  // Or redirect to hub
}
```

### 2. Point Syncing Pattern:
```typescript
// In game completion handler
if (gameWon && !pointsSynced) {
  const points = calculateGamePoints(difficulty, true, score, perfectScore)
  const tickets = 1
  const achievements = getGameAchievements(difficulty, true, isFirstWin, perfectScore)
  
  syncPointsToHub({
    gameId: 'cryptoku', // or 'ape-in' for Ape In!
    points,
    tickets,
    achievements
  })
  
  setPointsSynced(true)
}
```

### 3. Session Guard Pattern:
```typescript
function ArcadeSessionGuard({ children }) {
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
  
  if (checkingSession) return <LoadingScreen />
  if (!hasSession) return null
  return <>{children}</>
}
```

---

## Testing Approach

### Integration Testing:
1. Open arcade hub → Connect wallet → Navigate to game
2. Verify auto-login works (username from hub displays)
3. Play and win game → Check points sync in hub
4. Verify achievements appear in hub

### Standalone Testing:
1. Set `VITE_ALLOW_STANDALONE=true` in `.env`
2. Game should work without arcade session
3. Local profile system should function normally

### Edge Cases Tested:
- Expired session → Redirects to hub
- Invalid session format → Redirects to hub
- Missing session → Redirects to hub (unless standalone mode)
- Multiple wins → Each syncs separately (no double-syncing)
- Points calculation → Correct based on difficulty

---

## Key Takeaways for Cryptoku Integration

1. **Create `arcade-session.ts` utility** - Copy the entire file pattern
2. **Update Thirdweb client** - Use session Client ID with fallback
3. **Add session guard** - Check session before rendering app
4. **Update auth/header** - Use session username, display stats
5. **Sync points on win** - Calculate based on your game's difficulty system
6. **Customize point values** - Adjust for Cryptoku's mechanics (puzzle difficulty, solve time, etc.)

---

## Files Reference

All integration code is in:
- `frontend/src/lib/arcade-session.ts` - Core session management
- `frontend/src/lib/thirdweb.ts` - Client ID from session
- `frontend/src/main.tsx` - Session guard wrapper
- `frontend/src/components/NewHeader.tsx` - Session username & stats
- `frontend/src/components/GameBoard.tsx` - Point syncing on win

The complete integration follows the exact pattern described in the guide, ensuring seamless compatibility with the arcade hub system.

---

## Deployment Notes

- No environment variables needed for production (everything comes from session)
- Standalone mode requires `VITE_ALLOW_STANDALONE=true` for development/testing
- Build completed successfully with no errors
- All changes committed and pushed to repository

---

**This is the complete overview of what was requested and what was implemented for Ape In!. Use this as reference to replicate the same integration pattern for Cryptoku.**

