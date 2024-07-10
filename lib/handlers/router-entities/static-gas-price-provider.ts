import { GasPrice, IGasPriceProvider } from 'smartorderrouter18'
import { BigNumber } from 'ethers'

export class StaticGasPriceProvider implements IGasPriceProvider {
  constructor(private gasPriceWei: BigNumber) { }
  async getGasPrice(): Promise<GasPrice> {
    return { gasPriceWei: this.gasPriceWei }
  }
}
