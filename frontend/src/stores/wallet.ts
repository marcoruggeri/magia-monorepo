import { AppStore } from './app'
import { AppState } from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import { Contract, ethers, providers } from 'ethers'
import { action, autorun, computed, makeObservable, observable } from 'mobx'
import { API } from 'bnc-onboard/dist/src/interfaces'
import { shortenAddress } from '../util/shortenAddress'
import { seed } from '../lib/utils/seed'

interface BNC {
  onboard?: API
}

export interface Account {
  address: string
  key: string
}

export class WalletStore {
  @observable signer?: ethers.providers.JsonRpcSigner

  @observable bnc: BNC = {}

  @observable onboard?: AppState

  @observable address?: string
  @observable logo?: string

  constructor(private store: AppStore) {
    makeObservable(this)
  }

  provider = new ethers.providers.JsonRpcProvider(
    'https://optimism.gnosischain.com'
  )

  @computed get connected() {
    return !!this.address
  }

  @computed get addressShort() {
    return this.address ? shortenAddress(this.address) : ''
  }

  /** ------------- Burner wallets ----------------**/
  // all the accounts that we know about
  @observable accounts: Account[] = []
  @observable wallet?: ethers.Wallet

  @action selectAccount = async (account: Account) => {
    // create a wallet
    // const wallet = new ethers.Wallet(account.key, infuraProvider)
    const wallet = new ethers.Wallet(account.key, this.provider)
    // store the data
    this.wallet = wallet
    // maybe inject some funds
    await seed(this.wallet.address)

    // return
    this.address = wallet.address
  }

  saveAccounts = () => {
    localStorage.setItem(
      'MGACCTS',
      JSON.stringify(this.accounts.map((a) => a.address))
    )

    this.accounts.forEach((a) =>
      localStorage.setItem(`MGA-${a.address}`, a.key)
    )
  }

  @action loadAccounts() {
    const accounts: Account[] = []
    try {
      const addresses = JSON.parse(localStorage.getItem('MGACCTS') ?? 'false')
      if (addresses && Array.isArray(addresses)) {
        addresses.forEach((address) => {
          const key = localStorage.getItem(`MGA-${address}`)
          if (key) {
            accounts.push({
              key,
              address,
            })
          }
        })
      }
    } catch (e) {}

    this.accounts = accounts
  }

  // used to check that we don't already know about an account before importing it
  isKnownKey = (key: string) => {
    return this.accounts.some((a) => a.key === key)
  }

  @action forgetAccount(account: Account) {
    const accounts = this.accounts.filter((a) => a.address !== account.address)
    this.accounts = accounts
    localStorage.removeItem(`MGA-${account.address}`)
    this.saveAccounts()
  }

  @computed get hasAccounts() {
    return this.accounts.length > 0
  }

  @action addAccountFromKey(key: string) {
    const address = ethers.utils.computeAddress(key)
    const account = {
      key,
      address,
    }
    this.accounts = [...this.accounts, account]

    this.saveAccounts()
    return account
  }
}
