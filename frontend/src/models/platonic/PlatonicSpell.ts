import { formatUnits } from 'ethers/lib/utils'
import { computed } from 'mobx'
import { Spell } from '../../../enums'
import { Magia } from '../../../magiaTypes'
import { getSpellImage } from '../../util/getSpellImage'
import { unwrap } from '../../util/unwrap'

export class PlatonicSpell {
  craftTime: number
  magicReqs: number[]
  cost: { gold: number; lumber: number; mana: number }
  id: number
  name: string

  constructor(input: Magia.SpellData, id: number) {
    this.craftTime = unwrap.bigNumber(input.craftTime)
    this.magicReqs = input.magicReqs.map((n) => unwrap.bigNumber(n))
    this.cost = {
      gold: parseInt(formatUnits(input.cost[0])),
      lumber: parseInt(formatUnits(input.cost[1])),
      mana: parseInt(formatUnits(input.cost[2])),
    }
    this.id = id
    this.name = input.name
  }

  @computed get sprite() {
    return getSpellImage(Object.values(Spell)[this.id])
  }
}
