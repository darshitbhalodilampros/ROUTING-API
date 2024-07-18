import { Protocol } from 'lampros-router'
import { V3SubgraphProvider } from 'lampros-sor'
import { ChainId } from 'lampros-core'

export const chainProtocols = [
  {
    protocol: Protocol.V3,
    chainId: ChainId.MODE,
    timeout: 90000,
    provider: new V3SubgraphProvider(ChainId.MODE, 3, 90000),
  },
]
