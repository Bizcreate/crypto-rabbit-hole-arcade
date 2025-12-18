export type Nft = {
  id: string
  contract: string
  image: string
  name: string
  staked?: boolean
  rarity?: "common" | "rare" | "epic" | "legendary"
}

export async function fetchUserNfts(address?: string): Promise<Nft[]> {
  if (!address) return []

  // Mock data for demo - replace with actual NFT indexer
  return [
    {
      id: "1",
      contract: "Crypto-Rabbit-TCG",
      name: "Oracle Major Upgrade",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Artboard-1-83QWedD6ivnkXqy5WoMh05oLPpdMO6.png",
      rarity: "legendary",
    },
    {
      id: "2",
      contract: "Crypto-Rabbit-TCG",
      name: "Cipher Card",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cards-9hrDEd5jlrSvc2wjUubLaZnBKxEvDU.png",
      rarity: "rare",
    },
    {
      id: "3",
      contract: "The Crypto Rabbit Hole",
      name: "Cipher PFP #00001",
      image: "/images/design-mode/Cipher%20Concept.png",
      rarity: "epic",
    },
    {
      id: "4",
      contract: "Crypto-Rabbit-TCG",
      name: "En-Jin Warrior",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/En-Jin-LaS1HMzGFEr6Z8MYHXVsDaCDWofN96.png",
      rarity: "epic",
    },
  ]
}

export async function stakeNft(id: string): Promise<boolean> {
  // Mock implementation
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return true
}

export async function unstakeNft(id: string): Promise<boolean> {
  // Mock implementation
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return true
}
