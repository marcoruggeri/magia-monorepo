import { BigNumber } from 'ethers'
import { action, autorun, computed, makeObservable, observable } from 'mobx'
import { Unit } from '../models/Unit'
import { IChainUnitWithID } from '../types/chain/unit'
import { unwrap } from '../util/unwrap'
import { AppStore } from './app'

export class UnitStore {
  @observable initialised = false
  @action initDone() {
    this.initialised = true
  }
  byId = observable.map<number, Unit>()

  // store of IDs we see on land. We'll fetch the units after the land has finished loading
  waitingToFetchIds: number[] = []

  constructor(private store: AppStore) {
    makeObservable(this)
  }

  // can't load like this without pre-processing because we don't have ids attached to units from the chain
  @action load(unitsWithIDs: IChainUnitWithID[]) {
    unitsWithIDs.forEach((unitWithID) =>
      this.byId.set(unitWithID.id, new Unit(this.store, unitWithID))
    )
  }

  @action loadOne(id: number, unitWithID: IChainUnitWithID) {
    this.byId.set(id, new Unit(this.store, unitWithID))
  }

  @computed get all() {
    return [...this.byId.values()]
  }

  // load shields after an event is caught
  @action loadStartShield(unitIds: BigNumber[], shieldExpiry: BigNumber) {
    const expiry = unwrap.bigNumber(shieldExpiry)
    unitIds.forEach((u) => {
      const id = unwrap.bigNumber(u)
      const unit = this.byId.get(id)
      if (unit) {
        unit.setShieldExpiry(expiry)
        this.byId.set(id, unit)
      }
    })
  }
  @action loadStopShield(unitIds: BigNumber[]) {
    unitIds.forEach((u) => {
      const id = unwrap.bigNumber(u)
      const unit = this.byId.get(id)
      if (unit) {
        unit.setShieldExpiry(0)
        this.byId.set(id, unit)
      }
    })
  }
}
