import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useActiveAccount } from 'thirdweb/react'
import { motion } from 'framer-motion'
import { gameAPI, testAPI } from '../services/api'
import { wsService } from '../services/websocket'
import { useGameStore } from '../store/gameStore'
import GameBoard from '../components/GameBoard'
import SmartBotIntro from '../components/SmartBotIntro'
import { useIntroTracking } from '../hooks/useIntroTracking'
import { GameMode } from '../types/game'
import { BOT_CONFIGS } from '../config/botConfig'
import { DailyFreeGameService } from '../services/dailyFreeGames'

const gameNames: Record<GameMode, string> = {
  sandy: 'Sandy',
  aida: 'Aida',
  lana: 'Lana',
  enj1n: 'En-J1n',
  nifty: 'Nifty',
  pvp: 'PvP',
  multiplayer: 'Multiplayer',
  tournament: 'Tournament',
}

export default function GamePage() {
  const { mode } = useParams<{ mode: GameMode }>()
  const navigate = useNavigate()
  const account = useActiveAccount()
  const address = account?.address
  const [isLoading, setIsLoading] = useState(true)
  const [playerName, setPlayerName] = useState('')
  const [gameId, setGameId] = useState('')
  const [showIntro, setShowIntro] = useState(true)
  const [showManualIntro, setShowManualIntro] = useState(false)
  const { setGameState, gameStatus } = useGameStore()
  const { hasCompletedIntro, markIntroCompleted } = useIntroTracking()

  useEffect(() => {
    if (!mode) {
      navigate('/')
      return
    }

    // Prevent multiple initializations
    if (isLoading === false) {
      return
    }

    const initGame = async () => {
              try {
                console.log('🎮 Initializing game for mode:', mode)
                console.log('👤 Address:', address)
                
                // Skip health check - game creation will test backend connectivity
                console.log('🚀 Proceeding directly to game creation...')
        
        // Get player name from stored profile or create default
        let name = 'Player'
        if (address) {
          const savedProfile = localStorage.getItem(`profile_${address}`)
          if (savedProfile) {
            const profile = JSON.parse(savedProfile)
            name = profile.name || `Player ${address.slice(0, 6)}`
          } else {
            name = `Player ${address.slice(0, 6)}`
          }
        } else {
          name = prompt('Enter your name:') || 'Player'
        }
        console.log('📝 Player name:', name)
        setPlayerName(name)

        // Check if this is a daily free game
        const isDailyFree = address && DailyFreeGameService.isEligibleForDailyFree(address, mode)
        console.log('💰 Is daily free:', isDailyFree)
        
        // Create game
        console.log('🚀 Creating game...')
        const game = await gameAPI.createGame(mode, name, address, isDailyFree)
        console.log('✅ Game created:', game.gameId)
        setGameId(game.gameId)
        setGameState(game)

        // Connect WebSocket for real-time updates
        if (mode === 'pvp' || mode === 'multiplayer') {
          console.log('🔌 Connecting WebSocket...')
          wsService.connect(game.gameId)
          wsService.on('game_update', (data) => {
            setGameState(data)
          })
        }

        // Initialize intro state based on completion tracking
        const shouldShowIntro = !hasCompletedIntro(mode)
        console.log('🎬 Should show intro:', shouldShowIntro)
        console.log('📊 Has completed intro:', hasCompletedIntro(mode))
        console.log('🎮 Game creation successful, setting showIntro to:', shouldShowIntro)
        setShowIntro(shouldShowIntro)

        console.log('✅ Game initialization complete')
        setIsLoading(false)
      } catch (error) {
        console.error('❌ Failed to initialize game:', error)
        alert('Failed to start game. Please try again.')
        navigate('/')
      }
    }

    initGame()

    return () => {
      wsService.disconnect()
    }
  }, [mode, address, navigate, setGameState, hasCompletedIntro])

  const handleIntroComplete = (skip: boolean) => {
    if (!skip) {
      markIntroCompleted(mode)
    }
    setShowIntro(false)
  }

  const handleManualIntro = () => {
    setShowManualIntro(true)
  }

  const handleManualIntroComplete = (skip: boolean) => {
    setShowManualIntro(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  const opponentName = mode ? gameNames[mode] : 'Opponent'

  return (
    <div className="container mx-auto px-4 py-2 md:py-4">
      {/* Bot Introduction */}
      {showIntro && mode && (
        <SmartBotIntro gameMode={mode} onComplete={handleIntroComplete} autoPlay={true} />
      )}

      {/* Manual Bot Introduction */}
      {showManualIntro && mode && (
        <SmartBotIntro gameMode={mode} onComplete={handleManualIntroComplete} autoPlay={false} />
      )}

      {/* Game Content */}
      {!showIntro && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-3"
          >
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">
              {playerName} vs {mode && gameNames[mode]}
            </h1>
            <p className="text-xs text-slate-400">
              First to {mode ? BOT_CONFIGS[mode].winningScore : 150} sats wins!
            </p>
          </motion.div>

          <GameBoard gameId={gameId} playerName={playerName} opponentName={opponentName} gameMode={mode} onPlayIntro={handleManualIntro} />
        </>
      )}
    </div>
  )
}

