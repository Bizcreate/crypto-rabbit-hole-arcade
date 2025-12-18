# 🎮 Arcade Hub Integration Plan for Ape In!

## Overview

This document outlines the integration plan for connecting Ape In! (`ape-in-game.vercel.app`) with The Crypto Rabbit Hole Arcade Hub (`arcade.thecryptorabbithole.io` or `cryptorabbitholearcade.vercel.app`).

The integration will enable:
- ✅ Single Sign-On (SSO) from the arcade hub
- ✅ Unified authentication using hub's session
- ✅ Points and tickets synchronization
- ✅ Shared Thirdweb Client ID from hub
- ✅ Automatic redirect to hub if not authenticated

---

## 📋 Integration Checklist

### Phase 1: Arcade Session Management
- [ ] Create `frontend/src/lib/arcade-session.ts` utility
- [ ] Implement `getArcadeSession()` function
- [ ] Implement `syncPointsToHub()` function
- [ ] Add session validation (24-hour expiry)

### Phase 2: Authentication Integration
- [ ] Modify `frontend/src/lib/thirdweb.ts` to use session Client ID
- [ ] Update `frontend/src/main.tsx` to check arcade session
- [ ] Modify `frontend/src/components/NewHeader.tsx` to use session data
- [ ] Add redirect logic when no session found
- [ ] Remove standalone login UI (keep wallet connect for arcade users)

### Phase 3: Points Synchronization
- [ ] Add point syncing on game wins in `GameBoard.tsx`
- [ ] Calculate points based on game mode difficulty
- [ ] Calculate tickets (1 ticket per win)
- [ ] Sync after each game completion
- [ ] Handle achievements (first win, streak, etc.)

### Phase 4: Environment & Deployment
- [ ] Update Vercel project configuration
- [ ] Ensure cross-origin localStorage access
- [ ] Test integration flow
- [ ] Update deployment documentation

---

## 🗂️ File Structure Changes

### New Files
```
frontend/src/lib/arcade-session.ts       # Session management utilities
```

### Modified Files
```
frontend/src/lib/thirdweb.ts            # Use session Client ID instead of env var
frontend/src/main.tsx                   # Check arcade session on mount
frontend/src/components/NewHeader.tsx    # Use session username, remove standalone auth
frontend/src/pages/GamePage.tsx         # Optional: Add session check
frontend/src/components/GameBoard.tsx   # Add point syncing on win
frontend/src/App.tsx                    # Optional: Add session check wrapper
```

---

## 📝 Detailed Implementation Plan

### 1. Arcade Session Utility (`lib/arcade-session.ts`)

**Purpose**: Handle reading and writing to arcade hub session storage.

**Functions to implement:**

```typescript
// Get arcade session from localStorage/sessionStorage
export function getArcadeSession(): ArcadeSession | null

// Sync points/tickets back to hub
export function syncPointsToHub(update: PointUpdate): void

// Types
interface ArcadeSession {
  sessionId: string
  userId: string
  username: string
  address: string | null
  thirdwebClientId: string
  tickets: number
  points: number
  timestamp: number
}

interface PointUpdate {
  gameId: 'ape-in'
  points: number
  tickets: number
  achievements?: string[]
}
```

**Key considerations:**
- Check both `localStorage` and `sessionStorage` (cross-tab compatibility)
- Validate session expiry (24 hours)
- Handle cases where session doesn't exist gracefully
- Dispatch `gamePointsUpdated` event for real-time sync

---

### 2. Thirdweb Client Configuration (`lib/thirdweb.ts`)

**Current behavior:**
- Uses `VITE_THIRDWEB_CLIENT_ID` from environment variables
- Hardcoded client creation

**New behavior:**
- Check arcade session first
- Use `session.thirdwebClientId` if available
- Fall back to `VITE_THIRDWEB_CLIENT_ID` for standalone mode (backward compatibility)
- Create client dynamically based on session

**Implementation approach:**
```typescript
// Get Client ID from session or env
function getThirdwebClientId(): string {
  const session = getArcadeSession()
  return session?.thirdwebClientId || import.meta.env.VITE_THIRDWEB_CLIENT_ID || "placeholder-client-id-replace-me"
}

// Create client with dynamic Client ID
export const client = createThirdwebClient({
  clientId: getThirdwebClientId(),
})
```

**Note**: Since `client` is exported at module level, we may need to make it dynamic or use a factory function.

---

### 3. Application Entry Point (`main.tsx`)

**Current behavior:**
- Wraps app in `ThirdwebProvider` and `BrowserRouter`
- No session checking

**New behavior:**
- Check for arcade session on mount
- If no session found, redirect to hub with return URL
- If session found, proceed normally
- Optionally show loading state during check

