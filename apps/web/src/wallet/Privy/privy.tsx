'use client'

import { PropsWithChildren } from 'react'

// Privy removed - passthrough component for compatibility
export function PrivyProvider({ children }: PropsWithChildren) {
  return <>{children}</>
}
