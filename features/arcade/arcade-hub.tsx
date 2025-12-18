"use client"
import Link from "next/link"
import Image from "next/image"
import { PackageOpen, Swords, Zap, Trophy, Users2 } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useArcade } from "@/components/providers"
import { useEffect, useState } from "react"
import { GameModal } from "@/components/game-modal"
import { AuthDialog } from "@/components/auth-dialog"

export default function ArcadeHub() {
  const { addTxn, updateTxn, tickets, points, isAuthenticated, handleAuthSuccess } = useArcade()
  const [apeBalance] = useState("125.50")
  const [activeGame, setActiveGame] = useState<{ url: string; title: string } | null>(null)
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  // Show auth dialog on mount - always show on page load for security
  useEffect(() => {
    // Always show dialog on initial mount to require fresh sign-in
    console.log("🔍 Showing auth dialog - fresh sign-in required")
    setShowAuthDialog(true)
    
    // Close dialog when user becomes authenticated
    if (isAuthenticated) {
      console.log("✅ Authenticated, hiding auth dialog")
      setShowAuthDialog(false)
    }
  }, [isAuthenticated])

  // Listen for show auth dialog event from profile menu
  useEffect(() => {
    const handleShowAuthDialog = () => {
      console.log("🔍 Profile menu requested auth dialog")
      setShowAuthDialog(true)
    }
    window.addEventListener("showAuthDialog", handleShowAuthDialog)
    return () => window.removeEventListener("showAuthDialog", handleShowAuthDialog)
  }, [])

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
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onAuthSuccess={handleAuthSuccess}
      />

      <GameModal
        isOpen={!!activeGame}
        onClose={() => setActiveGame(null)}
        gameUrl={activeGame?.url || ""}
        gameTitle={activeGame?.title || ""}
      />

      <MintSoonDialog />

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

        <div className="relative z-10 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Image
              src="/images/design-mode/ApeCoin.png"
              alt="ApeCoin"
              width={32}
              height={32}
              className="h-7 w-7 md:h-8 md:w-8 drop-shadow-[0_0_18px_hsl(var(--neon-blue)/0.8)]"
            />
            <span className="font-mono text-sm md:text-base font-semibold tracking-[0.26em] uppercase text-sky-300 text-glow">
              Building on ApeChain
            </span>
          </div>

          <div className="flex justify-center">
            <Image
              src="/1500x500%20Banner%20Logo%20Transparent%20BG.png"
              alt="Crypto Rabbit Arcade"
              width={450}
              height={150}
              priority
              className="w-full max-w-lg md:max-w-2xl h-auto mx-auto drop-shadow-[0_0_45px_hsl(var(--neon-cyan)/0.5)]"
            />
          </div>
          <p className="max-w-2xl mx-auto">
            <span className="inline-flex items-center justify-center rounded-full px-4 md:px-6 py-1.5 md:py-2 bg-white/5 backdrop-blur-md border border-white/15 shadow-[0_0_30px_hsl(var(--neon-cyan)/0.5)]">
              <span className="font-display text-xs md:text-sm lg:text-base font-semibold tracking-[0.35em] uppercase bg-gradient-to-r from-cyan-200 via-emerald-200 to-sky-200 bg-clip-text text-transparent text-glow">
                Collect • Learn • Play • Trade
              </span>
            </span>
          </p>

        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold mb-6 flex items-center gap-3">
          <Zap className="w-8 h-8 text-pink-500 animate-pulse" />
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Play To Dominate Leaderboards For Rewards
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <ArcadeCabinet
            title="Ape In!"
            subtitle="ACTION • ARCADE"
            description="Fast-paced push-your-luck action"
            url="https://ape-in-game.vercel.app"
            players={38}
            color="pink"
            onPlay={setActiveGame}
          />
          <ArcadeCabinet
            title="Cryptoku!"
            subtitle="PUZZLE • STRATEGY"
            description="Solve crypto-themed Sudoku puzzles and climb the leaderboard"
            url="https://cryptoku.vercel.app"
            players={42}
            color="cyan"
            onPlay={setActiveGame}
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold mb-6 flex items-center gap-3">
          <PackageOpen className="w-8 h-8 text-secondary animate-pulse" />
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            The Crypto Rabbit Hole® TCG
          </span>
        </h2>

        <p className="text-sm text-muted-foreground mb-4">
          Coming Soon — watch the teaser for the first on-chain TCG set in The Crypto Rabbit Hole® universe.
        </p>

        <div className="relative mb-6 overflow-hidden rounded-2xl border-2 border-pink-500/40 bg-black/60 shadow-[0_0_35px_hsl(var(--neon-pink)/0.45)] aspect-video">
          <iframe
            src="https://www.youtube.com/embed/iA1bBbV7GtM"
            title="The Crypto Rabbit Hole TCG Teaser"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        </div>

        <div className="flex gap-4">
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

function MintSoonDialog() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const w = window as unknown as { __csMintModalHasShown?: boolean }
    if (w.__csMintModalHasShown) {
      // Already shown once this page load / tab lifetime – don&apos;t show again.
      return
    }

    w.__csMintModalHasShown = true
    setOpen(true)
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md px-4">
        <div className="relative holo-panel border border-cyan-400/60 shadow-[0_0_40px_hsl(var(--neon-cyan)/0.6)]">
          <button
            type="button"
            aria-label="Close mint announcement"
            onClick={() => setOpen(false)}
            className="absolute -top-5 -right-5 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-cyan-400/60 text-xl font-bold text-cyan-200 shadow-[0_0_25px_hsl(var(--neon-cyan)/0.8)] hover:scale-105 hover:text-cyan-100 transition-transform"
          >
            ×
          </button>

          <div className="relative z-10 px-5 py-6 md:px-7 md:py-7 space-y-4">
            <header className="space-y-2">
              <h2 className="font-display text-xl md:text-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent text-glow">
                Ciphers &amp; Sentinels — Mint Coming Soon
              </h2>
              <p className="text-sm text-muted-foreground">
                Premium founder PFPs for the Crypto Rabbit Arcade. Tap into the mint page to see the roadmap, perks,
                and milestones.
              </p>
            </header>

            <div className="mt-2 rounded-2xl border border-cyan-400/40 bg-black/40 px-4 py-3 text-xs font-mono text-cyan-100">
              <p>Signal ping only — art, rarity tables, and mint mechanics will be revealed closer to launch.</p>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                asChild
                size="sm"
                className="flex-1 sm:flex-none bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-xs font-semibold shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)]"
                onClick={() => setOpen(false)}
              >
                <Link href="/ciphers-sentinels">Show me the mint</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ArcadeCabinet({ title, subtitle, description, url, color, onPlay }: any) {
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
      className={`relative group overflow-hidden bg-gradient-to-br from-black/90 to-${color}-950/20 border-4 ${borderColors[color as keyof typeof borderColors]} rounded-2xl p-6 transition-all hover:scale-105 ${glowColors[color as keyof typeof glowColors]}`}
    >
      {title === "Ape In!" && (
        <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen">
          <Image
            src="/ApeInBanner.png"
            alt="APE-IN-GAME banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>
      )}

      {title === "Cryptoku!" && (
        <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen">
          <Image
            src="/CryptokuBanner.png"
            alt="CRYPTOKU banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        </div>
      )}

      <div className="relative z-10 space-y-4">
        <div>
          <h3 className="font-display text-2xl font-bold text-pink-400 mb-1">{title}</h3>
          <p className="text-xs text-white/90 font-mono drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]">
            {subtitle}
          </p>
        </div>

        <p className="text-sm text-white/90 drop-shadow-[0_0_10px_rgba(0,0,0,1)]">{description}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users2 className="w-4 h-4" />
            <span className="font-mono tracking-[0.16em] text-xs uppercase">Arcade Live</span>
          </div>
        </div>

        <Button
          onClick={() => onPlay({ url, title })}
          className={`w-full text-lg font-bold ${buttonColors[color as keyof typeof buttonColors]}`}
          size="lg"
        >
          START GAME
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
