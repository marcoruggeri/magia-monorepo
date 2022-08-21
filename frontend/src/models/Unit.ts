import { action, computed, makeObservable, observable } from 'mobx'
import { AppStore } from '../stores/app'
import { IChainUnitWithID } from '../types/chain/unit'
import { formatTimeDelta } from '../util/formatTimeDelta'
import { unwrap } from '../util/unwrap'
import { now } from 'mobx-utils'

export class Unit {
  @observable id: number
  @observable attack: number
  @observable defense: number
  @observable health: number
  @observable name: string
  @observable range: number
  @observable unitType: number
  @observable shieldExpiry: number

  image?: Phaser.GameObjects.Image
  @computed get tile() {
    return this.store.land.all.find((l) => l.unitTokenId === this.id)
  }

  @computed get shieldActive() {
    return this.shieldExpiry > now() / 1000
  }

  @computed get shieldRemaining() {
    return this.shieldActive
      ? formatTimeDelta(this.shieldExpiry - now() / 1000)
      : false
  }

  @action setShieldExpiry = (time: number) => {
    this.shieldExpiry = time
  }

  constructor(private store: AppStore, unit: IChainUnitWithID) {
    this.id = unit.id
    this.attack = unwrap.bigNumber(unit.attack)
    this.defense = unwrap.bigNumber(unit.defense)
    this.health = unwrap.bigNumber(unit.health)
    this.name = unit.name
    this.range = unwrap.bigNumber(unit.range)
    this.unitType = unwrap.bigNumber(unit.unitType)
    this.shieldExpiry = unit.shieldExpiry
      ? unwrap.bigNumber(unit.shieldExpiry)
      : 0

    makeObservable(this)
  }
}
