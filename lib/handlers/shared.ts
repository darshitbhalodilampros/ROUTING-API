import { Currency, CurrencyAmount, Percent } from 'lampros-core'
import {
  AlphaRouterConfig,
  ChainId,
  ITokenListProvider,
  ITokenProvider,
  // MapWithLowerCaseKey,
  NATIVE_NAMES_BY_ID,
  nativeOnChain,
} from 'lampros-sor'
import Logger from 'bunyan'
import { FeeOptions } from 'lampros-v3'
import { FlatFeeOptions } from 'lampros-universal'

export const DEFAULT_ROUTING_CONFIG_BY_CHAIN = (chainId: ChainId): AlphaRouterConfig => {
  switch (chainId) {
    default:
      return {
        v2PoolSelection: {
          topN: 3,
          topNDirectSwaps: 1,
          topNTokenInOut: 5,
          topNSecondHop: 2,
          topNWithEachBaseToken: 2,
          topNWithBaseToken: 6,
        },
        v3PoolSelection: {
          topN: 2,
          topNDirectSwaps: 2,
          topNTokenInOut: 2,
          topNSecondHop: 1,
          topNWithEachBaseToken: 3,
          topNWithBaseToken: 3,
        },
        maxSwapsPerPath: 3,
        minSplits: 1,
        maxSplits: 7,
        distributionPercent: 10,
        forceCrossProtocol: false,
      }
    // // Arbitrum calls have lower gas limits and tend to timeout more, which causes us to reduce the multicall
    // // batch size and send more multicalls per quote. To reduce the amount of requests each quote sends, we
    // // have to adjust the routing config so we explore fewer routes.
    // case ChainId.ARBITRUM_ONE:
    // case ChainId.ARBITRUM_RINKEBY:
    //   return {
    //     v2PoolSelection: {
    //       topN: 3,
    //       topNDirectSwaps: 1,
    //       topNTokenInOut: 5,
    //       topNSecondHop: 2,
    //       topNWithEachBaseToken: 2,
    //       topNWithBaseToken: 6,
    //     },
    //     v3PoolSelection: {
    //       topN: 2,
    //       topNDirectSwaps: 2,
    //       topNTokenInOut: 2,
    //       topNSecondHop: 1,
    //       topNWithEachBaseToken: 3,
    //       topNWithBaseToken: 2,
    //     },
    //     maxSwapsPerPath: 2,
    //     minSplits: 1,
    //     maxSplits: 7,
    //     distributionPercent: 25,
    //     forceCrossProtocol: false,
    //   }
    // default:
    //   return {
    //     v2PoolSelection: {
    //       topN: 3,
    //       topNDirectSwaps: 1,
    //       topNTokenInOut: 5,
    //       topNSecondHop: 2,
    //       topNWithEachBaseToken: 2,
    //       topNWithBaseToken: 6,
    //     },
    //     v3PoolSelection: {
    //       topN: 2,
    //       topNDirectSwaps: 2,
    //       topNTokenInOut: 3,
    //       topNSecondHop: 1,
    //       topNSecondHopForTokenAddress: new MapWithLowerCaseKey<number>([
    //         ['0x5f98805a4e8be255a32880fdec7f6728c6568ba0', 2], // LUSD
    //       ]),
    //       topNWithEachBaseToken: 3,
    //       topNWithBaseToken: 5,
    //     },
    //     maxSwapsPerPath: 3,
    //     minSplits: 1,
    //     maxSplits: 7,
    //     distributionPercent: 5,
    //     forceCrossProtocol: false,
    //   }
  }
}

export type FeeOnTransferSpecificConfig = {
  enableFeeOnTransferFeeFetching?: boolean
}

export const FEE_ON_TRANSFER_SPECIFIC_CONFIG = (
  enableFeeOnTransferFeeFetching?: boolean
): FeeOnTransferSpecificConfig => {
  return {
    enableFeeOnTransferFeeFetching: enableFeeOnTransferFeeFetching,
  } as FeeOnTransferSpecificConfig
}

export function parsePortionPercent(portionBips: number): Percent {
  return new Percent(portionBips, 10_000)
}

export function parseFeeOptions(portionBips?: number, portionRecipient?: string): FeeOptions | undefined {
  if (!portionBips || !portionRecipient) {
    return undefined
  }

  return { fee: parsePortionPercent(portionBips), recipient: portionRecipient } as FeeOptions
}

export function parseFlatFeeOptions(portionAmount?: string, portionRecipient?: string): FlatFeeOptions | undefined {
  if (!portionAmount || !portionRecipient) {
    return undefined
  }

  return { amount: portionAmount, recipient: portionRecipient } as FlatFeeOptions
}

export type AllFeeOptions = {
  fee?: FeeOptions
  flatFee?: FlatFeeOptions
}

export function populateFeeOptions(
  type: string,
  portionBips?: number,
  portionRecipient?: string,
  portionAmount?: string
): AllFeeOptions | undefined {
  switch (type) {
    case 'exactIn':
      const feeOptions = parseFeeOptions(portionBips, portionRecipient)
      return { fee: feeOptions }
    case 'exactOut':
      const flatFeeOptions = parseFlatFeeOptions(portionAmount, portionRecipient)
      return { flatFee: flatFeeOptions }
    default:
      return undefined
  }
}

export function computePortionAmount(currencyOut: CurrencyAmount<Currency>, portionBips?: number): string | undefined {
  if (!portionBips) {
    return undefined
  }

  return currencyOut.multiply(parsePortionPercent(portionBips)).quotient.toString()
}

export async function tokenStringToCurrency(
  tokenListProvider: ITokenListProvider,
  tokenProvider: ITokenProvider,
  tokenRaw: string,
  chainId: ChainId,
  log: Logger
): Promise<Currency | undefined> {
  const isAddress = (s: string) => s.length == 42 && s.startsWith('0x')

  let token: Currency | undefined = undefined

  if (NATIVE_NAMES_BY_ID[chainId]!.includes(tokenRaw)) {
    token = nativeOnChain(chainId)
  } else if (isAddress(tokenRaw)) {
    token = await tokenListProvider.getTokenByAddress(tokenRaw)
  }

  if (!token) {
    token = await tokenListProvider.getTokenBySymbol(tokenRaw)
  }

  if (token) {
    log.info(
      {
        tokenAddress: token.wrapped.address,
      },
      `Got input token from token list`
    )
    return token
  }

  log.info(`Getting input token ${tokenRaw} from chain`)
  if (!token && isAddress(tokenRaw)) {
    const tokenAccessor = await tokenProvider.getTokens([tokenRaw])
    return tokenAccessor.getTokenByAddress(tokenRaw)
  }

  return undefined
}

export function parseSlippageTolerance(slippageTolerance: string): Percent {
  const slippagePer10k = Math.round(parseFloat(slippageTolerance) * 100)
  return new Percent(slippagePer10k, 10_000)
}

export function parseDeadline(deadline: string): number {
  return Math.floor(Date.now() / 1000) + parseInt(deadline)
}
