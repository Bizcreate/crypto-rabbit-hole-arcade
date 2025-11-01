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

  // Mock data using actual card images from /public/cards
  return [
    {
      id: "1",
      contract: "Crypto-Rabbit-TCG",
      name: "Oracle Major Upgrade",
      image: "/cards/33.png",
      rarity: "legendary",
    },
    {
      id: "2",
      contract: "Crypto-Rabbit-TCG",
      name: "Cipher Card",
      image: "/cards/59.png",
      rarity: "rare",
    },
    {
      id: "3",
      contract: "BAYC",
      name: "Saul",
      image: "/cards/29.png",
      rarity: "epic",
    },
    {
      id: "4",
      contract: "Crypto-Rabbit-TCG",
      name: "En-J1n Warrior",
      image: "/cards/12.png",
      rarity: "epic",
    },
    {
      id: "5",
      contract: "Crypto-Rabbit-TCG",
      name: "Rug Pull",
      image: "/cards/50.png",
      rarity: "rare",
    },
    {
      id: "6",
      contract: "Crypto-Rabbit-TCG",
      name: "Dex Swap",
      image: "/cards/59.png",
      rarity: "common",
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
