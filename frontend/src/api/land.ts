import { AppAPI } from '.'
import { AppStore } from '../stores/app'
import chainMap from '../../scripts/mapdata.json'
import { ChainLand, IChainLand } from '../types/chain/land'
import axios from 'axios'
import { unwrap } from '../util/unwrap'

export class LandApi {
  constructor(private api: AppAPI, private store: AppStore) {}

  // async getAll() {
  //   const data = await this.getAllFromChain()
  //   this.store.land.load(data)

  // try {
  //   const data = await this.getAllFromApi()
  //   console.log('got chain data', data)
  //   if (data) {
  //     this.store.land.load(data)
  //     return data
  //   }
  // } catch (e) {
  //   console.log('catch')

  //   const data = await this.getAllFromChain()
  //   //  console.log('got chain data', data)
  //   if (data) {
  //     this.store.land.load(data)
  //     return data
  //   }
  // }
  // }

  // async getAllFromLocal() {
  //   return chainMap as IChainLand[]
  // }

  // async fetchAllInBatches() { }

  async fetchRange(start: number, end: number) {
    const lands = this.store.contract.use('lands')
    const data = (await lands.getBatchMapRange(start, end)) as IChainLand[]
    this.store.land.load(data, start)
    return data
  }

  async getAllFromApi() {
    try {
      const data = await axios.get('/api/land')
      if (data && data.data.success) {
        return data.data.landsData as ChainLand[]
      }
    } catch (e) {
      console.error(e)
    }

    return false
  }

  async getAllFromChain() {
    const lands = this.store.contract.use('lands')
    return (await lands.getMap()) as IChainLand[]
    // return data.map((input) => new ChainLand(input))
  }

  getOne = async (id: number) => {
    const lands = this.store.contract.use('lands')
    const tileData = await lands.getLandById(id)
    if (!tileData) {
      return
    }

    const unitTokenId = unwrap.bigNumber(tileData.unitTokenId)

    // we might need a new unit
    if (unitTokenId) {
      // always refresh the unit because the stats might have changed
      await this.api.unit.getById(unitTokenId)
    }

    // store the new land
    this.store.land.updateSingle(tileData, id)
  }

  fetchMany = async (ids: number[]) => {
    await Promise.all(ids.map((id) => this.getOne(id)))
  }
}
