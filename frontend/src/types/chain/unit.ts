// used because we have an array of IDs first

import { ethers } from 'ethers'

// that we use to request units data
export interface IChainUnitWithID extends IChainUnit {
  id: number
  shieldExpiry: number
}

export interface IChainUnit {
  attack: ethers.BigNumberish
  defense: ethers.BigNumberish
  health: ethers.BigNumberish
  name: string
  range: ethers.BigNumberish
  unitType: ethers.BigNumberish
}
