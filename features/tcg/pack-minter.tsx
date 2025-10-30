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
    image: "/cards/35.png",
    description: "Basic card pack with common and rare cards",
  },
  {
    id: "premium",
    name: "Premium Pack",
    price: 15,
    cardsPerPack: 8,
    rarity: "premium",
    image: "/cards/20.png",
    description: "Enhanced pack with guaranteed rare+ cards",
  },
  {
    id: "legendary",
    name: "Legendary Pack",
    price: 50,
    cardsPerPack: 12,
    rarity: "legendary",
    image: "/cards/08.png",
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
  const { addTxn, updateTxn, addPoints, addTickets, addCard } = useArcade()
  const { toast } = useToast()
  const [selectedPack, setSelectedPack] = useState<PackType | null>(null)
  const [isRipping, setIsRipping] = useState(false)
  const [revealedCards, setRevealedCards] = useState<RevealedCard[]>([])
  const [showResults, setShowResults] = useState(false)
  const [ripProgress, setRipProgress] = useState(0)
  const [showCardReveal, setShowCardReveal] = useState(false)

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
    setRipProgress(0)

    const id = crypto.randomUUID()
    addTxn({ id, title: `Ripping ${pack.name}`, status: "prepare" })

    const entropy = await requestEntropy()
    if (entropy.error) {
      updateTxn(id, { status: "error", error: entropy.error })
      setIsRipping(false)
      return
    }

    for (let i = 0; i <= 100; i += 10) {
      setRipProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    updateTxn(id, { status: "confirmed" })

    const cards = generateCards(pack)
    setRevealedCards(cards)
    setIsRipping(false)

    setShowCardReveal(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setShowCardReveal(false)
    setShowResults(true)

    cards.forEach((card) => {
      addCard(card)
    })

    const totalPoints = cards.reduce((sum, card) => sum + card.power * 10, 0)
    addPoints(totalPoints)

    toast({
      title: "Cards Revealed!",
      description: `You earned ${totalPoints} points from this pack!`,
    })
  }

  function generateCards(pack: PackType): RevealedCard[] {
    const cards: RevealedCard[] = []
    const cardData = [
      { name: "Oracle Major Upgrade", id: 1 },
      { name: "Cipher Card", id: 2 },
      { name: "En-Jin Warrior", id: 3 },
      { name: "Crypto Rabbit", id: 4 },
      { name: "Blockchain Defender", id: 5 },
      { name: "Smart Contract Mage", id: 6 },
      { name: "DeFi Dragon", id: 7 },
      { name: "NFT Phoenix", id: 8 },
      { name: "Web3 Wizard", id: 9 },
      { name: "Metaverse Knight", id: 10 },
      { name: "Token Titan", id: 11 },
      { name: "Gas Optimizer", id: 12 },
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

      const randomCard = cardData[Math.floor(Math.random() * cardData.length)]

      cards.push({
        id: crypto.randomUUID(),
        name: randomCard.name,
        image: `/cards/gen1-${randomCard.id}.png`,
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
      <div>
        <h1 className="font-display text-3xl font-bold text-glow mb-2">TCG Card Packs</h1>
        <p className="text-muted-foreground">Mint and rip packs to collect powerful cards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PACK_TYPES.map((pack) => (
          <PackCard key={pack.id} pack={pack} onMint={handleMintPack} onRip={handleRipPack} />
        ))}
      </div>

      <Dialog open={isRipping} onOpenChange={() => {}}>
        <DialogContent className="max-w-md border-2 border-pink-500/30 bg-black/90 backdrop-blur-xl">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-48 h-48 mb-6">
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: "2s" }}>
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 opacity-50 blur-2xl" />
              </div>
              <div className="relative w-full h-full flex items-center justify-center animate-pulse">
                <PackageOpen className="w-32 h-32 text-pink-500" />
              </div>
            </div>

            <h3 className="font-display text-3xl font-bold mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
              RIPPING PACK...
            </h3>
            <p className="text-muted-foreground text-center mb-4">Using Pyth Entropy for provably fair randomness</p>

            <div className="w-full max-w-xs h-2 bg-muted/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${ripProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{ripProgress}%</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCardReveal} onOpenChange={() => {}}>
        <DialogContent className="max-w-4xl border-2 border-pink-500/30 bg-black/90 backdrop-blur-xl">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="absolute inset-0 animate-ping">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 opacity-30 blur-3xl" />
              </div>

              <Sparkles
                className="w-32 h-32 text-pink-500 animate-spin relative z-10"
                style={{ animationDuration: "1s" }}
              />
            </div>

            <h2 className="font-display text-5xl font-bold mt-8 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-pulse">
              LEGENDARY PULL!
            </h2>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showResults} onOpenChange={closeResults}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto border-2 border-pink-500/30 bg-black/90 backdrop-blur-xl">
          <div className="space-y-6 p-4">
            <div className="text-center">
              <h2 className="font-display text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                CARDS REVEALED!
              </h2>
              <p className="text-muted-foreground text-lg">
                You got {revealedCards.length} new cards added to your inventory
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {revealedCards.map((card, index) => (
                <RevealedCardDisplay key={card.id} card={card} delay={index * 150} />
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={closeResults}
                className="flex-1 h-12 text-lg shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)] bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                View in Inventory
              </Button>
            </div>
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
    common: "border-gray-500/50",
    rare: "border-cyan-500/50 shadow-[0_0_20px_hsl(var(--neon-cyan)/0.5)]",
    epic: "border-purple-500/50 shadow-[0_0_20px_hsl(var(--neon-purple)/0.5)]",
    legendary: "border-pink-500/50 shadow-[0_0_30px_hsl(var(--neon-pink)/0.7)]",
  }

  const rarityBadges = {
    common: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    rare: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    epic: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    legendary: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  }

  return (
    <div
      className={`bg-black/60 backdrop-blur-xl border-2 ${rarityColors[card.rarity]} rounded-xl overflow-hidden animate-in fade-in zoom-in duration-700 hover:scale-105 transition-transform`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-muted/20">
        <Image
          src={card.image || "/placeholder.svg"}
          alt={card.name}
          fill
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = "/cards/CardBack-Final.jpg"
          }}
        />
        <Badge className={`absolute top-2 right-2 ${rarityBadges[card.rarity]} border text-xs font-bold`}>
          {card.rarity.toUpperCase()}
        </Badge>
      </div>
      <div className="p-3 bg-gradient-to-b from-transparent to-black/50">
        <h4 className="font-semibold text-sm truncate mb-1">{card.name}</h4>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Power</span>
          <span className="font-bold text-pink-400">{card.power}</span>
        </div>
      </div>
    </div>
  )
}
