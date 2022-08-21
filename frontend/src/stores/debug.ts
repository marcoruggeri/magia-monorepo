import { FunctionFragment } from 'ethers/lib/utils'
import {
  action,
  autorun,
  makeObservable,
  observable,
  ObservableMap,
  reaction,
} from 'mobx'
import { AppStore } from './app'

export class DebugStore {
  @observable
  dataSource: 'local' | 'chain' = 'chain'

  @observable enabled = false
  @action toggleDebug = () => (this.enabled = !this.enabled)

  // store the vals
  @observable contractDebugInputVals: any[] = []
  // just used to represent the structure
  @observable contractDebugInputs: any[] = []
  contractsDebugInputNames = new ObservableMap<any, string>()
  contractsDebugInputTypes = new ObservableMap<any, string>()
  @action clearContractDebugInputs = () => {
    this.contractDebugInputs = []
  }

  // inits the structure for new inputs
  @action initContractDebugInputs = (func: FunctionFragment) => {
    const newInputs = func.inputs.map((i, idx) => {
      if (i.type === 'uint256[]' || i.type === 'string[]') {
        this.contractsDebugInputNames.set(idx, i.name)
        this.contractsDebugInputTypes.set(idx, i.type)
        return ['']
      }
      if (i.type === 'tuple') {
        return i.components.map((j, jdx) => {
          // console.log('settig', [idx, jdx], j.type, j.name)

          this.contractsDebugInputTypes.set([idx, jdx], j.type)
          this.contractsDebugInputNames.set([idx, jdx], j.name)
          return ['']
        })
      }

      this.contractsDebugInputTypes.set(idx, i.type)
      this.contractsDebugInputNames.set(idx, i.name)
      return ''
    })

    this.contractDebugInputs = newInputs
    this.contractDebugInputVals = newInputs
  }

  @action updateContractDebugInput = (
    val: string,
    place: [number, number | undefined]
  ) => {
    const newInputs = this.contractDebugInputs
    const [i, j] = place
    if (j) {
      newInputs[i][j] = val
    } else {
      newInputs[i] = val
    }
    this.contractDebugInputVals = [...newInputs]
  }

  constructor(private store: AppStore) {
    makeObservable(this)
    reaction(
      () => [this.enabled],
      () => this.saveToStorage()
    )
    this.loadFromStorage()
  }

  loadFromStorage = () => {
    try {
      const prevState: any = JSON.parse(
        window.localStorage.getItem('DebugStore') || ''
      )
      if (prevState) {
        this.enabled = prevState.enabled
      }
    } catch (e) {}
  }

  saveToStorage = () => {
    window.localStorage.setItem(
      'DebugStore',
      JSON.stringify({ enabled: this.enabled })
    )
  }
}
