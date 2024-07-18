import { V3Route } from 'lampros-sor/build/main/routers'
import { Protocol } from 'lampros-router'
import { MarshalledToken, TokenMarshaller } from './token-marshaller'
import { MarshalledPool, PoolMarshaller } from './pool-marshaller'
import { Pool } from 'lampros-v3'

export interface MarshalledV3Route {
  protocol: Protocol
  input: MarshalledToken
  output: MarshalledToken
  pools: MarshalledPool[]
}

export type MarshalledRoute = MarshalledV3Route

export class RouteMarshaller {
  public static marshal(route: V3Route): MarshalledRoute {
    switch (route.protocol) {
      case Protocol.V3:
        return {
          protocol: Protocol.V3,
          input: TokenMarshaller.marshal(route.input),
          output: TokenMarshaller.marshal(route.output),
          pools: route.pools.map((pool: Pool) => PoolMarshaller.marshal(pool)),
        }

      default:
        throw new Error(`Unsupported protocol: ${route.protocol}`);
    }
  }

  public static unmarshal(marshalledRoute: MarshalledRoute): V3Route {
    switch (marshalledRoute.protocol) {
      case Protocol.V3:
        const v3Route = marshalledRoute as MarshalledV3Route
        return new V3Route(
          v3Route.pools.map((marshalledPool) => PoolMarshaller.unmarshal(marshalledPool)),
          TokenMarshaller.unmarshal(v3Route.input),
          TokenMarshaller.unmarshal(v3Route.output)
        )
    }
  }
}
