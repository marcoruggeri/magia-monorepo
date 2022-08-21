import { ethers } from 'ethers'
import { AppAPI } from '.'
import { Spell } from '../../enums'

import { AppStore } from '../stores/app'
import { unwrap } from '../util/unwrap'

export class InventoryApi {
  constructor(private api: AppAPI, private store: AppStore) {}

  async getBuildings() {
    const contract = this.store.contract.useSigned('buildings')
    const { res: buildings, err } = await contract.balanceOfBatch(
      [
        this.store.wallet.address,
        this.store.wallet.address,
        this.store.wallet.address,
        this.store.wallet.address,
        this.store.wallet.address,
        this.store.wallet.address,
      ],
      [1, 2, 3, 4, 5, 6]
    )
    if (!err) {
      this.store.player.setBuildings(buildings)
    }
  }

  async getUnits() {
    const contract = this.store.contract.useSigned('units')
    const { res: unitBalance } = await contract.balanceOf(
      this.store.wallet.address
    )
    const unitsTokenIds = []
    for (let i = 0; i < unitBalance; i++) {
      const { res: unitTokenId } = await contract.tokenOfOwnerByIndex(
        this.store.wallet.address,
        i
      )
      unitsTokenIds.push(unwrap.bigNumber(unitTokenId))
    }

    // make sure we have these units in the store
    await this.api.unit.getBatchByIds(unitsTokenIds)

    // save to player inventory
    this.store.player.setUnits(unitsTokenIds)
  }

  async getSpells() {
    // ignore 0 (none)
    const spellKeys = Object.keys(Spell).slice(1)
    // base 1 index = id
    const ids = spellKeys.map((_, idx) => idx + 1)
    const contract = this.store.contract.useSigned('spells')
    const { res: spells, err } = await contract.balanceOfBatch(
      // for each spell we know send
      // 1 - wallet address
      spellKeys.map(() => this.store.wallet.address),
      // 2 - id
      ids
    )

    if (!err) {
      this.store.player.setSpells(spells, ids)
    }
  }

  async getAll() {
    return await Promise.all([
      this.getBuildings(),
      this.getUnits(),
      this.getSpells(),
    ])
  }
}
