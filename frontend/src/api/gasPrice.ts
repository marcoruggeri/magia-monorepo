import { ethers } from 'ethers'
import { AppAPI } from '.'
import { AppStore } from '../stores/app'

interface Gases {
  // gasLimit: ethers.BigNumberish
  gasPrice: ethers.BigNumberish
}

export class GasPriceApi {
  constructor(private api: AppAPI, private store: AppStore) {}

  async getGasPrice(retry: boolean = true): Promise<Gases | undefined> {
    // attempts to fetch twice
    let price: Gases | undefined

    try {
      // fake error
      // if (retry) {
      //   throw new Error('forcing retry for gas price')
      // }

      price = await this.fetchGasPrice()
    } catch (e) {
      console.error('gasprice call failed, will try twice', e)
      if (retry) {
        // if we failed try again in half a second
        price = await new Promise((resolve) => {
          setTimeout(async () => {
            resolve(await this.getGasPrice(false))
          }, 500)
        })
      }
    }

    return price
  }

  fetchGasPrice = async () => {
    const res = await fetch('https://gasstation-mumbai.matic.today/v2')
    const data = await res.json()
    console.log('got data from gas station', data)

    return {
      gasPrice: Math.round(data.fast.maxFee) + 50,
      // gasLimit: data.fast.maxFee,
    }

    // return {
    //   gasPrice: ethers.utils.parseUnits(
    //     parseInt(data.fast.maxFee).toString(),
    //     'gwei'
    //   ),
    //   gasLimit: ethers.utils.parseUnits(
    //     parseInt(data.fast.maxFee).toString(),
    //     'gwei'
    //   ),
    // }
  }
}
