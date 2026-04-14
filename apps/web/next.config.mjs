import path from 'path'
import { fileURLToPath } from 'url'
/* eslint-disable @typescript-eslint/no-var-requires */
import BundleAnalyzer from '@next/bundle-analyzer'
import { withWebSecurityHeaders } from '@pancakeswap/next-config/withWebSecurityHeaders'
import smartRouterPkgs from '@pancakeswap/smart-router/package.json' with { type: 'json' }
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const withVanillaExtract = createVanillaExtractPlugin()

const isProd = process.env.VERCEL_ENV === 'production' || 
  process.env.NODE_ENV === 'production' || 
  process.env.VERCEL_ENV === 'preview'



const workerDeps = Object.keys(smartRouterPkgs.dependencies)
  .map((d) => d.replace('@pancakeswap/', 'packages/'))
  .concat(['/packages/smart-router/', '/packages/swap-sdk/', '/packages/token-lists/'])

const prodTranspiles = [
    'next-typesafe-url',
    '@pancakeswap/farms',
    '@pancakeswap/localization',
    '@pancakeswap/hooks',
    '@pancakeswap/utils',
    '@pancakeswap/widgets-internal',
    '@pancakeswap/ifos',
    '@pancakeswap/uikit'
  ]

const basicTranspiles = [
  'next-typesafe-url',
  '@pancakeswap/localization', 
]
/** @type {import('next').NextConfig} */
const config = {
  typescript: {
    tsconfigPath: 'tsconfig.json',
    ignoreBuildErrors: true
  },
  compiler: {
    styledComponents: true,
  },
  experimental: {
    scrollRestoration: true,
    fallbackNodePolyfills: false,
    optimizePackageImports: ['@pancakeswap/widgets-internal', '@pancakeswap/uikit'],
    // Allow Next.js to handle CJS packages that depend on ESM modules
    // without throwing `import-esm-externals` errors
    esmExternals: 'loose',
    webpackBuildWorker: false,
  },
  bundlePagesRouterDependencies:  isProd,
  outputFileTracingRoot: path.join(__dirname, '../../'),
  outputFileTracingExcludes: {
    '*': [],
  },
  transpilePackages: isProd ? prodTranspiles: basicTranspiles,
  reactStrictMode: isProd,
  images: {
    contentDispositionType: 'attachment',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static-nft.pancakeswap.com',
        pathname: '/mainnet/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.pancakeswap.finance',
        pathname: '/web/**',
      },
      {
        protocol: 'https',
        hostname: 'tokens.pancakeswap.finance',
        pathname: '/web/**',
      }
    ],
  },
  async rewrites() {
    return {
      afterFiles: [
        {
          source: '/info/token/:address',
          destination: '/info/tokens/:address',
        },
        {
          source: '/info/pool/:address',
          destination: '/info/pools/:address',
        },
      ],
    }
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
      {
        source: '/logo.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
      {
        source: '/images/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
      {
        source: '/images/tokens/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=604800',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/send',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/create/:currency*',
        destination: '/add/:currency*',
        permanent: true,
      },
      {
        source: '/pool',
        destination: '/liquidity',
        permanent: true,
      },
    ]
  },
  webpack: (webpackConfig, { webpack, isServer }) => {
    webpackConfig.resolve = webpackConfig.resolve || {}
    webpackConfig.resolve.alias = webpackConfig.resolve.alias || {}
    webpackConfig.resolve.alias['@solana/wallet-adapter-react'] = path.resolve(
      __dirname,
      'node_modules',
      '@solana/wallet-adapter-react'
    )
    webpackConfig.infrastructureLogging = {
      level: 'info', // or 'verbose' for more detail
    };
    if (!isServer && webpackConfig.optimization.splitChunks) {
      // webpack doesn't understand worker deps on quote worker, so we need to manually add them
      // https://github.com/webpack/webpack/issues/16895
      // eslint-disable-next-line no-param-reassign
      webpackConfig.optimization.splitChunks.cacheGroups.workerChunks = {
        chunks: 'async',
        maxInitialRequests: 10,
        minSize: 100_000, // 100kb
        test(module) {
          const resource = module.nameForCondition?.() ?? ''
          return resource ? workerDeps.some((d) => resource.includes(d)) : false
        },
        priority: 31,
        name: 'worker-chunks',
        reuseExistingChunk: true,
      }
    }

    return webpackConfig
  },
}

const withTooling = (cfg) =>
  withWebSecurityHeaders(
    withBundleAnalyzer(
      withVanillaExtract(cfg)
    )
  )

export default withTooling(config)

