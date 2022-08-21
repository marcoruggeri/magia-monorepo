import { BaseContract, ContractFunction, ethers } from 'ethers'

// export type WrappedContract = {
//   readonly [key: string]: ContractFunction | any
// }

// type Mutable = {
//   -readonly [K in keyof ethers.Contract]: ethers.Contract[K]
// }

export type WrappedContract = {
  ethersContract: ethers.Contract
  [key: string]: ContractFunction | any
}

export const wrapContract = (contract: ethers.Contract) => {
  const wrappedContract: WrappedContract = {
    ethersContract: Object.assign(Object.create(contract)),
  }
  // const wrappedContract: WrappedContract = {
  //   ethersContract: contract,
  // }

  for (let key in contract.functions) {
    wrappedContract[key] = async (...args: any[]) => {
      console.log('wrapped call of', key)
      let res: any
      try {
        res = await wrappedContract.ethersContract[key](...args)
      } catch (e) {
        //   console.log('caught', e)
      }

      return res
    }
  }

  return wrappedContract
}
