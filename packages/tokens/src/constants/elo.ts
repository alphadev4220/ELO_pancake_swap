import { ChainId } from '@pancakeswap/chains'
import { ERC20Token, WETH9 } from '@pancakeswap/sdk'

export const eloTokens = {
  welo: WETH9[ChainId.ELO],
  eusdt: new ERC20Token(
    ChainId.ELO,
    '0x0534eD51D85c8a46C51CfA708373DcB1DBd2fbFf',
    6,
    'EUSDT',
    'ELO USDT',
  ),
}
