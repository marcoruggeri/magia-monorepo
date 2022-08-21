import { ethers } from 'ethers'
import { action } from 'mobx'
import { AppAPI } from '.'
import { MagicStatsTuple } from '../../magiaTypes'
import { Hero } from '../models/Hero'
import { Villain } from '../models/Villain'
import { AppStore } from '../stores/app'
import { MintHeroInput } from '../types/game/mintHeroInput'
import { unwrap } from '../util/unwrap'
import { MagiaAPI } from './MagiaApi'

export class HeroApi extends MagiaAPI {
  async fetchPlayerHero() {
    const heroes = this.store.contract.use('heroes')
    try {
      const heroNFT = await heroes.tokenOfOwnerByIndex(
        this.store.wallet.address,
        0
      )
      // console.log({ heroNFT })
      const id = unwrap.bigNumber(heroNFT)
      const heroData = await heroes.heroes(id)
      const hero = new Hero(this.store, heroData, id)
      this.store.hero.byId.set(id, hero)
      this.store.player.setHero(hero)
      this.store.player.setEnergy(hero.energy)
      // this.store.player.hero?.id = id

      return hero
    } catch (e) {
      // unknown wallet
      return false
    }
  }

  fetchHeroes = async () => {
    const heroes = this.store.contract.use('heroes')
    const data = await heroes.getBatchHero()
    console.log(data)

    this.store.hero.loadHeroesInOrder(data)
  }

  // check if the player's hero has been registered to the map
  isPlayerHeroRegistered = async () => {
    if (!this.store.player.hero) {
      return false
    }

    const diamond = this.store.contract.diamond
    const { res: isRegistered } = await diamond.getRegistered(
      this.store.player.hero.id
    )

    return isRegistered
  }

  mint = async (input: MintHeroInput) => {
    const heroes = this.store.contract.useSigned('heroes')

    const { err, res } = await heroes.mintHero(
      [...input.magic, 0, 1, 750, input.name],
      { spinnerLabel: `minting hero (${input.name})` }
    )

    if (!err) {
      await this.api.hero.fetchPlayerHero()
    }
    return { err, res }
  }

  register = async () => {
    const diamond = this.store.contract.useSigned('diamond')
    const heroes = this.store.contract.useSigned('heroes')
    const lands = this.store.contract.useSigned('lands')

    const { res: heroId } = await heroes.tokenOfOwnerByIndex(
      this.store.wallet.address,
      0
    )
    let landId: number

    while (true) {
      landId = Math.floor(Math.random() * 10000)
      const { res: checkHeroId } = await lands.getHero(landId)

      if (ethers.utils.formatUnits(checkHeroId) === '0.0') {
        break
      }
    }

    // console.log('in reg with', heroId, landId)

    const { err } = await diamond.testRegister(heroId, landId)

    if (err) {
      return { err, res: { heroId: undefined, landId: undefined } }
    }

    // update stuff
    await Promise.all([
      this.api.resource.getGoldBalance(),
      this.api.resource.getLumberBalance(),
      this.api.resource.getManaBalance(),
      this.api.inventory.getBuildings(),
      this.api.inventory.getUnits(),
    ])

    return { err, res: { heroId, landId } }
  }

  async getEnergy() {
    if (!this.store.player.hero) {
      return
    }
    const heroes = this.store.contract.useSigned('heroes')
    const { res: energy, err } = await heroes.getEnergy(
      this.store.player.hero.id
    )

    if (!err) {
      this.store.player.setEnergy(unwrap.bigNumber(energy))
      await this.fetchClaimableEnergy()
    }
  }

  async fetchClaimableEnergy() {
    if (!this.store.player.hero) {
      return
    }

    const heroes = this.store.contract.useSigned('heroes')

    const { res: energy, err } = await heroes.getClaimableEnergy(
      this.store.player.hero.id
    )

    if (!err) {
      this.store.player.setClaimableEnergy(unwrap.bigNumber(energy))
    }
  }

  async getExp() {
    const heroes = this.store.contract.useSigned('heroes')
    const { res: exp } = await heroes.getExp(this.store.player.hero?.id)
    this.store.player.hero?.setExp(exp)
  }

  async getHero(heroId: number) {
    const heroes = this.store.contract.use('heroes')
    const hero = await heroes.heroes(heroId)
    return hero
  }

  // @action getVillains = async () => {
  //   // TODO: use unsigned so we can show the leaderboard on load
  //   // const heroes = this.store.contract.use('heroes')
  //   const heroes = this.store.contract.useSigned('heroes')

  //   const heroIds = [...Array(100).keys()].map((i) => i + 1)
  //   // const { res: exps, err } = await heroes.getBatchExp(heroIds)
  //   // if (err) {
  //   //   return
  //   // }
  //   // const { res: names, err: err2 } = await heroes.getBatchName(heroIds)
  //   // if (err2) {
  //   //   return
  //   // }

  //   // heroIds.forEach(
  //   //   action((id, idx) => {
  //   //     const villain = new Villain(id, names[idx], unwrap.bigNumber(exps[idx]))

  //   //     this.store.hero.villainsById.set(id, villain)
  //   //   })
  //   // )
  // }

  async startShield(duration: number) {
    const unitIds = this.store.ui.unitsToShield.map((u) => u.id)
    if (!unitIds.length) {
      return
    }

    const landIds = this.store.ui.unitsToShield.map((u) => u.tile?.landId)

    const { err } = await this.store.contract.diamond.startShield(
      this.store.player.heroId,
      unitIds,
      landIds,
      duration
    )
    if (!err) {
      await this.getEnergy()
    }
    return { err }
  }

  async resetShield(duration: number) {
    const { err } = await this.store.contract.diamond.resetShield(
      this.store.player.heroId,
      duration
    )
    if (!err) {
      await this.getEnergy()
    }
    return { err }
  }
  // async stopShield() {
  //   await this.store.contract.diamond.cancelShield(this.store.player.heroId)
  //   // await this.getShield(this.store.player.heroId!)
  // }

  // async getShield(heroId: number) {
  //   const { res: timestamp, err } =
  //     await this.store.contract.diamond.getShieldEndTimestamp(heroId)

  //   if (!err) {
  //     this.store.hero.setShieldExpiry(heroId, unwrap.bigNumber(timestamp))
  //   }
  // }

  async levelUp(points: MagicStatsTuple) {
    if (!this.store.player.heroId) {
      return
    }

    const { heroes } = this.store.contract
    const { res, err } = await heroes.levelUp(this.store.player.heroId, points)

    if (!err) {
      await this.api.hero.fetchPlayerHero()
    }

    return res
  }
}
