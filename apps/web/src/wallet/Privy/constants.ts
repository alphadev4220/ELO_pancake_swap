import { NonEVMChainId, UnifiedChainId } from '@pancakeswap/chains'
import { FirebaseApp, initializeApp } from 'firebase/app'

const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const firebaseAppId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID

// Initialize Firebase only when credentials are configured
export const firebaseApp: FirebaseApp | undefined =
  firebaseApiKey && firebaseAppId
    ? initializeApp({
        apiKey: firebaseApiKey,
        authDomain: 'pancakeswap-prod-firebase.firebaseapp.com',
        projectId: 'pancakeswap-prod-firebase',
        storageBucket: 'pancakeswap-prod-firebase.firebasestorage.app',
        messagingSenderId: '901250967709',
        appId: firebaseAppId,
      })
    : undefined

export const UNSUPPORTED_SOCIAL_LOGIC_CHAINS: UnifiedChainId[] = [NonEVMChainId.SOLANA, NonEVMChainId.APTOS]
