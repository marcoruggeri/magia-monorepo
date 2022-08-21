import { $enum } from 'ts-enum-util'
import { UnitType } from '../../enums'
import { Magia } from '../../magiaTypes'
import { MagiaAPI } from './MagiaApi'

export class CatalogApi extends MagiaAPI {
  async fetchBuildings() {
    const buildings = this.store.contract.use('buildings')
    const data = await buildings.getBatchBuildings()
    this.store.catalog.loadBuildings(data)
    return data
  }

  async fetchUnits() {
    const knownTypeIds = $enum(UnitType).getValues()
    const contract = this.store.contract.useSigned('units')

    const units = await Promise.all(
      knownTypeIds.map(async (id) => {
        const { res } = await contract.getUnitType(id)
        const data = { ...res, id }
        return data as Magia.UnitCraftTypeWithId
      })
    )

    console.log(units)

    this.store.catalog.loadUnits(units)
  }

  async fetchSpells() {
    const spells = this.store.contract.use('spells')
    const data = await spells.getBatchSpells()
    this.store.catalog.loadSpells(data)
    console.log(data)

    return data
  }
}
