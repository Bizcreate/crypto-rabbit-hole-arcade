import { useState, useEffect } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { getBalance } from 'thirdweb/extensions/erc20'
import { client } from '../lib/thirdweb'

// Token config via env for easy switching between CURTIS testnet and APE mainnet
const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS || ''
const TOKEN_SYMBOL = import.meta.env.VITE_TOKEN_SYMBOL || 'CURTIS'
const TOKEN_DECIMALS = Number(import.meta.env.VITE_TOKEN_DECIMALS || 18)

export function useTokenBalance() {
  const [balance, setBalance] = useState<string>('0')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const account = useActiveAccount()

  useEffect(() => {
    const fetchBalance = async () => {
      if (!account || !TOKEN_ADDRESS) {
        setBalance('0')
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const balanceResult = await getBalance({
          contract: {
            address: TOKEN_ADDRESS,
            chain: client.chain,
            client: client,
          },
          address: account.address,
        })

        const formattedBalance = (Number(balanceResult) / 10 ** TOKEN_DECIMALS).toFixed(4)
        setBalance(formattedBalance)
      } catch (err) {
        console.error(`Failed to fetch ${TOKEN_SYMBOL} balance:`, err)
        setError('Failed to load balance')
        setBalance('0')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalance()
    const interval = setInterval(fetchBalance, 30000)
    return () => clearInterval(interval)
  }, [account])

  return { balance, isLoading, error, symbol: TOKEN_SYMBOL }
}
