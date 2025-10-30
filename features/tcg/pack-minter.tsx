"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PackageOpen, Sparkles, ShoppingCart } from "@/components/icons"
import { useArcade } from "@/components/providers"
import { useToast } from "@/hooks/use-toast"
import { requestEntropy } from "@/adapters/entropy.adapter"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"

type PackType = {
  id: string
  name: string
  price: number
  cardsPerPack: number
  rarity: "standard" | "premium" | "legendary"
  image: string
  description: string
}

const PACK_TYPES: PackType[] = [
  {
    id: "standard",
    name: "Standard Pack",
    price: 5,
    cardsPerPack: 5,
    rarity: "standard",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cards-9hrDEd5jlrSvc2wjUubLaZnBKxEvDU.png",
    description: "Basic card pack with common and rare cards",
  },
  {
    id: "premium",
    name: "Premium Pack",
    price: 15,
    cardsPerPack: 8,
    rarity: "premium",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Artboard-1-83QWedD6ivnkXqy5WoMh05oLPpdMO6.png",
    description: "Enhanced pack with guaranteed rare+ cards",
  },
  {
    id: "legendary",
    name: "Legendary Pack",
    price: 50,
    cardsPerPack: 12,
    rarity: "legendary",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/En-Jin-LaS1HMzGFEr6Z8MYHXVsDaCDWofN96.png",
    description: "Ultimate pack with guaranteed legendary card",
  },
]

type RevealedCard = {
  id: string
  name: string
  image: string
  rarity: "common" | "rare" | "epic" | "legendary"
  power: number
}

