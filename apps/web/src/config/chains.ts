import { ChainId, chainNames } from '@pancakeswap/chains'
import memoize from '@pancakeswap/utils/memoize'
import { Chain } from 'wagmi/chains'

export const CHAIN_QUERY_NAME = chainNames

const CHAIN_QUERY_NAME_TO_ID = Object.entries(CHAIN_QUERY_NAME).reduce((acc, [chainId, chainName]) => {
  return {
    [chainName.toLowerCase()]: chainId as unknown as ChainId,
    ...acc,
  }
}, {} as Record<string, ChainId>)

export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined
  return CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] ? +CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] : undefined
})

const elo: Chain = {
  id: ChainId.ELO,
  name: 'ELO',
  nativeCurrency: { name: 'ELO', symbol: 'ELO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.elochain.org'] },
    public: { http: ['https://rpc.elochain.org'] },
  },
  blockExplorers: {
    default: {
      name: 'ELO Explorer',
      url: 'https://eloblocks.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0x0065a282ad20D3EA71035503bbd5F6c2205f7a42',
    },
  },
  testnet: false,
}

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS: ChainId[] = [ChainId.ELO]

export const CHAINS: [Chain, ...Chain[]] = [elo]

// Stub for code that still references Solana
export const SOLANA_CHAIN = {
  id: 0,
  blockExplorers: {
    default: { name: 'Solscan', url: 'https://solscan.io' },
  },
} as const
