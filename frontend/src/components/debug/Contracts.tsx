import { Dialog } from '@headlessui/react'
import { FormatTypes, FunctionFragment, Interface } from 'ethers/lib/utils'
import { observer } from 'mobx-react-lite'
import { storeAnnotation } from 'mobx/dist/internal'
import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import { abis, ContractKeys } from '../../abi'
import { useAppContext } from '../../providers/AppContext'

// this doesn't do much yet. Just an experiment in accessing contract interfaces

type IOpenState = {
  [key in ContractKeys]: boolean
}

export interface IFunctionContract {
  contract: ContractKeys
  function: FunctionFragment
}

interface IContractsPanel {
  isOpen: boolean
  close: () => void
}

export const ContractsPanel: FC<IContractsPanel> = observer(
  ({ isOpen, close }) => {
    // type init for contract reducer
    const cfInit: IFunctionContract[] = []

    const { store } = useAppContext()

    // only load abi keys and contracts once
    const [abiKeys, setAbiKeys] = useState<ContractKeys[]>([])
    const [contractFunctions, setContractFunctions] = useState<
      IFunctionContract[]
    >([])

    const [selectedContract, setSelectedContract] = useState<ContractKeys>()

    useEffect(() => {
      setAbiKeys(Object.keys(abis) as ContractKeys[])
    }, [abis])

    useEffect(() => {
      setContractFunctions(
        abiKeys
          // create and interface for each abi
          .map((k) => new Interface(abis[k].abi))
          // grab the functions
          .map((i) => i.functions)
          // combine all functions into one array
          .reduce((acc, val, idx) => {
            Object.keys(val).forEach((k) =>
              // where the contract name is kept along with the function fragment
              acc.push({ contract: abiKeys[idx], function: val[k] })
            )
            return acc
          }, cfInit)
      )
    }, [abiKeys])

    // have to init the reducer start object early just for typescript
    // const openState: Partial<Record<ContractKeys, boolean>> = {}

    // const openInitialState = abiKeys.reduce((acc, val) => {
    //   acc[val] = false
    //   return acc
    // }, openState) as IOpenState

    // const [open, setOpen] = useState<IOpenState>(openInitialState)

    const [search, setSearch] = useState<string>('')

    // console.log({ contractFunctions })

    // maybe filter by contract
    const functions = useMemo(
      () =>
        selectedContract
          ? contractFunctions.filter((f) => f.contract === selectedContract)
          : contractFunctions,
      [selectedContract, search]
    )

    const filteredFunctions = useMemo(
      () =>
        search.length
          ? functions.filter((f) =>
              f.function.name.toLowerCase().includes(search.toLowerCase())
            )
          : functions,
      [selectedContract, search]
    )

    const [selectedFunc, setSelectedFunc] = useState<IFunctionContract>()

    const [inputVals, setInputVals] = useState<any[]>(
      selectedFunc
        ? selectedFunc.function.inputs.map((i) => {
            return i.type == 'tuple' ? [] : ''
          })
        : []
    )

    const resetInputState = () => {
      setInputVals(
        selectedFunc
          ? selectedFunc.function.inputs.map((i) => {
              return i.type == 'tuple' ? [] : ''
            })
          : []
      )
    }

    useEffect(() => {
      if (selectedFunc?.function) {
        store.debug.initContractDebugInputs(selectedFunc?.function)
      }
    }, [selectedFunc?.function])

    const [results, setResults] = useState([])

    return (
      <Dialog open={isOpen} onClose={close}>
        <div className="fixed inset-0 flex items-center justify-center bg-black/20">
          <div className="fixed top-[200px] m-0 w-[840px] rounded border-2    border-white/40 bg-slate-900 text-slate-200 shadow-md">
            <div className="flex border-b">
              {abiKeys.map((k) => (
                <button
                  onClick={() => setSelectedContract(k)}
                  key={k}
                  className={`flex-1 p-2 capitalize ${
                    k === selectedContract && 'text-[#16c6e3]'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2">
              <div>
                <input
                  type="text"
                  className="w-full border-b border-b-white bg-transparent px-4 py-3 text-white"
                  value={search}
                  autoFocus={true}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <div className="h-[calc(100vh_-_450px)] overflow-y-auto p-3">
                  <div className=" ">
                    {filteredFunctions.map((f) => {
                      const isSelected =
                        selectedFunc?.function.name == f.function.name &&
                        selectedFunc.contract == f.contract
                      return (
                        <p
                          key={`${Math.random() * 324523}`}
                          className={`flex cursor-pointer justify-between ${
                            isSelected ? 'text-orange-300' : ''
                          } `}
                          onClick={() => setSelectedFunc(f)}
                        >
                          <span>{f.function.name}</span>
                          <span className="opacity-80">{f.contract}</span>
                        </p>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="flex h-full flex-col border-l border-l-white">
                {selectedFunc && (
                  <>
                    <p
                      className="flex cursor-pointer  select-none items-end py-3 pl-4 pr-3"
                      onClick={resetInputState}
                    >
                      <span className="text-sm opacity-80">
                        {selectedFunc.contract} {'\\'}
                      </span>
                      <span className="ml-2 mr-4 text-2xl">
                        {selectedFunc.function.name}
                      </span>
                    </p>
                    <div className="flex h-[calc(100vh_-_450px)] flex-col overflow-y-auto p-4">
                      {store.debug.contractDebugInputs.map((i, idx) => {
                        if (Array.isArray(i)) {
                          // TODO: need to handle int[] case which is both and array of vals and a single field
                          return i.map((j, jdx) => (
                            <ContractInput
                              name={
                                store.debug.contractsDebugInputNames.get([
                                  idx,
                                  jdx,
                                ]) || ''
                              }
                              type={
                                store.debug.contractsDebugInputTypes.get([
                                  idx,
                                  jdx,
                                ]) || ''
                              }
                              value={
                                store.debug.contractDebugInputVals[idx][jdx]
                              }
                              onChange={(val) => {
                                store.debug.updateContractDebugInput(val, [
                                  idx,
                                  jdx,
                                ])
                              }}
                            />
                          ))
                        }
                        return (
                          <ContractInput
                            name={
                              store.debug.contractsDebugInputNames.get(idx) ||
                              ''
                            }
                            type={
                              store.debug.contractsDebugInputTypes.get(idx) ||
                              ''
                            }
                            value={store.debug.contractDebugInputVals[idx]}
                            onChange={(val) => {
                              store.debug.updateContractDebugInput(val, [
                                idx,
                                undefined,
                              ])
                            }}
                          />
                        )
                      })}

                      
                        <button
                          className="mt-auto w-full bg-orange-400 p-3 text-sm uppercase tracking-widest  text-slate-900"
                          onClick={async () => {
                            console.log(
                              'sending',
                              selectedFunc.contract,
                              selectedFunc.function.name,
                              [...store.debug.contractDebugInputVals.values()]
                            )

                            const res = await store.contract.dynamicCall(
                              selectedFunc.contract,
                              selectedFunc.function,
                              [...store.debug.contractDebugInputVals.values()]
                            )
                            console.log('result', res)
                          }}
                        >
                          Submit
                        </button>
                      
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    )
  }
)

interface IContractInput {
  name: string
  type: string
  value: string
  onChange: (val: any) => void
}

const ContractInput: FC<IContractInput> = observer(
  ({ name, type, value, onChange }) => {
    return (
      <p className="mb-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full  border-b border-b-white bg-transparent py-3 px-2  text-white selection:bg-orange-300 selection:text-slate-900 focus:border-b-orange-300 focus:text-orange-300 focus:outline-none"
          placeholder={`${name} (${type})`}
        />
      </p>
    )
  }
)
