import { formatUnits } from 'ethers/lib/utils'
import { computed } from 'mobx'
import { Building } from '../../../enums'
import { Magia } from '../../../magiaTypes'
import { buildingTypeToSprite } from '../../lib/sprites/buildingTypeToSprite'
import { unwrap } from '../../util/unwrap'

export class PlatonicBuilding {
  level: number
  buildingType: Building
  cost: { gold: number; lumber: number; mana: number }
  craftTime: number
  name: string
  id: number

  constructor(input: Magia.BuildingData) {
    this.level = unwrap.bigNumber(input.level)
    this.buildingType = input.buildingType._hex
    this.id = unwrap.bigNumber(input.buildingType)
    this.cost = {
      gold: parseInt(formatUnits(input.cost[0])),
      lumber: parseInt(formatUnits(input.cost[1])),
      mana: parseInt(formatUnits(input.cost[2])),
    }
    this.craftTime = unwrap.bigNumber(input.craftTime)
    this.name = input.name
  }

  @computed get sprite() {
    return buildingTypeToSprite(this.buildingType)
  }
}
