import { TradeType } from 'sdkcore18'
import { ChainId } from 'smartorderrouter18'

export const PAIRS_TO_TRACK: Map<ChainId, Map<TradeType, string[]>> = new Map([
  [ChainId.MODE, new Map([[TradeType.EXACT_INPUT, ['WETH/USDC', 'USDC/WETH']]])],
])
