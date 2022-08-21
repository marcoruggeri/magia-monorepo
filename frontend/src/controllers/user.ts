import { makeObservable, observable } from 'mobx'
import { AppAPI } from '../api'
import { AppStore } from '../stores/app'
import { MintHeroInput } from '../types/game/mintHeroInput'
import { HUDState } from '../types/ui/HUDState'
import { ModalDialog } from '../types/ui/Dialogs'
import { AppController } from './app'

export class UserController {
  constructor(
    private controller: AppController,
    private store: AppStore,
    private api: AppAPI
  ) {
    // makeObservable(this)
  }

  init = async () => {
    // const wallet = await this.store.wallet.signer

    if (!this.store.wallet.signer) return
    // if we have a wallet then check for a heroNFT

    const hero = await this.api.hero.fetchPlayerHero()

    if (!this.store.player.hero) {
      // show mint hero
      this.store.ui.modalOpen = ModalDialog.MINT

      return
    }

    // init the diamond listeners
    const diamond = this.store.contract.diamond

    // does the player have a hero registered?
    const { res: isRegistered } = await diamond.getRegistered(
      this.store.player.hero.id
    )

    if (!isRegistered) {
      this.store.ui.setHUDState(HUDState.NEEDS_TO_REGISTER)

      const {
        err: err2,
        res: { landId },
      } = await this.api.hero.register()

      if (err2 || !landId) {
        return
      }

      await this.api.hero.fetchPlayerHero()
      this.controller.map.panToLandId(landId)
    }

    this.controller.analytics.test({
      player: this.store.player.hero.id,
      action: 'login',
    })

    this.store.ui.setHUDState(HUDState.MAP)

    this.api.hero.getEnergy()
    this.api.hero.getExp()
    // init resources
    this.api.resource.getGoldBalance()
    this.api.resource.getLumberBalance()
    this.api.resource.getManaBalance()
    // init inventory
    this.api.inventory.getBuildings()
    this.api.inventory.getUnits()
    this.api.inventory.getSpells()

    this.controller.map.panToNextOwnLand()
  }

  mintAndRegisterHero = async (input: MintHeroInput) => {
    // mint

    const { err, res } = await this.api.hero.mint(input)
    if (err) {
      // failed to mint
      return
    }

    const {
      err: err2,
      res: { landId },
    } = await this.api.hero.register()
    // this.store.hero.setMintedLandId(landId)
    // okay, go to register

    if (err2 || !landId) {
      return
    }

    this.api.hero.fetchPlayerHero()
    this.controller.map.panToLandId(landId)
  }
}
