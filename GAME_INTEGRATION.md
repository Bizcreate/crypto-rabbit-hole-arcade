# Cross-Game Integration Guide

This document explains how to integrate external games (Ape In!, Cryptoku!, etc.) with The Crypto Rabbit Hole Arcade hub for unified authentication and point synchronization.

## Overview

The arcade hub provides a centralized authentication and point tracking system that external games can integrate with. This allows:

- **Single Sign-On**: Users log in once at the hub and are automatically authenticated in all games
- **Point Synchronization**: Points and tickets earned in games sync back to the user's profile
- **Unified Profile**: All game stats and achievements appear in one central profile
- **Shared Resources**: Thirdweb Client ID is shared across all games

## Integration Steps

### 1. Session Management

The hub creates a game session when users connect their wallet or start playing. This session is stored in `localStorage` and `sessionStorage` for cross-origin access.

**Session Structure:**
\`\`\`typescript
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
\`\`\`

### 2. Reading Session in External Games

In your external game (Ape In!, Cryptoku!, etc.), add this code to read the session:

\`\`\`typescript
// lib/arcade-session.ts in your game
export function getArcadeSession() {
  if (typeof window === 'undefined') return null
  
  const stored = localStorage.getItem('crypto_rabbit_session') || 
                 sessionStorage.getItem('crypto_rabbit_session')
  
  if (!stored) return null
  
  try {
    const session = JSON.parse(stored)
    // Check if session is still valid (24 hours)
    if (Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
      return null
    }
    return session
  } catch {
    return null
  }
}
\`\`\`

### 3. Auto-Login with Session

Use the session to automatically authenticate users:

\`\`\`typescript
// In your game's main component or provider
useEffect(() => {
  const session = getArcadeSession()
  
  if (session) {
    // Auto-login the user
    setUsername(session.username)
    setUserId(session.userId)
    
    // Use shared Thirdweb credentials
    const thirdwebClient = createThirdwebClient({
      clientId: session.thirdwebClientId
    })
    
    // If they have a wallet address, connect it
    if (session.address) {
      connectWallet(session.address)
    }
  }
}, [])
\`\`\`

### 4. Syncing Points Back to Hub

When users earn points or tickets in your game, sync them back:

\`\`\`typescript
// lib/arcade-session.ts in your game
export function syncPointsToHub(update: {
  gameId: 'ape-in' | 'cryptoku' | 'card-battle'
  points: number
  tickets: number
  achievements?: string[]
}) {
  if (typeof window === 'undefined') return
  
  // Store the update for the hub to pick up
  const updates = JSON.parse(
    localStorage.getItem('crypto_rabbit_point_updates') || '[]'
  )
  
  updates.push({
    ...update,
    timestamp: Date.now()
  })
  
  localStorage.setItem('crypto_rabbit_point_updates', JSON.stringify(updates))
  
  // Dispatch event for real-time sync if hub is open in another tab
  window.dispatchEvent(new CustomEvent('gamePointsUpdated', {
    detail: update
  }))
}
\`\`\`

**Example Usage:**
\`\`\`typescript
// When player wins a game
function handleGameWin() {
  const pointsEarned = 250
  const ticketsEarned = 5
  
  syncPointsToHub({
    gameId: 'ape-in',
    points: pointsEarned,
    tickets: ticketsEarned,
    achievements: ['First Win']
  })
}
\`\`\`

### 5. Remove Duplicate Auth Systems

In your external games, remove or disable:

- Separate login forms
- Account creation flows
- Wallet connection UI (use the hub's connection)
- Thirdweb provider setup (use shared credentials from session)
- Local point/ticket storage (sync to hub instead)

### 6. Redirect to Hub for Login

If no session is found, redirect users to the hub:

\`\`\`typescript
useEffect(() => {
  const session = getArcadeSession()
  
  if (!session) {
    // Redirect to hub with return URL
    const returnUrl = encodeURIComponent(window.location.href)
    window.location.href = `https://cryptorabbitholearcade.vercel.app?return=${returnUrl}`
  }
}, [])
\`\`\`

## Environment Variables

### Shared via Session (Client-Side)
- `thirdwebClientId`: Shared through the session object for client-side Thirdweb integration

### Server-Side Only (Not in Session)
- `NEXT_PUBLIC_ZKVERIFY_API_KEY`: Should only be used in server actions or API routes, never exposed to client

**Important Security Note:** The zkVerify API key should NEVER be included in the session or used in client-side code. If your game needs zkVerify verification, create a server action or API route in your game that uses the key server-side only.

Example server-side zkVerify usage:
\`\`\`typescript
// app/api/verify/route.ts in your game
export async function POST(request: Request) {
  const zkVerifyKey = process.env.NEXT_PUBLIC_ZKVERIFY_API_KEY
  
  // Use zkVerifyKey for server-side verification
  // Never send the key to the client
}
\`\`\`

## Testing Integration

1. Open the hub at `https://cryptorabbitholearcade.vercel.app`
2. Connect wallet or start playing
3. Open your game in a new tab
4. Verify auto-login works
5. Earn points in your game
6. Return to hub and verify points synced

## Example: Ape In! Integration

\`\`\`typescript
// app/page.tsx in Ape In! game
'use client'

import { useEffect, useState } from 'react'
import { getArcadeSession, syncPointsToHub } from '@/lib/arcade-session'

export default function ApeInGame() {
  const [session, setSession] = useState(null)
  const [gameState, setGameState] = useState('loading')
  
  useEffect(() => {
    const arcadeSession = getArcadeSession()
    
    if (!arcadeSession) {
      // Redirect to hub for login
      window.location.href = 'https://cryptorabbitholearcade.vercel.app'
      return
    }
    
    setSession(arcadeSession)
    setGameState('ready')
  }, [])
  
  const handleWin = () => {
    syncPointsToHub({
      gameId: 'ape-in',
      points: 250,
      tickets: 5
    })
  }
  
  if (gameState === 'loading') {
    return <div>Connecting to arcade...</div>
  }
  
  return (
    <div>
      <h1>Welcome {session.username}!</h1>
      {/* Your game UI */}
    </div>
  )
}
\`\`\`

## Support

For integration help or questions, refer to the hub's codebase at `/lib/game-session.ts` for the complete implementation.
