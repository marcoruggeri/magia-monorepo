import { ethers } from 'ethers'
import { AppAPI } from '.'
import { Resource } from '../../enums'
import { AppStore } from '../stores/app'

export class ResourceApi {
  constructor(private api: AppAPI, private store: AppStore) {}

  async getGoldBalance() {
    const goldContract = this.store.contract.useSigned('gold')
    const { err, res: gold } = await goldContract.balanceOf(
      this.store.wallet.address
    )
    if (!err) {
      this.store.player.setGold(parseInt(ethers.utils.formatUnits(gold)))
    }
  }

  async getLumberBalance() {
    const lumberContract = this.store.contract.useSigned('lumber')
    const { err, res: lumber } = await lumberContract.balanceOf(
      this.store.wallet.address
    )
    if (!err) {
      this.store.player.setLumber(parseInt(ethers.utils.formatUnits(lumber)))
    }
  }

  async getManaBalance() {
    const manaContract = this.store.contract.useSigned('mana')
    const { err, res: mana } = await manaContract.balanceOf(
      this.store.wallet.address
    )
    if (!err) {
      this.store.player.setMana(parseInt(ethers.utils.formatUnits(mana)))
    }
  }

  async getAll() {
    return await Promise.all([
      this.getGoldBalance(),
      this.getLumberBalance(),
      this.getManaBalance(),
    ])
  }

  async claim(resource: Resource) {
    if (!this.store.player.hero || !this.store.land.selected) {
      return false
    }
    return await this.claimFuncs[resource](
      this.store.player.hero.id,
      this.store.land.selected.landId
    )
  }

  claimFuncs = {
    [Resource.GOLD]: async (heroId: number, landId: number) => {
      const { diamond } = this.store.contract
      await diamond.claimGold(heroId, landId)
      await this.api.resource.getGoldBalance()
    },
    [Resource.MANA]: async (heroId: number, landId: number) => {
      const { diamond } = this.store.contract
      await diamond.claimMana(heroId, landId)
      await this.api.resource.getManaBalance()
    },
    [Resource.LUMBER]: async (heroId: number, landId: number) => {
      const { diamond } = this.store.contract
      await diamond.claimLumber(heroId, landId)
      await this.api.resource.getLumberBalance()
    },
  }
}
