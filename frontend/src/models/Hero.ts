import {
  action,
  computed,
  makeObservable,
  observable,
  ObservableMap,
} from 'mobx'
import { $enum } from 'ts-enum-util'
import { MagicType } from '../../enums'
import { MagicStatsTuple } from '../../magiaTypes'
import { AppStore } from '../stores/app'
import { IChainHero } from '../types/chain/hero'
import { unwrap } from '../util/unwrap'

export class Hero {
  @observable name: string = ''

  // magicStats = new ObservableMap<MagicType, number>()
  magic = new MagicStatsStore()

  @computed get black() {
    return this.magic.get(MagicType.BLACK)
  }
  @computed get earth() {
    return this.magic.get(MagicType.EARTH)
  }
  @computed get fire() {
    return this.magic.get(MagicType.FIRE)
  }
  @computed get water() {
    return this.magic.get(MagicType.WATER)
  }
  @computed get white() {
    return this.magic.get(MagicType.WHITE)
  }

  getMagic(magic: MagicType) {
    return this.magic.get(magic)
  }

  @observable energy: number = 0
  @observable exp: number = 0
  @observable level: number = 0
  @computed get totalExp() {
    let totalExp = this.exp
    for (let i = this.level; i > 1; i--) {
      totalExp += (i - 1) * 1000
    }

    return totalExp
  }

  @observable id: number = -1

  constructor(
    private store: AppStore,
    public data: IChainHero,
    heroId: number
  ) {
    makeObservable(this)
    this.magic.set(MagicType.BLACK, unwrap.bigNumber(data.black))
    this.magic.set(MagicType.EARTH, unwrap.bigNumber(data.earth))
    this.magic.set(MagicType.FIRE, unwrap.bigNumber(data.fire))
    this.magic.set(MagicType.WHITE, unwrap.bigNumber(data.white))
    this.magic.set(MagicType.WATER, unwrap.bigNumber(data.water))

    this.energy = unwrap.bigNumber(data.energy)
    this.exp = unwrap.bigNumber(data.exp)
    this.level = unwrap.bigNumber(data.level)

    this.name = data.name
    this.id = heroId
  }

  @action setExp(n: number) {
    this.exp = unwrap.bigNumber(n)
  }

  @action loadMagicStats(input: MagicStatsTuple) {
    this.magic.set(MagicType.WHITE, input[0])
    this.magic.set(MagicType.BLACK, input[1])
    this.magic.set(MagicType.FIRE, input[2])
    this.magic.set(MagicType.WATER, input[3])
    this.magic.set(MagicType.EARTH, input[4])
  }
}

export class MagicStatsStore {
  magicStats = new ObservableMap<MagicType, number>()

  constructor(hero?: Hero) {
    makeObservable(this)
    $enum(MagicType).forEach((magic) =>
      this.magicStats.set(magic, hero?.getMagic(magic) || 0)
    )
  }

  @action loadMagicStats(input: MagicStatsTuple) {
    $enum(MagicType).forEach((magic, key, _, idx) =>
      this.magicStats.set(magic, input[idx])
    )
  }

  @computed get totalPoints() {
    return [...this.magicStats.values()].reduce((acc, val) => acc + val, 0)
  }

  @computed get tuple() {
    return [...$enum(MagicType).map((t) => this.magicStats.get(t))]
  }

  get(magic: MagicType) {
    // guaranteed to be set
    return this.magicStats.get(magic) as number
  }

  @action set(magic: MagicType, value: number) {
    return this.magicStats.set(magic, value)
  }
}
