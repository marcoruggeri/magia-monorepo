import { AppStore } from '../stores/app'
import { ContractStore } from '../stores/contract'
import { BuildingApi } from './building'
import { HeroApi } from './hero'
import { LandApi } from './land'
import { ResourceApi } from './resource'
import { SpellsApi } from './spells'
import { UnitApi } from './unit'
import { UnitTypeApi } from './unitType'
import { InventoryApi } from './inventory'
import { GasPriceApi } from './gasPrice'
import { CatalogApi } from './catalog'

type ITxWatcher = (name: string, tx: any) => Promise<any[]>

export class AppAPI {
  unit: UnitApi
  unitType: UnitTypeApi
  land: LandApi
  building: BuildingApi
  spells: SpellsApi
  hero: HeroApi
  resource: ResourceApi
  inventory: InventoryApi
  gasPrice: GasPriceApi
  catalog: CatalogApi

  txWatcher?: ITxWatcher

  constructor(store: AppStore) {
    this.unitType = new UnitTypeApi(this, store)
    this.unit = new UnitApi(this, store)
    this.land = new LandApi(this, store)
    this.building = new BuildingApi(this, store)
    this.spells = new SpellsApi(this, store)
    this.hero = new HeroApi(this, store)
    this.resource = new ResourceApi(this, store)
    this.inventory = new InventoryApi(this, store)
    this.gasPrice = new GasPriceApi(this, store)
    this.catalog = new CatalogApi(this, store)
  }

  // injector for the UI Controller to pass a watch func
  setTxWatcher = (f: ITxWatcher) => {
    this.txWatcher = f
  }

  // this can be called before we have a watcher
  // it will return the same result but no watching happens
  watch = async (name: string, tx: any) => {
    if (this.txWatcher) {
      return await this.txWatcher(name, tx)
    }

    // if we dont have a watcher just execute here
    // -- we should always have a watcher
    let err,
      res = undefined

    try {
      res = await tx.wait()
    } catch (e) {
      err = e
    }

    return [err, res]
  }
}
