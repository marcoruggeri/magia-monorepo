import { formatUnits } from 'ethers/lib/utils'
import { Magia } from '../../../magiaTypes'
import { unwrap } from '../../util/unwrap'

export class PlatonicUnit {
  craftTime: number
  cost: { gold: number; lumber: number; mana: number }
  name: string
  id: number // unitType
  attack: number
  defense: number
  health: number
  range: number

  constructor(input: Magia.UnitCraftTypeWithId) {
    this.craftTime = unwrap.bigNumber(input.craftTime)
    this.cost = {
      gold: parseInt(formatUnits(input.cost[0])),
      lumber: parseInt(formatUnits(input.cost[1])),
      mana: parseInt(formatUnits(input.cost[2])),
    }
    this.name = input.name
    this.id = input.id
    this.attack = parseInt(formatUnits(input.attack))
    this.defense = parseInt(formatUnits(input.defense))
    this.health = parseInt(formatUnits(input.health))
    this.range = parseInt(formatUnits(input.range))
  }
}
