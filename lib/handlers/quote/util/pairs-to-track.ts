import { TradeType } from 'lampros-core'
import { ChainId } from 'lampros-sor'

export const PAIRS_TO_TRACK: Map<ChainId, Map<TradeType, string[]>> = new Map([
  [ChainId.MODE, new Map([[TradeType.EXACT_INPUT, ['WETH/USDC', 'USDC/WETH']]])],
])
