"use client"
import Link from "next/link"
import Image from "next/image"
import { PackageOpen, Swords, Zap, Trophy, Users2 } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useArcade } from "@/components/providers"
import { useState } from "react"

export default function ArcadeHub() {
  const { addTxn, updateTxn, tickets, points } = useArcade()
  const [apeBalance] = useState("125.50")

  async function rollEntropy() {
    const id = crypto.randomUUID()
    addTxn({ id, title: "Entropy Roll", status: "prepare" })

    setTimeout(() => {
      updateTxn(id, { status: "pending", hash: "0x" + Math.random().toString(16).slice(2) })
      setTimeout(() => updateTxn(id, { status: "confirmed" }), 2000)
    }, 1000)
  }

  return (
    <div className="min-h-screen">
      <div className="relative mb-8 overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-purple-500/5 to-cyan-500/10 p-8">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
            linear-gradient(to right, hsl(var(--neon-pink)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--neon-cyan)) 1px, transparent 1px)
          `,
            backgroundSize: "40px 40px",
            transform: "perspective(500px) rotateX(60deg)",
            transformOrigin: "center top",
          }}
        />

        <div className="relative z-10 text-center space-y-4">
          <h1 className="font-display text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-pulse">
            CRYPTO RABBIT ARCADE
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insert Ape • Play Games • Collect Cards • Dominate Leaderboards
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="bg-black/50 border-2 border-pink-500/50 rounded-lg px-6 py-3 font-mono shadow-[0_0_20px_hsl(var(--neon-pink)/0.3)]">
              <div className="text-xs text-pink-400 mb-1">APE BALANCE</div>
              <div className="text-2xl font-bold text-pink-400">{apeBalance}</div>
            </div>
            <div className="bg-black/50 border-2 border-purple-500/50 rounded-lg px-6 py-3 font-mono shadow-[0_0_20px_hsl(var(--neon-purple)/0.3)]">
              <div className="text-xs text-purple-400 mb-1">CARD PACKS</div>
              <div className="text-2xl font-bold text-purple-400">3</div>
            </div>
            <div className="bg-black/50 border-2 border-cyan-500/50 rounded-lg px-6 py-3 font-mono shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]">
              <div className="text-xs text-cyan-400 mb-1">POINTS</div>
              <div className="text-2xl font-bold text-cyan-400">{points}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold mb-6 flex items-center gap-3">
          <Zap className="w-8 h-8 text-pink-500 animate-pulse" />
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            GAME CABINETS
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <ArcadeCabinet
            title="APE-IN-GAME"
            subtitle="ACTION • ARCADE"
            description="Fast-paced arcade action with blockchain rewards"
            url="https://ape-in-game.vercel.app"
            players={38}
            color="pink"
          />
          <ArcadeCabinet
            title="CRYPTOKU"
            subtitle="PUZZLE • STRATEGY"
            description="Solve crypto-themed Sudoku puzzles and earn rewards"
            url="https://cryptoku.vercel.app"
            players={42}
            color="cyan"
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold mb-6 flex items-center gap-3">
          <PackageOpen className="w-8 h-8 text-secondary animate-pulse" />
          TRADING CARD GAME
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <CardDisplay
            src="/images/design-mode/Cipher.png"
            alt="Cipher Card"
            rarity="common"
          />
          <CardDisplay
            src="/images/design-mode/Bullish%20Action.png"
            alt="Bullish Action Card"
            rarity="rare"
          />
          <CardDisplay
            src="/images/design-mode/Barish%20Action.png"
            alt="Bearish Action Card"
            rarity="rare"
          />
          <CardDisplay
            src="/images/design-mode/Radiation.png"
            alt="Reaction Card"
            rarity="epic"
          />
          <CardDisplay
            src="/images/design-mode/Overwatch.png"
            alt="Oracle Upgrade Card"
            rarity="legendary"
          />
        </div>

        <div className="flex gap-4">
          <Button asChild size="lg" className="flex-1 text-lg font-bold">
            <Link href="/mint">
              <PackageOpen className="w-5 h-5 mr-2" />
              OPEN PACKS
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1 text-lg font-bold bg-transparent">
            <Link href="/inventory">
              <Swords className="w-5 h-5 mr-2" />
              VIEW COLLECTION
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <h2 className="font-display text-3xl font-bold mb-6 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-cyan-500 animate-pulse" />
          <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">HIGH SCORES</span>
        </h2>

        <div className="bg-black/50 border-2 border-cyan-500/30 rounded-2xl p-6 font-mono shadow-[0_0_30px_hsl(var(--neon-cyan)/0.2)]">
          <div className="space-y-2">
            <ScoreEntry rank={1} name="CRYPTOWHALE.ETH" score={15420} isTop />
            <ScoreEntry rank={2} name="APEKING.ETH" score={12890} isTop />
            <ScoreEntry rank={3} name="RABBITHOLE.ETH" score={11250} isTop />
            <ScoreEntry rank={4} name="YOU" score={points} isPlayer />
          </div>
        </div>
      </div>
    </div>
  )
}

function ArcadeCabinet({ title, subtitle, description, url, players, color }: any) {
  const borderColors = {
    pink: "border-pink-500/50 hover:border-pink-500",
    cyan: "border-cyan-500/50 hover:border-cyan-500",
    purple: "border-purple-500/50 hover:border-purple-500",
  }

  const glowColors = {
    pink: "shadow-[0_0_30px_hsl(var(--neon-pink)/0.5)]",
    cyan: "shadow-[0_0_30px_hsl(var(--neon-cyan)/0.5)]",
    purple: "shadow-[0_0_30px_hsl(var(--neon-purple)/0.5)]",
  }

  const buttonColors = {
    pink: "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600",
    cyan: "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600",
    purple: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
  }

  return (
    <div
      className={`relative group bg-gradient-to-br from-black/90 to-${color}-950/20 border-4 ${borderColors[color as keyof typeof borderColors]} rounded-2xl p-6 transition-all hover:scale-105 ${glowColors[color as keyof typeof glowColors]}`}
    >
      <div
        className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r ${buttonColors[color as keyof typeof buttonColors]} px-6 py-1 rounded-full text-xs font-bold text-white shadow-lg`}
      >
        INSERT COIN
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-display text-2xl font-bold text-pink-400 mb-1">{title}</h3>
          <p className="text-xs text-muted-foreground font-mono">{subtitle}</p>
        </div>

        <p className="text-sm text-muted-foreground">{description}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users2 className="w-4 h-4" />
            <span className="font-mono">{players} PLAYING</span>
          </div>
        </div>

        <Button
          asChild
          className={`w-full text-lg font-bold ${buttonColors[color as keyof typeof buttonColors]}`}
          size="lg"
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            START GAME
          </a>
        </Button>
      </div>
    </div>
  )
}

