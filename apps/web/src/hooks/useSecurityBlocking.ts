import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

function useConnectedViaEmbeddedWallet() {
  const { isConnected } = useAccount()
  return isConnected
}

export function useSecurityBlocking() {
  const [blocking, setBlocking] = useState(false)
  const isConnectedViaEmbeddedWallet = useConnectedViaEmbeddedWallet()

  useEffect(() => {
    if (isConnectedViaEmbeddedWallet && typeof window !== 'undefined' && window.self !== window.top) {
      setBlocking(true)
    }
  }, [isConnectedViaEmbeddedWallet])

  return blocking
}
