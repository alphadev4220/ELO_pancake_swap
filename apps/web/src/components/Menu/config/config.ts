import { UnifiedChainId } from '@pancakeswap/chains'
import { ContextApi } from '@pancakeswap/localization'
import {
  DropdownMenuItems,
  DropdownMenuItemType,
  EarnFillIcon,
  EarnIcon,
  MenuItemsType,
  MoreIcon,
  SwapFillIcon,
  SwapIcon,
} from '@pancakeswap/uikit'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & {
  hideSubNav?: boolean
  overrideSubNavItems?: ConfigMenuDropDownItemsType[]
  matchHrefs?: string[]
  isHot?: boolean
  supportChainIds?: readonly UnifiedChainId[]
}

export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & {
  hideSubNav?: boolean
  image?: string
  items?: ConfigMenuDropDownItemsType[]
  overrideSubNavItems?: ConfigMenuDropDownItemsType[]
  type?: DropdownMenuItemType
  isHot?: boolean
  confirmModalId?: string
  supportChainIds?: readonly UnifiedChainId[]
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t) => [
  {
    label: t('Trade'),
    icon: SwapIcon,
    fillIcon: SwapFillIcon,
    href: '/swap',
    hideSubNav: true,
    items: [
      {
        label: t('Swap'),
        href: '/swap',
      },
    ],
  },
  {
    label: t('Earn.verb'),
    href: '/liquidity/pools',
    icon: EarnIcon,
    fillIcon: EarnFillIcon,
    items: [
      {
        label: t('Farm / Liquidity'),
        href: '/liquidity/pools',
        matchHrefs: ['/liquidity/positions'],
      },
    ],
  },
  {
    label: '',
    href: '/info',
    icon: MoreIcon,
    hideSubNav: true,
    items: [
      {
        label: t('Info.section_title'),
        href: '/info/v3',
      },
    ],
  },
]

export default config
