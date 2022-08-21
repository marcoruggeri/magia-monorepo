import { computed, makeObservable } from 'mobx'
import { CatalogStore } from './catalog'
import { ContractStore } from './contract'
import { DebugStore } from './debug'
import { HeroStore } from './hero'
import { LandStore } from './land'
import { PlayerStore } from './player'
import { UIStore } from './ui'
import { UnitStore } from './unit'
import { WalletStore } from './wallet'

export class AppStore {
  // ------------------ phaser objects ------------------
  game?: Phaser.Game
  scenes: {
    map?: Phaser.Scene
  } = {}

  // ------------------ stores ------------------
  debug = new DebugStore(this)
  land = new LandStore(this)
  unit = new UnitStore(this)
  wallet = new WalletStore(this)
  ui = new UIStore(this)
  contract = new ContractStore(this)
  hero = new HeroStore(this)
  player = new PlayerStore(this)
  catalog = new CatalogStore(this)

  constructor() {
    makeObservable(this)
  }

  @computed get initialised() {
    return (
      this.contract.initialised &&
      this.land.initialised &&
      this.catalog.initialised &&
      this.unit.initialised
    )
  }
}
