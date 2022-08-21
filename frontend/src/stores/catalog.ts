import { AppStore } from './app'
import { action, computed, makeObservable, observable } from 'mobx'
import { Magia } from 'magiaTypes'
import { unwrap } from '../util/unwrap'
import { Building, Spell, Tileset } from '../../enums'
import { ethers } from 'ethers'
import { buildingTypeToSprite } from '../lib/sprites/buildingTypeToSprite'
import { getSpellImage } from '../util/getSpellImage'
import { SpellImage } from '../components/ui/SpellImage'
import { PlatonicBuilding } from '../models/platonic/PlatonicBuilding'
import { PlatonicSpell } from '../models/platonic/PlatonicSpell'
import { PlatonicUnit } from '../models/platonic/PlatonicUnit'

export class CatalogStore {
  constructor(private store: AppStore) {
    makeObservable(this)
  }

  @observable initialised = false
  @action initDone() {
    this.initialised = true
  }

  // which can units be built?
  BARRACKS_UNIT_IDS = [1, 2, 8, 11]
  WORKSHOP_UNIT_IDS = [9]
  MAGE_TOWER_UNIT_IDS = [10]

  @observable buildings: PlatonicBuilding[] = []
  @observable spells: PlatonicSpell[] = []
  @observable units: PlatonicUnit[] = []

  get craftableUnitIds() {
    return [
      ...this.BARRACKS_UNIT_IDS,
      ...this.WORKSHOP_UNIT_IDS,
      ...this.MAGE_TOWER_UNIT_IDS,
    ]
  }

  @action loadBuildings(data: Magia.BuildingData[]) {
    this.buildings = []

    data.forEach((input) => {
      const building = new PlatonicBuilding(input)
      this.buildings.push(building)
    })
  }

  @computed get craftableUnits() {
    return this.units.filter((unit) => this.craftableUnitIds.includes(unit.id))
  }

  @action loadSpells(data: Magia.SpellData[]) {
    this.spells = []

    // spells don't come back with an ID but we always request the whole lot in order
    data.forEach((input, id) => {
      // id starts at 1
      const spell = new PlatonicSpell(input, id + 1)
      this.spells.push(spell)
    })
  }

  @action loadUnits(data: Magia.UnitCraftTypeWithId[]) {
    this.units = []

    data.forEach((input) => {
      const unit = new PlatonicUnit(input)
      this.units.push(unit)
    })
  }
}
