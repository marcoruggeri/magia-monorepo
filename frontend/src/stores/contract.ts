import { ethers } from 'ethers'
import { FunctionFragment } from 'ethers/lib/utils'
import {
  action,
  autorun,
  computed,
  makeObservable,
  observable,
  reaction,
} from 'mobx'
import { ContractKeys, getAbi } from '../abi'
import contracts from '../contracts.json'
import { delay } from '../lib/utils/delay'
import { WrappedContract } from '../util/wrapContract'
import { AppStore } from './app'

export class ContractStore {
  @observable initialised = false
  @action initDone() {
    this.initialised = true
  }
  contracts = observable.map<ContractKeys, ethers.Contract>()

  signedContracts = observable.map<ContractKeys, WrappedContract>()

  // controller func to wrap contract calls with error handling
  contractWrapper?: (contract: ethers.Contract) => WrappedContract

  constructor(private store: AppStore) {
    makeObservable(this)
  }

  use = (name: ContractKeys) => {
    if (!this.contracts.has(name)) {
      this.contracts.set(
        name,
        new ethers.Contract(
          contracts[name],
          getAbi(name).abi,
          this.store.wallet.provider
        )
      )
    }
    return this.contracts.get(name)!
  }

  @computed get contractsCount() {
    return Object.keys(contracts).length
  }

  @action
  loadSignedContracts = async (progressReport: (msg: string) => void) => {
    const wallet = this.store.wallet.wallet
    const provider = this.store.wallet.provider

    // don't do anything if we can't wrap the contracts with a listener
    if (!this.contractWrapper) {
      // contractWrapper will be assinged during setup
      // if this isn't here we have bigger problems
      throw new Error(
        'Attempted to use a signed contract before the game has fully initialised'
      )
    }

    // drop the old contracts
    this.signedContracts.clear()

    const allContracts = Object.entries(contracts) as [ContractKeys, string][]

    for (let i = 0; i < allContracts.length; i++) {
      const [label, address] = allContracts[i]
      const contract = new ethers.Contract(address, getAbi(label).abi, wallet)
      // contract.connect(wallet)
      const wrappedContract = this.contractWrapper!(contract)
      this.signedContracts.set(label, wrappedContract)
      // await delay(1250)
      const ucLabel = label.slice(0, 1).toUpperCase() + label.slice(1)
      progressReport(`Researching ${ucLabel}`)
      await delay(500)
    }

    this.initDone()
    return true
  }

  @action useSigned = (name: ContractKeys) => {
    if (!this.signedContracts.has(name)) {
      console.log('initialising contract:', name)

      const contract = new ethers.Contract(
        contracts[name],
        getAbi(name).abi,
        this.store.wallet.signer
      )

      if (!this.contractWrapper) {
        // contractWrapper will be assinged during setup
        // if this isn't here we have bigger problems
        throw new Error(
          'Attempted to use a signed contract before the game has fully initialised'
        )
      }

      const wrappedContract = this.contractWrapper(contract)
      this.signedContracts.set(name, wrappedContract)
    }
    return this.signedContracts.get(name)!
  }

  @computed get heroes() {
    return this.useSigned('heroes')
  }

  @computed get units() {
    return this.useSigned('units')
  }

  @computed get diamond() {
    return this.useSigned('diamond')
  }

  @observable approved = {
    units: undefined,
    buildings: undefined,
    quests: undefined,
  }

  // cache the isApproved call
  @action async hasApproved(key: keyof typeof this.approved) {
    if (this.approved[key] !== undefined) {
      return this.approved[key]
    }

    const { res: approved, err } = await this.useSigned(key).isApprovedForAll(
      this.store.wallet.address,
      this.diamond.address
    )

    if (!err) {
      this.approved = { ...this.approved, [key]: approved }
      return approved
    }

    // error? - say false but don't cache so we can try again
    return false
  }

  // check if we already have approval and setApproved if required
  @action async approve(key: keyof typeof this.approved) {
    // check for approval
    const approved = await this.hasApproved(key)

    if (approved) {
      return approved
    }
    // if not approved then set it now
    const { err } = await this.useSigned(key).setApprovalForAll(
      this.diamond.address,
      true,
      {
        spinnerLabel: `approving ${key} for deployment`,
      }
    )

    // cache result
    if (!err) {
      this.approved = { ...this.approved, [key]: true }
      return true
    }

    // error? - say false but don't cache so we can try again
    return false
  }

  dynamicCall = async (
    key: ContractKeys,
    func: FunctionFragment,
    args: any[]
  ) => {
    // first try a non
    const contract =
      func.stateMutability === 'view' ? this.use(key) : this.useSigned(key)
    try {
      const res = await contract[func.name](...args)
      return res
    } catch (e) {}
  }
}
