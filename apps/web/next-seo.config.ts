import { ASSET_CDN } from 'config/constants/endpoints'
import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | Eloswap',
  defaultTitle: 'Eloswap',
  description: 'Trade, earn, and own crypto on the all-in-one DEX on ELO',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@Eloswap',
    site: '@Eloswap',
  },
  openGraph: {
    title: 'Eloswap - DEX on ELO Chain',
    description: 'Trade, earn, and own crypto on the all-in-one DEX on ELO',
    images: [{ url: `${ASSET_CDN}/web/og/v2/hero.jpg` }],
  },
}