function CardDisplay({ src, alt, rarity }: any) {
  const rarityColors = {
    common: "border-gray-500",
    rare: "border-blue-500",
    epic: "border-purple-500",
    legendary: "border-yellow-500",
  }

  return (
    <div className={`relative group cursor-pointer transition-transform hover:scale-110 hover:z-10`}>
      <div
        className={`absolute inset-0 ${rarityColors[rarity as keyof typeof rarityColors]} opacity-0 group-hover:opacity-100 blur-xl transition-opacity`}
      />
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={200}
        height={280}
        className={`relative rounded-lg border-2 ${rarityColors[rarity as keyof typeof rarityColors]} shadow-2xl`}
      />
    </div>
  )
}

function ScoreEntry({ rank, name, score, isTop, isPlayer }: any) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg ${
        isPlayer ? "bg-pink-500/20 border-2 border-pink-500" : isTop ? "bg-cyan-500/10" : "bg-muted/10"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-xl ${
            rank === 1
              ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-black"
              : rank === 2
                ? "bg-gradient-to-br from-gray-300 to-gray-500 text-black"
                : rank === 3
                  ? "bg-gradient-to-br from-orange-400 to-red-500 text-black"
                  : "bg-muted text-foreground"
          }`}
        >
          {rank}
        </div>
        <span className="font-bold text-lg">{name}</span>
      </div>
      <span className="font-bold text-2xl text-pink-400">{score.toLocaleString()}</span>
    </div>
  )
}