**Implementation:**
```typescript
// Check session before rendering
useEffect(() => {
  const session = getArcadeSession()
  
  if (!session) {
    // Redirect to hub with return URL
    const returnUrl = encodeURIComponent(window.location.href)
    window.location.href = `https://arcade.thecryptorabbithole.io?return=${returnUrl}`
    return
  }
  
  // Session found, continue rendering
}, [])
```

**Alternative approach**: Create a session-aware wrapper component that handles redirect logic before rendering the main app.

---

### 4. Header Component (`components/NewHeader.tsx`)

**Current behavior:**
- Manages its own user profile in localStorage (`profile_${address}`)
- Shows wallet connection UI
- Has name modal for new users

**New behavior:**
- Use `session.username` instead of local profile name (if session exists)
- Use `session.userId` for user identification
- Keep wallet connection UI (users may want to connect additional wallets)
- Optionally hide/disable standalone login if session exists
- Show arcade user info (points, tickets) if available

**Modifications:**
1. Import `getArcadeSession` at top
2. In `useEffect` for profile loading, check session first:
   ```typescript
   const session = getArcadeSession()
   if (session) {
     setPlayerName(session.username)
     // Optionally set user profile from session
   } else {
     // Fall back to local profile logic
   }
   ```
3. Display arcade stats if session exists
4. Remove/disable name modal if session exists (name comes from hub)

---

### 5. Game Board - Points Syncing (`components/GameBoard.tsx`)

**Current behavior:**
- Tracks game state via WebSocket
- Handles game completion
- Shows winner when `gameStatus === 'finished'`

**New behavior:**
- On game win, calculate points and tickets
- Call `syncPointsToHub()` with game results
- Include achievements (first win, difficulty bonuses, etc.)

**Point calculation logic:**
```typescript
// Calculate points based on game mode
function calculatePoints(gameMode: GameMode, playerWon: boolean): number {
  if (!playerWon) return 0
  
  const basePoints: Record<GameMode, number> = {
    sandy: 50,    // Tutorial - lower points
    aida: 100,    // Easy
    lana: 150,    // Medium
    enj1n: 250,   // Hard - higher reward
    nifty: 150,   // Medium
    pvp: 200,     // PvP bonus
    multiplayer: 300, // Multiplayer bonus
    tournament: 500,  // Tournament bonus
  }
  
  return basePoints[gameMode] || 100
}

