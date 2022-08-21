import { AppAPI } from '.'
import { AppStore } from '../stores/app'

export class UnitTypeApi {
  constructor(private api: AppAPI, private store: AppStore) {}

  async getBatchByIds(ids: number[]) {}
}
