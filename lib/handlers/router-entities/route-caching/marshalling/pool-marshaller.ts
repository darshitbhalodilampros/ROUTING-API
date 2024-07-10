import { Pool } from 'lampros-v3'
import { FeeAmount } from 'lampros-v3/dist/constants'
import { MarshalledToken, TokenMarshaller } from './token-marshaller'
import { Protocol } from 'lampros-router'

export interface MarshalledPool {
  protocol: Protocol
  token0: MarshalledToken
  token1: MarshalledToken
  fee: FeeAmount
  sqrtRatioX96: string
  liquidity: string
  tickCurrent: number
}

export class PoolMarshaller {
  public static marshal(pool: Pool): MarshalledPool {
    return {
      protocol: Protocol.V3,
      token0: TokenMarshaller.marshal(pool.token0),
      token1: TokenMarshaller.marshal(pool.token1),
      fee: pool.fee,
      sqrtRatioX96: pool.sqrtRatioX96.toString(),
      liquidity: pool.sqrtRatioX96.toString(),
      tickCurrent: pool.tickCurrent,
    }
  }

  public static unmarshal(marshalledPool: MarshalledPool): Pool {
    return new Pool(
      TokenMarshaller.unmarshal(marshalledPool.token0),
      TokenMarshaller.unmarshal(marshalledPool.token1),
      marshalledPool.fee,
      marshalledPool.sqrtRatioX96,
      marshalledPool.liquidity,
      marshalledPool.tickCurrent
    )
  }
}
