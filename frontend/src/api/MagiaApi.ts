import { AppAPI } from '.'
import { AppStore } from '../stores/app'
import { ContractStore } from '../stores/contract'

export abstract class MagiaAPI {
  protected contracts: ContractStore

  constructor(protected api: AppAPI, protected store: AppStore) {
    this.contracts = store.contract
  }

  watch = this.api.watch
}
