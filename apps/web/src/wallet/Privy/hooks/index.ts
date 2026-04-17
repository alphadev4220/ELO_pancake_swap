// Privy removed - stub exports for compatibility
export const useEmbeddedSmartAccountConnectorV2 = () => ({
  isSmartWalletReady: false,
  isSettingUp: false,
  shouldUseAAWallet: false,
  hasSetupFailed: false,
})

export const usePrivyWalletAddress = () => ({
  address: undefined as string | undefined,
  isLoading: false,
  addressType: null as 'embedded' | 'smart' | null,
  hasSetupFailed: false,
})
