# Profile Persistence Implementation

## Overview

Users can now maintain their profile data (username, avatar, stats) across sessions while still requiring fresh wallet authentication each time for security.

## Key Features

### ✅ Fresh Authentication Required
- Users must sign in with wallet each time they visit
- No auto-connect - prevents unauthorized access on shared computers
- Wallet connections are cleared on logout and page load

### ✅ Profile Data Persists
- Username, avatar, and stats are saved by wallet address
- When user reconnects with same wallet, their profile is restored
- Leaderboard stats, achievements, and game progress are preserved

## Implementation Details

### Profile Storage (`lib/profile-storage.ts`)

New utility functions to save/load profiles by wallet address:

- `saveProfileByAddress(address, profile)` - Saves profile data keyed by address
- `loadProfileByAddress(address)` - Loads saved profile for an address
- `clearProfileByAddress(address)` - Clears profile for specific address (optional)

**Storage Key Format**: `arcade_profile_{wallet_address}`

### Profile Data Structure

```typescript
interface StoredUserProfile {
  username: string
  avatar: string
  referralCode: string
  referralCount: number
  referralEarnings: number
  joinedAt: string // ISO date string
  stats: {
    gamesPlayed: number
    totalScore: number
    achievements: string[]
  }
}
```

### Changes Made

#### 1. `components/providers.tsx`

**handleAuthSuccess:**
- Loads saved profile when wallet connects
- Restores username, avatar, stats if profile exists
- Falls back to new user setup if no saved profile

**loadUserInfo:**
- Checks for saved profile before fetching from API
- Preserves existing profile data for returning users

**updateProfile:**
- Automatically saves profile to localStorage when updated
- Saves immediately when username/avatar changes

**Auto-save useEffect:**
- Watches profile changes (username, avatar, stats)
- Automatically saves profile data whenever it changes
- Ensures stats updates from games are persisted

**logout:**
- Saves current profile before clearing session
- Clears wallet connections but preserves profile data
- Only clears `thirdweb_*` and `wagmi_*` keys, not `arcade_profile_*`

#### 2. `components/auth-dialog.tsx`

**Connection Clearing:**
- Clears wallet connections on dialog open
- Preserves profile data (`arcade_profile_*` keys)
- Ensures fresh sign-in each time

#### 3. `components/profile-menu.tsx`

**Connect Handler:**
- Clears wallet connections before showing auth dialog
- Preserves profile data when clearing

## User Flow

### First Time User
1. User visits site → Auth dialog shows
2. User signs in with wallet
3. Profile created with default values
4. Profile saved to `arcade_profile_{address}`
5. User can update username/avatar

### Returning User
1. User visits site → Auth dialog shows
2. User signs in with same wallet address
3. System loads saved profile from `arcade_profile_{address}`
4. Username, avatar, stats are restored
5. Leaderboard stats and achievements are preserved
6. User continues where they left off

### User Logout
1. Current profile is saved before logout
2. Wallet connections are cleared
3. Profile data remains in localStorage
4. Next sign-in will restore the profile

## Security Considerations

✅ **Fresh Authentication**: Each session requires wallet signature
✅ **Profile Isolation**: Profiles are keyed by wallet address
✅ **No Auto-Connect**: Prevents unauthorized access
✅ **Data Persistence**: Only clears wallet connections, not user data

## Data Persistence

### What's Saved
- ✅ Username
- ✅ Avatar/Profile Picture
- ✅ Referral Code
- ✅ Referral Count & Earnings
- ✅ Game Stats (gamesPlayed, totalScore, achievements)
- ✅ Join Date

### What's Cleared on Logout
- ❌ Auth tokens
- ❌ Wallet connections (thirdweb, wagmi keys)
- ❌ Arcade session

### What's Preserved
- ✅ Profile data (arcade_profile_* keys)
- ✅ User stats and achievements
- ✅ Leaderboard data

## Testing Checklist

- [ ] First-time user can create profile and it saves
- [ ] Returning user's profile is restored on reconnect
- [ ] Username changes persist across sessions
- [ ] Avatar changes persist across sessions
- [ ] Stats updates (from games) persist
- [ ] Logout clears connections but preserves profile
- [ ] Fresh sign-in required each time
- [ ] Profile data is keyed correctly by wallet address

## Files Modified

1. `lib/profile-storage.ts` - NEW: Profile storage utilities
2. `components/providers.tsx` - Profile loading/saving logic
3. `components/auth-dialog.tsx` - Updated connection clearing
4. `components/profile-menu.tsx` - Updated connection clearing


