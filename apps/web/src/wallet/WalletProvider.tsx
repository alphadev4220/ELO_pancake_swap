import { isInBinance } from '@binance/w3w-utils'
import dynamic from 'next/dynamic'
import { useAtomValue } from 'jotai'
import { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { rpcUrlAtom } from '@pancakeswap/utils/user'
import { SpinnerPage } from 'components/SpinnerPage'
import { W3WConfigProvider } from './W3WConfigContext'
import { useSyncWagmiState } from './hook/useSyncWagmiState'
import { WalletEnvProvider } from './hook/useWalletEnv'
import { useWagmiConfig } from './hook/useWagmiConfig'
import { useSyncPersistChain } from './hook/useSyncPersistChain'
import { SolanaWalletStateUpdater } from './SolanaProvider'
import { useBaseMiniAppAutoConnect } from './hook/useBaseMiniAppAutoConnect'

interface WalletProviderProps {
  reconnectOnMount?: boolean
  children?: React.ReactNode
}

export interface EIP6963Detail {
  provider: any
  info: {
    name: string
    rdns: string
    uuid: string
    icon: string
  }
}
export const eip6963Providers: EIP6963Detail[] = []

const SolanaProviders = dynamic(() => import('@pancakeswap/ui-wallets').then((m) => m.SolanaProvider), { ssr: false })

export const WalletProvider = (props: WalletProviderProps) => {
  const { children } = props
  const endpoint = useAtomValue(rpcUrlAtom)

  const wagmiConfig = useWagmiConfig()

  return (
    <WagmiProvider reconnectOnMount config={wagmiConfig}>
      <W3WConfigProvider value={isInBinance()}>
        <WalletEnvProvider>
          <ChainGate>
            <Sync />
            <SolanaProviders endpoint={endpoint}>
              <SolanaWalletStateUpdater />
              {children}
            </SolanaProviders>
          </ChainGate>
        </WalletEnvProvider>
      </W3WConfigProvider>
    </WagmiProvider>
  )
}

const ChainGate = ({ children }: { children: ReactNode }) => {
  const isSwitching = useSyncPersistChain()

  if (isSwitching) {
    return <SpinnerPage />
  }

  return <>{children}</>
}

const Sync = () => {
  useBaseMiniAppAutoConnect()
  useSyncWagmiState()
  return null
}
