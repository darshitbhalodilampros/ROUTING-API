import {
  constructSameBatchParamsMap,
  constructSameBlockNumberConfigsMap,
  constructSameGasErrorFailureOverridesMap,
  constructSameRetryOptionsMap,
  constructSameSuccessRateFailureOverridesMap,
  DEFAULT_BATCH_PARAMS,
  DEFAULT_BLOCK_NUMBER_CONFIGS,
  DEFAULT_GAS_ERROR_FAILURE_OVERRIDES,
  DEFAULT_RETRY_OPTIONS,
  DEFAULT_SUCCESS_RATE_FAILURE_OVERRIDES,
} from 'lampros-sor/build/main/util/onchainQuoteProviderConfigs'
import { ChainId } from 'lampros-core'
import AsyncRetry from 'async-retry'
import { AddressMap, BatchParams, BlockNumberConfig, FailureOverrides } from 'lampros-sor'

export const RETRY_OPTIONS: { [chainId: number]: AsyncRetry.Options | undefined } = {
  ...constructSameRetryOptionsMap(DEFAULT_RETRY_OPTIONS),
  [ChainId.MODE]: {
    retries: 2,
    minTimeout: 100,
    maxTimeout: 1000,
  },
}

export const BATCH_PARAMS: { [chainId: number]: BatchParams } = {
  ...constructSameBatchParamsMap(DEFAULT_BATCH_PARAMS),

  [ChainId.MODE]: {
    multicallChunk: 110,
    gasLimitPerCall: 1_200_000,
    quoteMinSuccessRate: 0.1,
  },
}

export const GAS_ERROR_FAILURE_OVERRIDES: { [chainId: number]: FailureOverrides } = {
  ...constructSameGasErrorFailureOverridesMap(DEFAULT_GAS_ERROR_FAILURE_OVERRIDES),
  [ChainId.MODE]: {
    gasLimitOverride: 3_000_000,
    multicallChunk: 45,
  },
}

export const SUCCESS_RATE_FAILURE_OVERRIDES: { [chainId: number]: FailureOverrides } = {
  ...constructSameSuccessRateFailureOverridesMap(DEFAULT_SUCCESS_RATE_FAILURE_OVERRIDES),
  [ChainId.MODE]: {
    gasLimitOverride: 3_000_000,
    multicallChunk: 45,
  },
}

export const BLOCK_NUMBER_CONFIGS: { [chainId: number]: BlockNumberConfig } = {
  ...constructSameBlockNumberConfigsMap(DEFAULT_BLOCK_NUMBER_CONFIGS),
  [ChainId.MODE]: {
    baseBlockOffset: -25,
    rollback: {
      enabled: true,
      attemptsBeforeRollback: 1,
      rollbackBlockOffset: -20,
    },
  },
}

// block -1 means it's never deployed
export const NEW_QUOTER_DEPLOY_BLOCK: { [chainId in ChainId]: number } = {
  [ChainId.MODE]: -1,
}

// 0 threshold means it's not deployed yet
export const LIKELY_OUT_OF_GAS_THRESHOLD: { [chainId in ChainId]: number } = {
  [ChainId.MODE]: 0,
}

// TODO: Move this new addresses to SOR
export const NEW_MIXED_ROUTE_QUOTER_V1_ADDRESSES: AddressMap = {
}
