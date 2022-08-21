import { AppStore } from './app'
import {
  action,
  computed,
  makeObservable,
  observable,
  ObservableMap,
} from 'mobx'
import { Hero } from '../models/Hero'

import { BigNumberish } from 'ethers'
import { Building, Spell } from '../../enums'
import { unwrap } from '../util/unwrap'

export class PlayerStore {
  @observable gold: number = 0
  @observable lumber: number = 0
  @observable mana: number = 0
  @observable energy: number = 0
  @observable claimableEnergy: number = 0

  @observable buildingQtys = new ObservableMap<Building, number>()

  @observable spellQtys = new ObservableMap<Spell, number>()
  @observable unitTypeIds: number[] = []

  // spells.idx = spell type
  // spells.idx.val = # in inv
  // @observable spells: number[] = []

  @observable heroId?: number

  @computed get hero() {
    return this.heroId ? this.store.hero.byId.get(this.heroId) : undefined
  }

  @action setHero = (hero: Hero) => {
    console.log('setting', hero)

    this.heroId = hero.id
  }

  constructor(private store: AppStore) {
    makeObservable(this)
  }

  @computed get units() {
    return [...this.store.unit.all].filter((u) =>
      this.unitTypeIds.includes(u.id)
    )
  }

  @computed get buildings() {
    return [...this.buildingQtys.entries()]
  }

  // which buildings does the player have that can be deployed on the land that is selected?
  @computed get deployableBuildings() {
    const { selected } = this.store.land
    // must have some land selected
    if (!selected) {
      return []
    }

    return this.buildings.filter(
      ([building, qty]) => qty > 0 && selected.canBuild(building)
    )
  }

  @computed get spells() {
    return [...this.spellQtys.entries()]
  }

  @action setGold(n: number) {
    this.gold = n
  }
  @action setLumber(n: number) {
    this.lumber = n
  }
  @action setMana(n: number) {
    this.mana = n
  }
  @action setEnergy(n: number) {
    this.energy = n
  }
  @action setClaimableEnergy(n: number) {
    this.claimableEnergy = n
  }

  @action setBuildings(arr: BigNumberish[]) {
    arr.forEach((qty, idx) => {
      // id is 1 based
      const id = idx + 1
      this.buildingQtys.set(Object.values(Building)[id], unwrap.bigNumber(qty))
    })
  }

  @action setSpells(arr: BigNumberish[], ids: number[]) {
    arr.forEach((qty, idx) => {
      this.spellQtys.set(Object.values(Spell)[ids[idx]], unwrap.bigNumber(qty))
    })
  }
  @action setUnits(arr: number[]) {
    this.unitTypeIds = arr
  }
  // @action setSpells(arr: number[]) {
  //   this.spells = arr
  // }

  // does this player have units with an active shield?
  @computed get hasShieldActive() {
    return this.store.land.ownUnits.some((u) => u.hasShield)
  }

  @computed get ownShieldedUnits() {
    return this.store.land.ownUnits.filter((u) => u.hasShield)
  }

  @computed get totalUnitsShielded() {
    return this.ownShieldedUnits.length
  }

  @computed get ownBarracks() {
    return this.store.land.ownLand.find((l) => l.hasBarracks)
  }

  @computed get hasBarracks() {
    return !!this.ownBarracks
  }

  @computed get ownMageTower() {
    return this.store.land.ownLand.find((l) => l.hasMagetower)
  }
  @computed get hasMageTower() {
    return !!this.ownMageTower
  }

  @computed get ownWorkshop() {
    return this.store.land.ownLand.find((l) => l.hasWorkshop)
  }
  @computed get hasWorkshop() {
    return !!this.ownWorkshop
  }

  canBuildUnit(unitId: number) {
    const { BARRACKS_UNIT_IDS, WORKSHOP_UNIT_IDS, MAGE_TOWER_UNIT_IDS } =
      this.store.catalog

    if (BARRACKS_UNIT_IDS.includes(unitId)) {
      return this.hasBarracks ? true : 'Need Barracks'
    } else if (WORKSHOP_UNIT_IDS.includes(unitId)) {
      return this.hasWorkshop ? true : 'Need Workshop'
    } else if (MAGE_TOWER_UNIT_IDS.includes(unitId)) {
      return this.hasMageTower ? true : 'Need Mage Tower'
    }
    return false
  }
}