export default function PackMinter() {
  const { addTxn, updateTxn, addPoints, addTickets } = useArcade()
  const { toast } = useToast()
  const [selectedPack, setSelectedPack] = useState<PackType | null>(null)
  const [isRipping, setIsRipping] = useState(false)
  const [revealedCards, setRevealedCards] = useState<RevealedCard[]>([])
  const [showResults, setShowResults] = useState(false)

  async function handleMintPack(pack: PackType) {
    const id = crypto.randomUUID()
    addTxn({ id, title: `Minting ${pack.name}`, status: "prepare" })

    await new Promise((resolve) => setTimeout(resolve, 1500))

    updateTxn(id, { status: "confirmed" })

    toast({
      title: "Pack Minted!",
      description: `You received 1x ${pack.name}`,
    })

    addTickets(1)
  }

  async function handleRipPack(pack: PackType) {
    setSelectedPack(pack)
    setIsRipping(true)

    const id = crypto.randomUUID()
    addTxn({ id, title: `Ripping ${pack.name}`, status: "prepare" })

    // Request entropy for randomness
    const entropy = await requestEntropy()
    if (entropy.error) {
      updateTxn(id, { status: "error", error: entropy.error })
      setIsRipping(false)
      return
    }

    updateTxn(id, { status: "confirmed" })

    // Simulate card reveal with animation delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate random cards based on pack type
    const cards = generateCards(pack)
    setRevealedCards(cards)
    setIsRipping(false)
    setShowResults(true)

    // Award points based on cards
    const totalPoints = cards.reduce((sum, card) => sum + card.power * 10, 0)
    addPoints(totalPoints)

    toast({
      title: "Cards Revealed!",
      description: `You earned ${totalPoints} points from this pack!`,
    })
  }

  function generateCards(pack: PackType): RevealedCard[] {
    const cards: RevealedCard[] = []
    const cardNames = [
      "Oracle Major Upgrade",
      "Cipher Card",
      "En-Jin Warrior",
      "Crypto Rabbit",
      "Blockchain Defender",
      "Smart Contract Mage",
      "DeFi Dragon",
      "NFT Phoenix",
      "Web3 Wizard",
      "Metaverse Knight",
      "Token Titan",
      "Gas Optimizer",
    ]

    const images = [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Artboard-1-83QWedD6ivnkXqy5WoMh05oLPpdMO6.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cards-9hrDEd5jlrSvc2wjUubLaZnBKxEvDU.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/En-Jin-LaS1HMzGFEr6Z8MYHXVsDaCDWofN96.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saul2-3PubLNdhJjHQxDjPSrfDjEQoNDkOa9.png",
    ]

    for (let i = 0; i < pack.cardsPerPack; i++) {
      const rarityRoll = Math.random()
      let rarity: RevealedCard["rarity"]
      let power: number

      if (pack.rarity === "legendary" && i === 0) {
        rarity = "legendary"
        power = Math.floor(Math.random() * 20) + 80
      } else if (pack.rarity === "premium" && rarityRoll > 0.7) {
        rarity = rarityRoll > 0.95 ? "legendary" : rarityRoll > 0.85 ? "epic" : "rare"
        power = Math.floor(Math.random() * 30) + 50
      } else if (rarityRoll > 0.8) {
        rarity = rarityRoll > 0.95 ? "epic" : "rare"
        power = Math.floor(Math.random() * 40) + 30
      } else {
        rarity = "common"
        power = Math.floor(Math.random() * 30) + 10
      }

      cards.push({
        id: crypto.randomUUID(),
        name: cardNames[Math.floor(Math.random() * cardNames.length)],
        image: images[Math.floor(Math.random() * images.length)],
        rarity,
        power,
      })
    }

    return cards
  }

  function closeResults() {
    setShowResults(false)
    setRevealedCards([])
    setSelectedPack(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-glow mb-2">TCG Card Packs</h1>
        <p className="text-muted-foreground">Mint and rip packs to collect powerful cards</p>
      </div>

      {/* Pack Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PACK_TYPES.map((pack) => (
          <PackCard key={pack.id} pack={pack} onMint={handleMintPack} onRip={handleRipPack} />
        ))}
      </div>

      {/* Ripping Animation */}
      <Dialog open={isRipping} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-32 h-32 mb-6 animate-spin">
              <PackageOpen className="w-32 h-32 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">Ripping Pack...</h3>
            <p className="text-muted-foreground text-center">Using Pyth Entropy for provably fair randomness</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Modal */}
      <Dialog open={showResults} onOpenChange={closeResults}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold text-glow mb-2">Cards Revealed!</h2>
              <p className="text-muted-foreground">You got {revealedCards.length} new cards</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {revealedCards.map((card, index) => (
                <RevealedCardDisplay key={card.id} card={card} delay={index * 100} />
              ))}
            </div>

            <Button onClick={closeResults} className="w-full shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]">
              <Sparkles className="w-4 h-4 mr-2" />
              Awesome!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PackCard({
  pack,
  onMint,
  onRip,
}: {
  pack: PackType
  onMint: (pack: PackType) => void
  onRip: (pack: PackType) => void
}) {
  const rarityColors = {
    standard: "border-blue-500/30 shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]",
    premium: "border-purple-500/30 shadow-[0_0_20px_hsl(var(--neon-purple)/0.3)]",
    legendary: "border-amber-500/30 shadow-[0_0_20px_hsl(var(--neon-pink)/0.3)]",
  }

  const rarityBadges = {
    standard: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    premium: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    legendary: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  }

  return (
    <Card
      className={`overflow-hidden bg-card/40 backdrop-blur-xl border ${rarityColors[pack.rarity]} hover:scale-105 transition-transform`}
    >
      <div className="relative aspect-square overflow-hidden bg-muted/20">
        <Image src={pack.image || "/placeholder.svg"} alt={pack.name} fill className="object-cover" />
        <Badge className={`absolute top-3 right-3 ${rarityBadges[pack.rarity]} border`}>{pack.rarity}</Badge>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-display text-xl font-bold mb-1">{pack.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{pack.description}</p>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cards per pack:</span>
            <span className="font-bold">{pack.cardsPerPack}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button className="w-full shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]" onClick={() => onMint(pack)}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Mint for {pack.price} APE
          </Button>
          <Button variant="outline" className="w-full bg-transparent" onClick={() => onRip(pack)}>
            <PackageOpen className="w-4 h-4 mr-2" />
            Rip Pack
          </Button>
        </div>
      </div>
    </Card>
  )
}

function RevealedCardDisplay({ card, delay }: { card: RevealedCard; delay: number }) {
  const rarityColors = {
    common: "border-muted",
    rare: "border-blue-500/50 shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]",
    epic: "border-purple-500/50 shadow-[0_0_20px_hsl(var(--neon-purple)/0.3)]",
    legendary: "border-amber-500/50 shadow-[0_0_20px_hsl(var(--neon-pink)/0.3)]",
  }

  const rarityBadges = {
    common: "bg-muted text-muted-foreground",
    rare: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    epic: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    legendary: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  }

  return (
    <div
      className={`bg-card/40 backdrop-blur-xl border ${rarityColors[card.rarity]} rounded-xl overflow-hidden animate-in fade-in zoom-in duration-500`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-square overflow-hidden bg-muted/20">
        <Image src={card.image || "/placeholder.svg"} alt={card.name} fill className="object-cover" />
        <Badge className={`absolute top-2 right-2 ${rarityBadges[card.rarity]} border text-xs`}>{card.rarity}</Badge>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-sm truncate mb-1">{card.name}</h4>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Power</span>
          <span className="font-bold text-primary">{card.power}</span>
        </div>
      </div>
    </div>
  )
}
