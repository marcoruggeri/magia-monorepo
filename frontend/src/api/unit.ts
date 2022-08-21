import { AppAPI } from '.'
import { Magia } from '../../magiaTypes'
import { PlatonicUnit } from '../models/platonic/PlatonicUnit'

import { AppStore } from '../stores/app'

import { IChainUnit, IChainUnitWithID } from '../types/chain/unit'
import { MagiaAPI } from './MagiaApi'

export class UnitApi extends MagiaAPI {
  async getBatchByIds(ids: number[]) {
    if (!ids || !ids.length) {
      return
    }

    const unitsContract = this.store.contract.use('units')
    const diamond = this.store.contract.diamond

    // can only request 500 at a time
    const batchSize = 500
    // how many trips will we need?
    const totalRequests = Math.ceil(ids.length / batchSize)
    // how many have we done?
    let requestsMade = 0

    while (requestsMade < totalRequests) {
      const start = requestsMade * batchSize
      const end = start + batchSize

      const requestIds = ids.slice(start, end)
      const unitsChainData = await unitsContract.getBatchUnitsType(requestIds)
      const { res: shieldData } = await diamond.getBatchUnitShieldEndTimestamp(
        requestIds
      )

      // loop ids and save the corresponding unit
      const unitsWithIDs = requestIds.map((id: number, idx: number) => {
        const u = unitsChainData[idx] as IChainUnit

        return { ...u, id, shieldExpiry: shieldData[idx] } as IChainUnitWithID
      })

      this.store.unit.load(unitsWithIDs)
      requestsMade++
    }
  }

  async getById(id: number) {
    const unitsContract = this.store.contract.use('units')
    const unit = await unitsContract.getUnit(id)

    this.store.unit.loadOne(id, { ...unit, id })
  }

  async moveUnit(fromLandId: number, toLandId: number, unitTokenId: number) {
    const heroId = this.store.player.hero?.id

    const diamond = this.store.contract.useSigned('diamond')

    return await diamond.moveUnit(heroId, unitTokenId, fromLandId, toLandId)
  }

  async attackUnit(fromLandId: number, toLandId: number, unitTokenId: number) {
    const heroId = this.store.player.hero?.id

    const range = this.store.land.getLandById(fromLandId)?.unit?.range

    const diamond = this.store.contract.useSigned('diamond')
    const attackMethod =
      range && range > 1 ? diamond.attackRanged : diamond.attack

    return await attackMethod(heroId, unitTokenId, fromLandId, toLandId)
  }

  async deployUnit(
    unitTokenId: number,
    landId: number,
    occupiedLandId: number
  ) {
    const heroId = this.store.player.hero?.id

    return await this.store.contract.diamond.deployUnit(
      heroId,
      unitTokenId,
      occupiedLandId,
      landId
    )
  }

  async craft(unit: PlatonicUnit) {
    const { diamond } = this.store.contract
    const { BARRACKS_UNIT_IDS, WORKSHOP_UNIT_IDS, MAGE_TOWER_UNIT_IDS } =
      this.store.catalog

    if (BARRACKS_UNIT_IDS.includes(unit.id)) {
      if (this.store.player.hasBarracks) {
        await diamond.craftFromBarracks(this.store.player.hero!.id, unit.id, [
          this.store.player.ownBarracks?.landId,
        ])
        this.api.inventory.getUnits()
        this.api.resource.getAll()
      } else {
        // need a barracks
      }
    } else if (WORKSHOP_UNIT_IDS.includes(unit.id)) {
      if (this.store.player.hasWorkshop) {
        await diamond.craftFromWorkshop(this.store.player.hero!.id, unit.id, [
          this.store.player.ownWorkshop?.landId,
        ])
      } else {
        // need a workshop
      }
    } else if (MAGE_TOWER_UNIT_IDS.includes(unit.id)) {
      if (this.store.player.hasMageTower) {
        await diamond.craftFromMageTower(this.store.player.hero!.id, unit.id, [
          this.store.player.ownMageTower?.landId,
        ])
      } else {
        // need a mage tower
      }
    }
    return await Promise.all([
      this.api.inventory.getUnits(),
      this.api.resource.getAll(),
    ])
  }
}