// Calculate tickets (always 1 per win)
function calculateTickets(playerWon: boolean): number {
  return playerWon ? 1 : 0
}
```

**Integration point:**
```typescript
// In GameBoard.tsx, when gameStatus === 'finished'
useEffect(() => {
  if (gameStatus === 'finished' && winner === playerName) {
    const points = calculatePoints(mode, true)
    const tickets = calculateTickets(true)
    
    syncPointsToHub({
      gameId: 'ape-in',
      points,
      tickets,
      achievements: getAchievements(gameState)
    })
  }
}, [gameStatus, winner, playerName, mode])
```

**Achievements to track:**
- First Win
- Sandy Master (5 wins vs Sandy)
- Aida Victory (win vs Aida)
- Lana Champion (win vs Lana)
- EnJ1n Slayer (win vs EnJ1n)
- Perfect Score (win with exact target score)
- High Roller (win with dice roll streak)

---

### 6. App Wrapper (`App.tsx`)

**Optional enhancement:**
- Add session check at app level
- Show loading screen if checking session
- Redirect to hub if no session

**Current behavior:**
- Routes to HomePage, GamePage, LeaderboardPage
- Shows splash screen on first visit

**New behavior:**
- Keep splash screen logic
- Add session check after splash or before routes
- Optionally pass session data via React Context

---

## 🔧 Technical Considerations

### Cross-Origin Session Sharing

**Challenge**: localStorage/sessionStorage is origin-specific. Games on different domains can't directly access the hub's storage.

**Solutions:**
1. **Same domain**: Deploy games as subpaths (`arcade.thecryptorabbithole.io/ape-in`)
2. **PostMessage API**: Hub sends session via `postMessage` to embedded iframes
3. **URL Parameters**: Hub redirects with session token in URL (not recommended for security)
4. **Cookies with Shared Domain**: Use cookies if both apps share parent domain (`.thecryptorabbithole.io`)

**Recommended approach**: Check if games will be embedded as iframes or accessed as separate domains. Based on the guide mentioning `localStorage`, it seems games may be on the same domain or using postMessage.

### Session Expiry Handling

- Validate session timestamp on every read
- Clear invalid sessions automatically
- Redirect to hub if session expired
- Show user-friendly message: "Session expired. Please log in again."

### Backward Compatibility

- Keep environment variable fallback for standalone mode
- Allow games to work without arcade hub (for development/testing)
- Add feature flag to enable/disable arcade integration

---

## 📊 Point Calculation Reference

### Base Points per Game Mode
| Mode | Difficulty | Base Points (Win) | Tickets |
|------|-----------|-------------------|---------|
| Sandy | Tutorial | 50 | 1 |
| Aida | Easy | 100 | 1 |
| Lana | Medium | 150 | 1 |
| EnJ1n | Hard | 250 | 1 |
| Nifty | Medium | 150 | 1 |
| PvP | Varies | 200 | 1 |
| Multiplayer | Varies | 300 | 1 |
| Tournament | Varies | 500 | 1 |

### Bonus Points
- **Perfect Score Bonus**: +50 points (win with exact target score)
- **High Score Bonus**: +25 points (final score > target score by 20+)
- **First Win Bonus**: +100 points (first win ever)
- **Streak Bonus**: +10 points per win in streak (max +50)

### Loss Points
- Loss: 0 points, 0 tickets
- Draw: 0 points, 0 tickets

---

## 🧪 Testing Plan

### Unit Tests
- [ ] Test `getArcadeSession()` with valid/invalid sessions
- [ ] Test `syncPointsToHub()` with various point values
- [ ] Test session expiry validation
- [ ] Test point calculation logic

### Integration Tests
- [ ] Test full flow: Hub login → Game access → Win game → Points sync
- [ ] Test redirect when no session
- [ ] Test Thirdweb client uses session Client ID
- [ ] Test wallet connection with session address

### Manual Testing Checklist
1. **Hub Integration**
   - [ ] Open hub, connect wallet
   - [ ] Navigate to Ape In! game
   - [ ] Verify auto-login works
   - [ ] Verify username from hub displays

2. **Points Syncing**
   - [ ] Win a game vs Sandy (50 points, 1 ticket)
   - [ ] Win a game vs EnJ1n (250 points, 1 ticket)
   - [ ] Check hub shows updated points/tickets
   - [ ] Verify achievements appear

3. **Session Management**
   - [ ] Test session expiry (wait 24+ hours or modify timestamp)
   - [ ] Verify redirect to hub on expired session
   - [ ] Test cross-tab sync (open hub and game in separate tabs)

4. **Edge Cases**
   - [ ] Test with no session (should redirect)
   - [ ] Test with invalid session format
   - [ ] Test with missing required session fields
   - [ ] Test game without arcade hub (standalone mode)

---

## 🚀 Deployment Steps

### 1. Update Vercel Configuration
- Ensure project is deployed to `crypto-rabbit-hole-arcade` on Vercel
- Verify domain setup (`ape-in-game.vercel.app` → arcade subpath or separate deployment)

### 2. Environment Variables
- Keep `VITE_THIRDWEB_CLIENT_ID` for fallback
- No new env vars needed (Client ID comes from session)

### 3. Build & Deploy
```bash
cd frontend
npm run build
vercel deploy --prod
```

### 4. Post-Deployment Verification
- Test arcade hub → game navigation
- Test point syncing
- Test session persistence
- Monitor for errors in console/logs

---

## 📚 Documentation Updates Needed

### Files to Update
- [ ] `README.md` - Add arcade integration section
- [ ] `THIRDWEB_SETUP.md` - Update to mention session-based Client ID
- [ ] Create `ARCADE_INTEGRATION.md` - Complete integration guide

### Content to Add
- How arcade hub integration works
- Point calculation reference
- Troubleshooting guide
- Session management details

---

## ⚠️ Important Notes

### Security Considerations
1. **Never expose zkVerify API key in session** - Keep it server-side only
2. **Validate session structure** - Don't trust arbitrary localStorage data
3. **HTTPS only** - Session data must be encrypted in transit
4. **Session expiry** - Always validate timestamp

### Breaking Changes
- If standalone mode is removed, games won't work without hub
- Consider keeping standalone mode as fallback
- Document migration path for existing users

### Performance
- Session check adds minimal overhead (localStorage read)
- Point syncing is async and non-blocking
- Consider debouncing point updates if multiple games finish quickly

---

## 🎯 Success Criteria

Integration is successful when:
1. ✅ Users can access Ape In! from arcade hub without re-authentication
2. ✅ Points earned in games sync back to hub profile
3. ✅ Tickets are awarded correctly (1 per win)
4. ✅ Achievements are tracked and displayed
5. ✅ Session expiry is handled gracefully
6. ✅ Games work in standalone mode (with env var fallback)
7. ✅ No breaking changes to existing game functionality

---

## 📞 Support & Questions

If you encounter issues during integration:
1. Check browser console for errors
2. Verify session structure in localStorage: `crypto_rabbit_session`
3. Check point updates in localStorage: `crypto_rabbit_point_updates`
4. Test session validity manually
5. Verify arcade hub is creating sessions correctly

---

**Next Steps**: Once you approve this plan, I'll begin implementing the changes in phases.

