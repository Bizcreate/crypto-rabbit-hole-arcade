export function useOthersidePresence() {
  // Mock presence data - replace with actual Otherside SDK
  return {
    online: Math.floor(Math.random() * 50) + 100,
    worlds: ["Arcade-1", "TCG-Arena", "Crypto-Lounge"],
  }
}
