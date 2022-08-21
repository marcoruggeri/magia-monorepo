import { AppAPI } from '../api'
import { AppStore } from '../stores/app'
import { AppController } from './app'
import { autorun, reaction } from 'mobx'
import { BigNumber, ethers } from 'ethers'
import { unwrap } from '../util/unwrap'

export class EventController {
  constructor(
    private controller: AppController,
    private store: AppStore,
    private api: AppAPI
  ) {
    const disposer = autorun(() => {
      const diamond = this.store.contract.signedContracts.get('diamond')
      if (typeof window != 'undefined' && diamond) {
        disposer()
        Object.entries(this.diamond).forEach(([k, func]) => {
          diamond.ethersContract.on(k, func)
        })
        console.log('listening to diamond events')
      }
    })
  }

  diamond = {
    Register: (heroId: number, landId: number) => {
      console.log('caught a register with dynamically attached event')

      // reload the tile
      this.api.land.getOne(parseInt(ethers.utils.formatUnits(landId, 0)))
    },
    MoveUnit: (
      heroId: number,
      fromLandId: number,
      toLandId: number,
      unitTokenId: number
    ) => {
      console.log('caught a move unit with dynamically attached event', {
        fromLandId,
        parsed: parseInt(ethers.utils.formatUnits(fromLandId, 0)),
      })

      // reload the tiles
      this.api.land.getOne(parseInt(ethers.utils.formatUnits(fromLandId, 0)))
      this.api.land.getOne(parseInt(ethers.utils.formatUnits(toLandId, 0)))
    },
    Attack: (
      heroId: number,
      fromLandId: number,
      toLandId: number,
      unitTokenId: number
    ) => {
      console.log('caught an attack with dynamically attached event')

      // reload the tiles
      this.api.land.getOne(parseInt(ethers.utils.formatUnits(fromLandId, 0)))
      this.api.land.getOne(parseInt(ethers.utils.formatUnits(toLandId, 0)))
    },
    DeployUnit: (
      heroId: number,
      occupiedLandId: number,
      landId: number,
      unitTokenId: number
    ) => {
      console.log('caught a deploy unit with dynamically attached event')

      // reload the tile
      this.api.land.getOne(parseInt(ethers.utils.formatUnits(landId, 0)))
    },
    EquipBuilding: (heroId: number, buildingId: number, landId: number) => {
      console.log('caught an equip building with dynamically attached event')

      // reload the tile
      this.api.land.getOne(parseInt(ethers.utils.formatUnits(landId, 0)))
    },
    Healing: (heroId: number, landId: number, unitTokenId: number) => {
      console.log('caught a healing with dynamically attached event')

      // reload the tiles
      this.api.land.getOne(parseInt(ethers.utils.formatUnits(landId, 0)))
    },
    ReduceArmor: (heroId: number, landId: number, unitTokenId: number) => {
      console.log('caught a reduce armor with dynamically attached event')

      // reload the tiles
      this.api.land.getOne(parseInt(ethers.utils.formatUnits(landId, 0)))
    },
    Fireball: (heroId: number, landId: number, unitTokenId: number) => {
      console.log('caught a fireball with dynamically attached event')

      // reload the tiles
      this.api.land.getOne(parseInt(ethers.utils.formatUnits(landId, 0)))
    },
    GiantStrength: (heroId: number, landId: number, unitTokenId: number) => {
      console.log('caught a giant strength with dynamically attached event')

      // reload the tiles
      this.api.land.getOne(parseInt(ethers.utils.formatUnits(landId, 0)))
    },
    IceArmor: (heroId: number, landId: number, unitTokenId: number) => {
      console.log('caught an ice armor with dynamically attached event')

      // reload the tiles
      this.api.land.getOne(parseInt(ethers.utils.formatUnits(landId, 0)))
    },
    StartShield: (
      heroId: BigNumber,
      unitIds: BigNumber[],
      shieldExpiry: BigNumber
    ) => {
      console.log('caught a StartShield', {
        heroId,
        unitIds,
      })
      this.store.unit.loadStartShield(unitIds, shieldExpiry)
    },
    StopShield: (heroId: BigNumber, unitIds: BigNumber[]) => {
      console.log('caught a StopShield', { heroId, unitIds })
      this.store.unit.loadStopShield(unitIds)
    },
    ResetShield: (
      heroId: BigNumber,
      unitIds: BigNumber[],
      shieldExpiry: BigNumber
    ) => {
      console.log('caught a ResetShield', { heroId, unitIds })

      this.store.unit.loadStartShield(unitIds, shieldExpiry)
    },
    SummonAngels: (heroId: number, _: number, landId: number) => {
      console.log('caught a Summon Angels', { landId })
      this.api.land.getOne(landId)
    },
    SummonBlackKnights: (heroId: number, _: number, landId: number) => {
      console.log('caught a Summon BlackKnights', { landId })
      this.api.land.getOne(landId)
    },
    SummonEarthElemental: (heroId: number, _: number, landId: number) => {
      console.log('caught a Summon EarthElemental', { landId })
      this.api.land.getOne(landId)
    },
    SummonFireElemental: (heroId: number, _: number, landId: number) => {
      console.log('caught a Summon FireElemental', { landId })
      this.api.land.getOne(landId)
    },
    SummonWaterElemental: (heroId: number, _: number, landId: number) => {
      console.log('caught a Summon WaterElemental', { landId })
      this.api.land.getOne(landId)
    },
    Teleport: (heroId: number, fromLandId: number, toLandId: number) => {
      console.log('caught a Teleport', { fromLandId, toLandId })
      this.api.land.fetchMany([fromLandId, toLandId])
    },
    Convert: (heroId: number, _: number, landId: number) => {
      console.log('caught a Convert', { landId })
      this.api.land.getOne(landId)
    },
    Plague: (heroId: number, landId: number) => {
      console.log('caught a Plague', { landId })
      this.api.land.getOne(landId)
    },

    Pyroblast: (landIds: number[]) => {
      console.log('caught a Pyroblast', { landIds })
      this.api.land.fetchMany(landIds)
    },
  }
}
