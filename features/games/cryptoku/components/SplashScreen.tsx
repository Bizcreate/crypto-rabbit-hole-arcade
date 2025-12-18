"use client"

import { useState, useEffect, useRef } from "react"

interface SplashScreenProps {
  onEnter: () => void
}

const TOKENS = [
  {
    id: 1,
    name: "ApeCoin",
    color: "#2D6AFF",
    img: "/images/assets/cryptoku-tokens/ApeCoin.png",
  },
  {
    id: 2,
    name: "Nifty",
    color: "#20B2AA",
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nifty-DjEf0c7MQWc9AOsoD5nME54Gnkk5ij.png",
  },
  {
    id: 3,
    name: "Ethereum",
    color: "#8A92B2",
    img: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Ethereum-icon-purple.svg",
  },
  {
    id: 4,
    name: "CxRH",
    color: "#C0C0C0",
    img: "/images/assets/cryptoku-tokens/CxRH-Token.png",
  },
  {
    id: 5,
    name: "Bullish",
    color: "#35ff8a",
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bullish%20Token-TONuTJTOxJLYOy9xZmNInQ3bnBFj3E.png",
  },
  {
    id: 6,
    name: "Bearish",
    color: "#ff3b6a",
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bearish%20Token-W7qm9LCPPvMOHbaJGPueclHuGgS6Oj.png",
  },
  {
    id: 7,
    name: "Historacle",
    color: "#ffd35c",
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Historacle%20Token-YFWLKZaAkXXAl9IZBmEDgfhUcW0k4p.png",
  },
  {
    id: 8,
    name: "Bitcoin",
    color: "#FF9500",
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bitcoin-buEOkR9laapreTAisasidwsvH2xEEJ.png",
  },
  {
    id: 9,
    name: "Reaction",
    color: "#FF00FF",
    img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Reaction%20Token-vurHbES3b7BmXnMxBwn1ckgf4t12CD.png",
  },
] as const

interface TokenDrop {
  id: number
  token: (typeof TOKENS)[number]
  gridRow: number
  gridCol: number
  delay: number
  duration: number
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [showClickPrompt, setShowClickPrompt] = useState(false)
  const boardRef = useRef<HTMLDivElement | null>(null)
  const [tokenDrops, setTokenDrops] = useState<TokenDrop[]>([])

  // Generate token drops for the center square - one token per slot
  useEffect(() => {
    const generateTokenDrops = () => {
      const drops: TokenDrop[] = []

      // Create positions for all 9 slots in the center box (rows 3-5, cols 3-5, 0-indexed)
      const centerSlots: { gridRow: number; gridCol: number }[] = []
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          centerSlots.push({
            gridRow: row + 3, // 0-indexed rows 3-5
            gridCol: col + 3, // 0-indexed cols 3-5
          })
        }
      }

      // Shuffle the slots so tokens go to random positions
      const shuffledSlots = [...centerSlots].sort(() => Math.random() - 0.5)

      TOKENS.forEach((token, index) => {
        const slot = shuffledSlots[index]

        drops.push({
          id: index,
          token,
          gridRow: slot.gridRow,
          gridCol: slot.gridCol,
          delay: index * 300, // Stagger the drops
          duration: 2000, // Consistent duration
        })
      })

      setTokenDrops(drops)
    }

