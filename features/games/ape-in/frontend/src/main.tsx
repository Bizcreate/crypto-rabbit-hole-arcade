import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { ThirdwebProvider } from 'thirdweb/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { getArcadeSession, redirectToArcadeHub } from './lib/arcade-session'

console.log('🚀 Starting React app...')

// Test import to see if all exports work
import('./types/game').then(({ GameMode, GameModeValues, LeaderboardEntry, Card, GameState }) => {
  console.log('✅ GameMode import successful:', GameMode)
  console.log('✅ GameModeValues import successful:', GameModeValues)
  console.log('✅ LeaderboardEntry import successful:', LeaderboardEntry)
  console.log('✅ Card import successful:', Card)
  console.log('✅ GameState import successful:', GameState)
}).catch((error) => {
  console.error('❌ Types import failed:', error)
})

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

try {
  const rootElement = document.getElementById('root')
  console.log('🎯 Root element found:', rootElement)
  
  if (!rootElement) {
    throw new Error('Root element not found!')
  }

  ReactDOM.createRoot(rootElement).render(
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
  
  console.log('✅ React app rendered successfully')
} catch (error) {
  console.error('❌ Failed to render React app:', error)
}
