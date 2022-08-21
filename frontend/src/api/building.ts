import { AppAPI } from '.'
import { Building } from '../../enums'
import { AppStore } from '../stores/app'

export class BuildingApi {
  constructor(private api: AppAPI, private store: AppStore) {}

  async craft(buildingId: number) {
    const diamond = this.store.contract.useSigned('diamond')
    const result = await diamond.craftBuilding(
      this.store.player.hero?.id,
      buildingId,
      {
        spinnerLabel: 'crafting building',
      }
    )

    await Promise.all([
      this.api.inventory.getBuildings(),
      this.api.resource.getAll(),
    ])
    return result
  }

  async equip(building: Building, landId: number) {
    // are we approved?
    if (!(await this.store.contract.approve('buildings'))) {
      return
    }

    const diamond = this.store.contract.useSigned('diamond')

    const result = await diamond.equipBuilding(
      this.store.player.hero?.id,
      building,
      landId,
      { spinnerLabel: 'equipping building' }
    )

    await this.api.inventory.getBuildings()

    return result
  }

  async approve() {
    const buildings = this.store.contract.useSigned('buildings')

    const { res: approved } = await buildings.isApprovedForAll(
      this.store.wallet.address,
      this.store.contract.diamond.address,
      { closeModal: true }
    )

    await buildings.setApprovalForAll(
      this.store.contract.diamond.address,
      true,
      {
        spinnerLabel: 'approving buildings',
      }
    )
  }
}