    generateTokenDrops()
  }, [])

  // Show click prompt after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowClickPrompt(true)
    }, 5000) // Show prompt after all tokens have dropped and settled

    return () => clearTimeout(timer)
  }, [])

  const handleEnter = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onEnter()
    }, 500) // Short delay for smooth transition
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 z-50 flex items-center justify-center overflow-hidden">
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes tokenDrop {
          0% {
            transform: translateY(-100px) scale(0.3) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(-50px) scale(0.5) rotate(90deg);
          }
          80% {
            transform: translateY(0) scale(1.1) rotate(360deg);
            opacity: 1;
          }
          90% {
            transform: translateY(0) scale(1.05) rotate(360deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(1) rotate(360deg);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out 0.5s both;
        }

        .animate-slide-in-up {
          animation: slideInUp 1s ease-out 1s both;
        }

        .animate-slide-in-up-delayed {
          animation: slideInUp 1s ease-out 2s both;
        }

        .token-drop-animation {
          animation-name: tokenDrop;
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-0.5 h-0.5 bg-yellow-400 rounded-full opacity-50 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/40 pointer-events-none" />

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Main Title */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-yellow-400 to-purple-400 bg-clip-text text-transparent animate-pulse drop-shadow-2xl">
            Cryptoku!
          </h1>
          <div className="relative">
            <p className="text-xl md:text-2xl text-slate-300 font-medium animate-fade-in">
              Can you solve the puzzle and top the leaderboard?
            </p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
          </div>
        </div>

        {/* Sudoku Board with Token Animation */}
        <div className="mb-8 flex justify-center animate-slide-in-up">
          <div
            ref={boardRef}
            className="relative w-80 h-80 md:w-96 md:h-96 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-2 shadow-2xl shadow-cyan-400/20 border border-slate-700/50 animate-pulse"
            style={{
              boxShadow: "0 0 30px rgba(6, 182, 212, 0.3), 0 0 60px rgba(6, 182, 212, 0.1)",
            }}
          >
            {/* Empty Sudoku Grid */}
            <div className="grid grid-cols-9 h-full w-full gap-0 aspect-square">
              {Array.from({ length: 81 }, (_, i) => {
                const row = Math.floor(i / 9)
                const col = i % 9
                const isCenterBox = row >= 3 && row <= 5 && col >= 3 && col <= 5

                // Check if this cell should have a token
                const tokenDrop = tokenDrops.find((drop) => drop.gridRow === row && drop.gridCol === col)

                return (
                  <div
                    key={i}
                    className={`border border-slate-600 flex items-center justify-center aspect-square ${
                      (col + 1) % 3 === 0 && col < 8 ? "border-r-2 border-r-cyan-300" : ""
                    } ${
                      (row + 1) % 3 === 0 && row < 8 ? "border-b-2 border-b-cyan-300" : ""
                    } ${isCenterBox ? "bg-slate-700/30" : ""}`}
                  >
                    {/* Token for center box cells */}
                    {tokenDrop && (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center border-2 token-drop-animation flex-shrink-0"
                        style={{
                          color: tokenDrop.token.color,
                          borderColor: tokenDrop.token.color,
                          background:
                            "radial-gradient(60% 60% at 50% 35%, rgba(255,255,255,0.12), transparent), #0c1122",
                          filter: "drop-shadow(0 0 8px rgba(32, 208, 255, 0.45))",
                          animationDelay: `${tokenDrop.delay}ms`,
                          animationDuration: `${tokenDrop.duration}ms`,
                        }}
                      >
                        <img
                          src={tokenDrop.token.img}
                          alt={tokenDrop.token.name}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="mb-8 animate-slide-in-up-delayed">
          <p className="text-lg md:text-xl text-slate-400 font-light italic">
            Sudoku with a crypto twist powered by The Crypto Rabbit Hole universe
          </p>
        </div>

        {/* Enter Button */}
        <div className="flex justify-center animate-slide-in-up-delayed">
          <button
            onClick={handleEnter}
            disabled={!showClickPrompt || isAnimating}
            className={`px-12 py-4 rounded-2xl border-2 font-bold text-xl transition-all duration-500 transform ${
              showClickPrompt && !isAnimating
                ? "border-cyan-400 bg-gradient-to-b from-cyan-900/50 to-cyan-800/50 text-cyan-400 hover:shadow-lg hover:shadow-cyan-400/50 hover:scale-105 cursor-pointer"
                : "border-slate-600 bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
            }`}
          >
            {showClickPrompt ? (
              <div className="flex items-center gap-3">
                <span>Enter Game</span>
                <span className="text-2xl animate-bounce">🎮</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span>Loading...</span>
                <div className="animate-spin w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full" />
              </div>
            )}
          </button>
        </div>

        {/* Click anywhere hint */}
        {showClickPrompt && !isAnimating && (
          <div className="mt-6 animate-pulse">
            <p className="text-sm text-slate-500">Click anywhere to continue</p>
          </div>
        )}
      </div>

      {/* Click anywhere overlay */}
      {showClickPrompt && !isAnimating && (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={handleEnter}
          title="Click anywhere to enter the game"
        />
      )}
    </div>
  )
}

export default SplashScreen


