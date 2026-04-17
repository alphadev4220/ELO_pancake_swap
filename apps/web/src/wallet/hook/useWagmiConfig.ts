import { isInBinance } from '@binance/w3w-utils'
import { useEffect, useRef } from 'react'
import { createW3WWagmiConfig, createWagmiConfig } from 'utils/wagmi'
import { eip6963Providers } from 'wallet/WalletProvider'
import { atom, useAtom } from 'jotai'

// Lazy singleton: created once on first access, stable across renders
let singletonConfig: ReturnType<typeof createWagmiConfig> | null = null
function getDefaultConfig() {
  if (!singletonConfig) {
    singletonConfig = createWagmiConfig()
  }
  return singletonConfig
}

export const wagmiConfigAtom = atom<any>(null)
export const useWagmiConfig = () => {
  const [wagmiConfig, setWagmiConfig] = useAtom(wagmiConfigAtom)
  // Use a ref to hold the stable config so it never changes between renders
  const configRef = useRef(wagmiConfig ?? getDefaultConfig())

  // Initialize atom once
  useEffect(() => {
    if (!wagmiConfig) {
      setWagmiConfig(configRef.current)
    }
  }, [wagmiConfig, setWagmiConfig])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const handleAnnounceProvider = (event: any) => {
      if (!event?.detail || typeof event.detail !== 'object') {
        console.warn("[wallet] Ignored 'eip6963:announceProvider' event: invalid detail: ", event?.detail)
        return
      }
      const { provider, info } = event.detail
      if (!provider || !info?.uuid) return
      const exists = eip6963Providers.some((p) => p.info.uuid === info.uuid)
      if (exists) {
        return
      }
      eip6963Providers.push({
        provider,
        info,
      })
    }
    window.addEventListener('eip6963:announceProvider', handleAnnounceProvider)
    window.dispatchEvent(new Event('eip6963:requestProvider'))

    const timer = setTimeout(() => {
      console.log(`[wallet] init wagmi config`)
      if (typeof window !== 'undefined' && isInBinance()) {
        setWagmiConfig(createW3WWagmiConfig())
      }
    })

    return () => {
      window.removeEventListener('eip6963:announceProvider', handleAnnounceProvider)
      clearTimeout(timer)
    }
  }, [setWagmiConfig])

  // Return atom value if set (e.g. after Binance override), otherwise the stable singleton
  return wagmiConfig ?? configRef.current
}
