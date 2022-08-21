import { BigNumber, ContractFunction, ethers } from 'ethers'
import { AppAPI } from '../api'
import { AppStore } from '../stores/app'
import { Transaction } from '../stores/ui'
import { parseEthersError } from '../util/parseEthersError'
import { unwrap } from '../util/unwrap'
import { AppController } from './app'

export type WrappedContract = {
  ethersContract: ethers.Contract
  address: string
  [key: string]: any
}

interface ITransactionOptions {
  spinnerLabel: string
  closeModal: boolean
  retry: number
}
// in js rather than ts so we can typecheck at execution
const transactionOptionsKeys = ['spinnerLabel', 'closeModal', 'retry']

const isTransactionOptions = (param: any) =>
  typeof param === 'object' &&
  transactionOptionsKeys.some((k) => param.hasOwnProperty(k))

export class ContractController {
  constructor(
    private controller: AppController,
    private store: AppStore,
    private api: AppAPI
  ) {
    // contacts.store needs the wrapper asap
    this.store.contract.contractWrapper = this.wrapContract
  }

  // runs through all ContractFunctions on an ethers contract and wraps them in a custom function with:
  // - error handlind
  // - gas price
  // - Tx watching
  wrapContract = (contract: ethers.Contract) => {
    const wrappedContract: WrappedContract = {
      ethersContract: contract,
      address: contract.address,
    }

    // wrap every function from contract.functions
    // these are duped onto the contract itself by ethers
    // but we use .functions to avoid wrapping helper funcs
    for (let key in contract.functions) {
      wrappedContract[key] = async (...args: any[]) => {
        return await this.exec(wrappedContract, key, 0, ...args)
      }
    }

    return wrappedContract
  }

  txAwaitLabels: Record<string, string> = {
    claimEnergy: 'Claiming energy',
    claimMana: 'Claiming mana',
    claimLumber: 'Claiming lumber',
    claimGold: 'Claiming gold',
    testRegister: 'Registering hero',
    moveUnit: 'Moving unit',
    deployUnit: 'Deploying units',
    attack: 'Attacking',
    attackRanged: 'Attacking',
    craftFromMageTower: 'Crafting unit',
    craftFromBarracks: 'Crafting unit',
    craftFromWorkshop: 'Crafting unit',
    craftSpell: 'Crafting spell',
    healing: 'Casting healing',
    reduceArmor: 'Casting reduce armor',
    fireball: 'Casting fireball',
    giantStrength: 'Casting giant strength',
    iceArmor: 'Casting ice armor',
    summonAngels: 'Summoning Angels',
    summonBlackKnights: 'Summoning Black Knights',
    summonFireElemental: 'Summoning Fire Elemental',
    summonWaterElemental: 'Summoning Water Elemental',
    summonEarthElemental: 'Summoning Earth Elemental',
    convert: 'Casting convert',
    teleport: 'Casting teleport',
    pyroblast: 'Casting pyroblast',
    plague: 'Casting plague',
    transmute: 'Casting transmute',
    startShield: 'Starting shield',
    cancelShield: 'Stopping shield',
    resetShield: 'Resetting shield',
    levelUp: 'Levelling up',
  }

  async exec(
    wrappedContract: WrappedContract,
    key: string,
    retry: number,
    ...passedArgs: any[]
  ) {
    let tx: any
    let pointer: Transaction | undefined = undefined
    let res: any
    let err: any

    const args = [...passedArgs]

    if (retry > 1) {
      this.controller.hud.showErrorToast(
        `Tx Error (${key})`,
        // attempt to cut off the raw data dump
        {
          error: 'Exceeded max retries',
          args,
        }
      )
      return {
        err: 'Exceeded max retries',
      }
    }

    let opts: Partial<ITransactionOptions> = {
      spinnerLabel: undefined,
      closeModal: false,
    }

    if (args && isTransactionOptions(args[args.length - 1])) {
      opts = { ...opts, ...args[args.length - 1] }
      // remove the options object from args
      args.pop()
    }

    // maybe show spinner from dict?
    if (!opts.spinnerLabel) {
      opts.spinnerLabel = this.txAwaitLabels[key] ?? false
    }

    if (opts.spinnerLabel) {
      pointer = this.store.ui.addTransaction(opts.spinnerLabel)
    }

    // const gasPrice = await this.getGas(key)
    // const gasPrice = await fetchGasPrice()
    // const gasPrice = await this.store.wallet.provider?.getGasPrice()
    // if (gasPrice) {
    //   args.push({ ...gasPrice })
    //   console.log('added gas', gasPrice, 'to', key)
    // }

    // submit the tx
    try {
      res = await wrappedContract.ethersContract[key](...args)
    } catch (e: any) {
      err = e
      console.error('tx error', { key, err, args })
      setTimeout(() => {
        this.exec(wrappedContract, key, retry + 1, ...passedArgs)
      }, 500)
      if (pointer) {
        this.store.ui.removeTransaction(pointer)
      }
      return { key, err, args }
      this.controller.hud.showErrorToast(
        `Tx Error (${key})`,
        // attempt to cut off the raw data dump
        {
          error: parseEthersError(err.message),
          args,
        }
      )
    }

    // close any modals after the metamask Tx is sent
    if (opts.closeModal) {
      this.store.ui.closeModal()
    }

    // if we error'd the first call then bail now
    if (err || res === undefined) {
      return { err, res, tx }
    }

    // wait to be added to chain

    // execute the wait
    try {
      tx = res.wait ? await res.wait() : undefined
    } catch (e) {
      err = e
      this.controller.hud.showErrorToast(`Tx Error (${key})`, {
        error: err,
        args,
      })
      console.error({ key, err, args })
    }

    // clear the spinner if we set one
    if (pointer) {
      this.store.ui.removeTransaction(pointer)
    }

    // if we haven't error'd yet assume we're good
    if (!err) {
      this.controller.analytics.logContractEvent(key)
    }

    if (retry > 0) {
      console.log('completing a tx retry', retry)
    }

    return { err, tx, res }
  }

  getGas = async (key: string, boost: boolean = true) => {
    const whitelist = [
      'mint',
      'attack',
      'claim',
      'move',
      'equip',
      'testRegister',
      'healing',
      'fireball',
      'reduceArmor',
      'giantStrength',
      'iceArmor',
      'deploy',
      'craft',
      'setApprovalForAll',
      'startShield',
      'resetShield',
      'cancelShield',
      'transferFrom',
    ]

    if (whitelist.some((l) => key.startsWith(l))) {
      return await fetchGasPrice()
      const price = await this.store.wallet.provider?.getGasPrice() // + 10

      console.log('in gp func', price)

      if (price) {
        return boost ? BigNumber.from(price).add(10) : price
      }
    }

    return false
  }
}

const fetchGasPrice = async () => {
  const res = await fetch('https://gasstation-mumbai.matic.today/v2')
  const data = await res.json()

  return {
    gasPrice: ethers.utils.parseUnits(
      (parseInt(data.fast.maxFee) + 50).toString(),
      'gwei'
    ),
  }
}
