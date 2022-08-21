import { AppAPI } from '../api'
import { AppStore } from '../stores/app'
import { AppController } from './app'

export class AnalyticsController {
  constructor(
    private controller: AppController,
    private store: AppStore,
    private api: AppAPI
  ) {}

  test({ player, action }: { player: string | number; action: string }) {
    if (process.env.NODE_ENV !== 'production' || !umami) {
      return
    }
    umami.trackEvent(player.toString(), action)
  }

  knownContractActions: Record<string, string> = {
    claimEnergy: 'claimEnergy',
    claimMana: 'claimMana',
    claimLumber: 'claimLumber',
    claimGold: 'claimGold',
    testRegister: 'testRegister',
    moveUnit: 'moveUnit',
    deployUnit: 'deployUnit',
    attack: 'attack',
    attackRanged: 'attackRanged',
    craftFromMageTower: 'craftFromMageTower',
    craftFromBarracks: 'craftFromBarracks',
    craftFromWorkshop: 'craftFromWorkshop',
    healing: 'healing',
    reduceArmor: 'reduceArmor',
    fireball: 'fireball',
    giantStrength: 'giantStrength',
    iceArmor: 'iceArmor',
  }

  logContractEvent = (event: string) => {
    const { heroId } = this.store.player
    if (!heroId) {
      return
    }

    if (this.knownContractActions[event]) {
      this.test({ player: heroId, action: this.knownContractActions[event] })
    }
  }
}
