import { Protocol } from 'routersdk18'
import { ChainId } from 'smartorderrouter18'

export const S3_POOL_CACHE_KEY = (baseKey: string, chain: ChainId, protocol: Protocol) =>
  `${baseKey}-${chain}-${protocol}`
