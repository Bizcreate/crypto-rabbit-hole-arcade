# Thirdweb Wallet Integration Guide

This document explains how the Thirdweb wallet connection is integrated with Supabase profiles and the arcade system.

## Overview

The arcade uses Thirdweb Connect SDK for wallet authentication, which automatically syncs with Supabase to create and manage user profiles. When a user connects their wallet, the system:

1. Authenticates via Thirdweb
2. Creates or retrieves their Supabase profile
3. Syncs balances (APE points and tickets)
4. Creates a game session for cross-game access
5. Enables PvP features in games

## Architecture

### Components

**WalletConnect** (`components/wallet-connect.tsx`)
- Renders the Thirdweb ConnectButton
- Handles wallet connection UI
- Supports multiple wallet providers (MetaMask, WalletConnect, Coinbase, etc.)

**ProfileSyncWrapper** (`components/profile-sync-wrapper.tsx`)
- Wraps the entire app in layout.tsx
- Listens for wallet connection changes
- Triggers profile sync when wallet connects/disconnects

**Providers** (`components/providers.tsx`)
- Central state management for arcade
- Manages tickets, points, profile data
- Provides `syncProfileWithWallet()` function
- Stores game session for cross-game access

### Data Flow

\`\`\`
User Connects Wallet
    ↓
Thirdweb Authentication
    ↓
ProfileSyncWrapper detects connection
    ↓
Calls syncProfileWithWallet(address)
    ↓
Checks Supabase for existing profile
    ↓
Creates new profile OR loads existing
    ↓
Updates local state (tickets, points, username)
    ↓
Creates game session in localStorage
    ↓
User can play games with wallet-linked profile
\`\`\`

## Supabase Profile Schema

\`\`\`sql
profiles (
  id: uuid (primary key)
  wallet_address: text (unique, indexed)
  username: text
  avatar_url: text
  ape_balance: integer (APE points)
  tickets: integer
  referral_code: text (unique)
  referral_count: integer
  referral_earnings: integer
  games_played: integer
  total_score: integer
  achievements: text[]
  created_at: timestamp
  updated_at: timestamp
)
\`\`\`

## Usage in Games

### Card Battle PvP

When a user enters Card Battle, their wallet address is used to:
- Match with other players
- Track game results in `pvp_matches` table
- Update win/loss records
- Award points and tickets

Example:
\`\`\`typescript
// In card-battle.tsx
const account = useActiveAccount()

async function startPvPMatch() {
  if (!account?.address) {
    toast.error("Connect wallet to play PvP")
    return
  }
  
  // Find opponent and create match
  const match = await PvPService.findMatch(account.address)
  // ... game logic
}
\`\`\`

### Cross-Game Sessions

The game session stored in localStorage allows external games (Ape In, Cryptoku) to:
- Auto-login users
- Access their wallet address
- Sync points back to the hub
- Use shared Thirdweb credentials

See `GAME_INTEGRATION.md` for details on integrating external games.

## Environment Variables

Required environment variables:

\`\`\`env
# Thirdweb (already configured)
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id

# Supabase (add these)
NEXT_PUBLIC_SUPABASE_URL=https://wsqaapqabtwczmvxtgxp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
\`\`\`

## Testing Wallet Integration

1. **Connect Wallet**
   - Click "Connect Wallet" in topbar
   - Select wallet provider
   - Approve connection

2. **Verify Profile Creation**
   - Check browser console for "[v0] Wallet connected: 0x..."
   - Go to Profile page
   - Verify username and balances loaded

3. **Test Game Session**
   - Open browser DevTools → Application → Local Storage
   - Look for `crypto_rabbit_session` key
   - Verify it contains wallet address and balances

4. **Test PvP**
   - Go to Card Battle
   - Start a match
   - Verify AI opponent appears (or real player if available)
   - Complete match and verify points awarded

## Security Notes

- Wallet addresses are public and safe to store
- Private keys never leave the user's wallet
- Thirdweb handles all signing securely
- Supabase RLS policies protect user data
- Only wallet owner can modify their profile

## Troubleshooting

**Wallet won't connect**
- Check Thirdweb client ID is set
- Verify wallet extension is installed
- Try different wallet provider

**Profile not syncing**
- Check Supabase environment variables
- Verify database tables exist (run SQL scripts)
- Check browser console for errors

**Points not updating**
- Verify game session is being created
- Check localStorage for `crypto_rabbit_session`
- Ensure `syncProfileWithWallet()` is called after connection

## Future Enhancements

- Social login (email, Google) via Thirdweb
- Multi-chain support (Ethereum, Polygon, etc.)
- NFT-gated features
- Token-gated tournaments
- On-chain achievements
