import { ethers } from 'ethers'
import { Building } from '../../../enums'
import { unwrap } from '../../util/unwrap'
import { HexObject } from './hexObject'

let flag = false

export interface IChainLand {
  0: ethers.BigNumberish
  // heroId: HexObject
  1: ethers.BigNumberish
  // coordinateX: HexObject
  2: ethers.BigNumberish
  // coordinateY: HexObject
  3: ethers.BigNumberish
  // unitTokenId: HexObject
  4: ethers.BigNumberish
  // gold: HexObject
  5: ethers.BigNumberish
  // lumber: HexObject
  6: ethers.BigNumberish
  // mana: HexObject
  7: ethers.BigNumberish
  // building: HexObject
}

export class ChainLand {
  heroId: number
  coordinateX: number
  coordinateY: number
  unitTokenId: number
  gold: number
  lumber: number
  mana: number
  building: Building

  constructor(input: IChainLand) {
    this.heroId = unwrap.bigNumber(input[0])
    this.coordinateX = unwrap.bigNumber(input[1])
    this.coordinateY = unwrap.bigNumber(input[2])
    this.unitTokenId = unwrap.bigNumber(input[3])
    this.gold = unwrap.bigNumber(input[4])
    this.lumber = unwrap.bigNumber(input[5])
    this.mana = unwrap.bigNumber(input[6])

    // TODO: we should be able to auto assign this but ts is not happy with picking Building[7._hex]
    switch ((input[7] as HexObject)._hex) {
      case '0x01':
        this.building = Building.GOLDMINE
        break
      case '0x02':
        this.building = Building.LUMBERMILL
        break
      case '0x03':
        this.building = Building.MANASHRINE
        break
      case '0x04':
        this.building = Building.BARRACKS
        break
      case '0x05':
        this.building = Building.WORKSHOP
        break
      case '0x06':
        this.building = Building.MAGE_TOWER
        break

      default:
        this.building = Building.NONE
        break
    }

    // this.building = Building[(input[7] as HexObject)._hex]
  }
}
