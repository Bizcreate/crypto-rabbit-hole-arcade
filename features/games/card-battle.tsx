"use client"

import { useState, useEffect } from "react"
import { useArcade } from "@/components/providers"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Heart, Shield, Swords } from "@/components/icons"

type BattleCard = {
  id: string
  name: string
  image: string
  attack: number
  defense: number
  health: number
  rarity: "common" | "rare" | "epic" | "legendary"
}

type DamageNumber = {
  id: string
  damage: number
  x: number
  y: number
  isPlayer: boolean
}

export default function CardBattle() {
  const { cards, addPoints, addTickets } = useArcade()
  const [playerCard, setPlayerCard] = useState<BattleCard | null>(null)
  const [opponentCard, setOpponentCard] = useState<BattleCard | null>(null)
  const [playerHealth, setPlayerHealth] = useState(100)
  const [opponentHealth, setOpponentHealth] = useState(100)
  const [battleLog, setBattleLog] = useState<string[]>([])
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<"player" | "opponent" | null>(null)
  const [playerAttacking, setPlayerAttacking] = useState(false)
  const [opponentAttacking, setOpponentAttacking] = useState(false)
  const [playerHit, setPlayerHit] = useState(false)
  const [opponentHit, setOpponentHit] = useState(false)
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([])
  const [showVictory, setShowVictory] = useState(false)

  // Generate random battle cards from available card images
  useEffect(() => {
    const cardNumbers = Array.from({ length: 64 }, (_, i) => i + 1)
    const randomPlayerCard = cardNumbers[Math.floor(Math.random() * cardNumbers.length)]
    const randomOpponentCard = cardNumbers[Math.floor(Math.random() * cardNumbers.length)]

    setPlayerCard(generateBattleCard(randomPlayerCard))
    setOpponentCard(generateBattleCard(randomOpponentCard))
  }, [])

  const generateBattleCard = (cardNumber: number): BattleCard => {
    const rarities: BattleCard["rarity"][] = ["common", "rare", "epic", "legendary"]
    const rarity = rarities[Math.floor(Math.random() * rarities.length)]

    return {
      id: `card-${cardNumber}`,
      name: `Card #${cardNumber}`,
      image: `/cards/${String(cardNumber).padStart(2, "0")}.png`,
      attack: Math.floor(Math.random() * 50) + 20,
      defense: Math.floor(Math.random() * 30) + 10,
      health: 100,
      rarity,
    }
  }

  const showDamage = (damage: number, isPlayer: boolean) => {
    const id = `damage-${Date.now()}-${Math.random()}`
    const newDamage: DamageNumber = {
      id,
      damage,
      x: Math.random() * 100 - 50,
      y: 0,
      isPlayer,
    }
    setDamageNumbers((prev) => [...prev, newDamage])

    setTimeout(() => {
      setDamageNumbers((prev) => prev.filter((d) => d.id !== id))
    }, 1500)
  }

  const attack = () => {
    if (!playerCard || !opponentCard || gameOver) return

    setPlayerAttacking(true)
    setTimeout(() => setPlayerAttacking(false), 600)

    setTimeout(() => {
      const damage = Math.max(playerCard.attack - opponentCard.defense, 5)
      const newOpponentHealth = Math.max(opponentHealth - damage, 0)

      setOpponentHit(true)
      showDamage(damage, false)
      setTimeout(() => setOpponentHit(false), 500)

      setOpponentHealth(newOpponentHealth)
      setBattleLog((prev) => [...prev, `You dealt ${damage} damage!`])

      if (newOpponentHealth <= 0) {
        setTimeout(() => endGame("player"), 800)
        return
      }

      setIsPlayerTurn(false)
      const aiDelay = Math.random() * 1000 + 1500
      setTimeout(opponentAttack, aiDelay)
    }, 400)
  }

  const opponentAttack = () => {
    if (!playerCard || !opponentCard || gameOver) return

    setOpponentAttacking(true)
    setTimeout(() => setOpponentAttacking(false), 600)

    setTimeout(() => {
      const damage = Math.max(opponentCard.attack - playerCard.defense, 5)
      const newPlayerHealth = Math.max(playerHealth - damage, 0)

      setPlayerHit(true)
      showDamage(damage, true)
      setTimeout(() => setPlayerHit(false), 500)

      setPlayerHealth(newPlayerHealth)
      setBattleLog((prev) => [...prev, `Opponent dealt ${damage} damage!`])

      if (newPlayerHealth <= 0) {
        setTimeout(() => endGame("opponent"), 800)
        return
      }

      setIsPlayerTurn(true)
    }, 400)
  }

  const endGame = (gameWinner: "player" | "opponent") => {
    setGameOver(true)
    setWinner(gameWinner)
    setShowVictory(true)

    if (gameWinner === "player") {
      const pointsEarned = 100
      const ticketsEarned = 2
      addPoints(pointsEarned)
      addTickets(ticketsEarned)
      setBattleLog((prev) => [...prev, `Victory! Earned ${pointsEarned} points and ${ticketsEarned} tickets!`])
    } else {
      setBattleLog((prev) => [...prev, "Defeat! Better luck next time."])
    }
  }

  const resetGame = () => {
    const cardNumbers = Array.from({ length: 64 }, (_, i) => i + 1)
    const randomPlayerCard = cardNumbers[Math.floor(Math.random() * cardNumbers.length)]
    const randomOpponentCard = cardNumbers[Math.floor(Math.random() * cardNumbers.length)]

    setPlayerCard(generateBattleCard(randomPlayerCard))
    setOpponentCard(generateBattleCard(randomOpponentCard))
    setPlayerHealth(100)
    setOpponentHealth(100)
    setBattleLog([])
    setIsPlayerTurn(true)
    setGameOver(false)
    setWinner(null)
    setShowVictory(false)
    setDamageNumbers([])
  }

  const getRarityColor = (rarity: BattleCard["rarity"]) => {
    switch (rarity) {
      case "legendary":
        return "border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.5)]"
      case "epic":
        return "border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.5)]"
      case "rare":
        return "border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.5)]"
      default:
        return "border-gray-500 shadow-[0_0_20px_rgba(107,114,128,0.3)]"
    }
  }

  if (!playerCard || !opponentCard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold animate-pulse">Loading battle...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <style jsx>{`
        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes attackSlide {
          0% {
            transform: translateX(0) scale(1);
          }
          50% {
            transform: translateX(30px) scale(1.1);
          }
          100% {
            transform: translateX(0) scale(1);
          }
        }

        @keyframes attackSlideLeft {
          0% {
            transform: translateX(0) scale(1);
          }
          50% {
            transform: translateX(-30px) scale(1.1);
          }
          100% {
            transform: translateX(0) scale(1);
          }
        }

        @keyframes hitShake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }

        @keyframes damageFloat {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5);
          }
        }

        @keyframes victoryPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .card-entrance {
          animation: cardEntrance 0.6s ease-out;
        }

        .attacking {
          animation: attackSlide 0.6s ease-in-out;
        }

        .attacking-left {
          animation: attackSlideLeft 0.6s ease-in-out;
        }

        .hit {
          animation: hitShake 0.5s ease-in-out;
        }

        .damage-number {
          animation: damageFloat 1.5s ease-out forwards;
          position: absolute;
          font-size: 2rem;
          font-weight: bold;
          pointer-events: none;
          z-index: 50;
        }

        .victory-animation {
          animation: victoryPulse 1s ease-in-out infinite;
        }
      `}</style>

      <div className="text-center mb-4 md:mb-8">
        <h1 className="font-display text-3xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-2">
          CARD BATTLE ARENA
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">Strategic card combat using your collection</p>
        <Badge variant="outline" className="mt-2">
          <Zap className="w-3 h-3 mr-1" />
          AI Opponent Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-4 md:mb-8">
        {/* Player Card */}
        <div
          className={`space-y-2 md:space-y-4 card-entrance ${playerAttacking ? "attacking" : ""} ${playerHit ? "hit" : ""}`}
        >
          <div className="text-center">
            <Badge variant="secondary" className="mb-2 text-xs md:text-sm">
              YOUR CARD
            </Badge>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
              <div className="text-xl md:text-2xl font-bold text-red-500 transition-all duration-300">
                {playerHealth}
              </div>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-500"
                style={{ width: `${playerHealth}%` }}
              />
            </div>
          </div>

          <div className="relative">
            <Card
              className={`p-2 md:p-4 bg-black/50 border-2 md:border-4 ${getRarityColor(playerCard.rarity)} transition-all duration-300`}
            >
              <img
                src={playerCard.image || "/placeholder.svg"}
                alt={playerCard.name}
                className="w-full aspect-[2/3] object-cover rounded-lg mb-2 md:mb-4"
              />
              <div className="space-y-1 md:space-y-2 text-sm md:text-base">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 md:gap-2">
                    <Swords className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                    <span className="text-xs md:text-sm">Attack</span>
                  </span>
                  <span className="font-bold text-red-500">{playerCard.attack}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 md:gap-2">
                    <Shield className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                    <span className="text-xs md:text-sm">Defense</span>
                  </span>
                  <span className="font-bold text-blue-500">{playerCard.defense}</span>
                </div>
              </div>
            </Card>
            {damageNumbers
              .filter((d) => d.isPlayer)
              .map((d) => (
                <div
                  key={d.id}
                  className="damage-number text-red-500 text-xl md:text-2xl"
                  style={{
                    left: `calc(50% + ${d.x}px)`,
                    top: "50%",
                  }}
                >
                  -{d.damage}
                </div>
              ))}
          </div>

          {!gameOver && isPlayerTurn && (
            <Button onClick={attack} className="w-full animate-pulse" size="lg">
              <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              ATTACK
            </Button>
          )}
        </div>

        {/* Opponent Card */}
        <div
          className={`space-y-2 md:space-y-4 card-entrance ${opponentAttacking ? "attacking-left" : ""} ${opponentHit ? "hit" : ""}`}
          style={{ animationDelay: "0.2s" }}
        >
          <div className="text-center">
            <Badge variant="destructive" className="mb-2 text-xs md:text-sm">
              OPPONENT
            </Badge>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
              <div className="text-xl md:text-2xl font-bold text-red-500 transition-all duration-300">
                {opponentHealth}
              </div>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${opponentHealth}%` }}
              />
            </div>
          </div>

          <div className="relative">
            <Card
              className={`p-2 md:p-4 bg-black/50 border-2 md:border-4 ${getRarityColor(opponentCard.rarity)} transition-all duration-300`}
            >
              <img
                src={opponentCard.image || "/placeholder.svg"}
                alt={opponentCard.name}
                className="w-full aspect-[2/3] object-cover rounded-lg mb-2 md:mb-4"
              />
              <div className="space-y-1 md:space-y-2 text-sm md:text-base">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 md:gap-2">
                    <Swords className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                    <span className="text-xs md:text-sm">Attack</span>
                  </span>
                  <span className="font-bold text-red-500">{opponentCard.attack}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 md:gap-2">
                    <Shield className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                    <span className="text-xs md:text-sm">Defense</span>
                  </span>
                  <span className="font-bold text-blue-500">{opponentCard.defense}</span>
                </div>
              </div>
            </Card>
            {damageNumbers
              .filter((d) => !d.isPlayer)
              .map((d) => (
                <div
                  key={d.id}
                  className="damage-number text-red-500 text-xl md:text-2xl"
                  style={{
                    left: `calc(50% + ${d.x}px)`,
                    top: "50%",
                  }}
                >
                  -{d.damage}
                </div>
              ))}
          </div>

          {!gameOver && !isPlayerTurn && (
            <div className="w-full p-3 md:p-4 text-center bg-muted/20 rounded-lg animate-pulse">
              <div className="text-base md:text-lg font-bold">AI Opponent Thinking...</div>
            </div>
          )}
        </div>
      </div>

      <Card className="p-4 md:p-6 bg-black/50 border-2 border-primary/30">
        <h3 className="font-display text-lg md:text-xl font-bold mb-3 md:mb-4">Battle Log</h3>
        <div className="space-y-2 max-h-32 md:max-h-40 overflow-y-auto">
          {battleLog.map((log, index) => (
            <div
              key={index}
              className="text-xs md:text-sm text-muted-foreground animate-in fade-in slide-in-from-left duration-300"
            >
              {log}
            </div>
          ))}
        </div>
      </Card>

      {gameOver && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-in fade-in duration-500 p-4">
          <Card
            className={`p-6 md:p-8 max-w-md w-full text-center space-y-4 ${showVictory ? "victory-animation" : ""}`}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              {winner === "player" ? (
                <span className="text-green-500 animate-in zoom-in duration-700">VICTORY!</span>
              ) : (
                <span className="text-red-500 animate-in zoom-in duration-700">DEFEAT</span>
              )}
            </h2>
            <p className="text-sm md:text-base text-muted-foreground animate-in fade-in slide-in-from-bottom duration-500 delay-300">
              {winner === "player" ? "You defeated the AI opponent!" : "The AI opponent was too strong!"}
            </p>
            {winner === "player" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom duration-500 delay-500">
                <div className="text-xl md:text-2xl font-bold text-yellow-500">+100 Points</div>
                <div className="text-lg md:text-xl font-bold text-pink-500">+2 Tickets</div>
              </div>
            )}
            <Button
              onClick={resetGame}
              size="lg"
              className="w-full animate-in fade-in slide-in-from-bottom duration-500 delay-700"
            >
              Battle Again
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}
