import { Dialog } from '@headlessui/react'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { delay } from '../../lib/utils/delay'
import { useAppContext } from '../../providers/AppContext'
import { ButtonPrimary, ButtonRegular } from '../ui/Button'
import { ProgressBar } from '../ui/ProgressBar'
import { LoginManagerStep, LoginStepProps } from './LoginManager'

export const BuildingWorld: FC<LoginStepProps> = observer(({ setStep }) => {
  const { store } = useAppContext()
  const [description, setDescription] = useState('')

  // total = loading contracts + load land + load units
  const totalSteps = store.contract.contractsCount
  const [contractProgress, setContractProgress] = useState(1)
  const [worldProgress, setWorldProgress] = useState(false)
  const [economyLoaded, setEconomyLoaded] = useState(false)

  const updateProgress = (msg: string) => {
    setContractProgress((p) => p + 1)
    setDescription(msg)
  }

  useEffect(() => {
    store.contract.loadSignedContracts(updateProgress)
  }, [])

  useEffect(() => {
    if (contractProgress >= totalSteps && worldProgress && economyLoaded) {
      store.ui.setWorldLoaded()
      setStep(LoginManagerStep.MINT_HERO)
    }
  }, [contractProgress, worldProgress, economyLoaded])

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Dialog.Title className="heading-level-2 mb-4 text-center">
        Setting up the Game
      </Dialog.Title>
      <div className="">
        <p className="mt-4 mb-2 text-center font-serif">Contracts</p>
        <ProgressBar
          label={contractProgress < totalSteps ? description : 'Done'}
          value={contractProgress}
          max={totalSteps}
          className="min-w-[480px]"
        />
        <LoadLands done={() => setWorldProgress(true)} />
        <LoadEconomy done={() => setEconomyLoaded(true)} />
      </div>
    </div>
  )
})

interface Props {
  done: () => void
}
const LoadLands: FC<Props> = ({ done }) => {
  const [index, setIndex] = useState(0)
  const [progessLabel, setProgressLabel] = useState('')

  const { api, store } = useAppContext()

  useEffect(() => {
    const loadBlocks = async () => {
      for (let i = 0; i < 10; i++) {
        setProgressLabel(`Exploring Land ${i + 1},000/10,000`)
        const start = i * 1000
        await api.land.fetchRange(start, start + 1000)
        await delay(150)
        setIndex(i + 1)
      }
      store.land.initDone()

      setProgressLabel(`Units`)
      await api.unit.getBatchByIds(store.unit.waitingToFetchIds)
      store.unit.waitingToFetchIds = []
      setIndex((i) => i + 1)

      store.unit.initDone()

      done()
    }

    loadBlocks()
  }, [])

  const max = 11

  return (
    <div>
      <p className="mt-4 mb-2 text-center font-serif">Map</p>
      <ProgressBar
        className="min-w-[480px]"
        label={index < max ? progessLabel : 'Done'}
        value={index}
        max={max}
      />
    </div>
  )
}

const LoadEconomy: FC<Props> = ({ done }) => {
  const [index, setIndex] = useState(0)
  const [progessLabel, setProgressLabel] = useState('Waiting for contracts')

  const { api, store } = useAppContext()

  useEffect(() => {
    const fetchData = async () => {
      setProgressLabel(`Exploring Buildings`)
      await api.catalog.fetchBuildings()
      setIndex((i) => i + 1)

      setProgressLabel(`Discovering Units`)
      await api.catalog.fetchUnits()
      setIndex((i) => i + 1)

      setProgressLabel(`Learning Spells`)
      await api.catalog.fetchSpells()
      setIndex((i) => i + 1)

      setProgressLabel(`Browsing Inventory Catalog`)
      await api.inventory.getAll()
      setIndex((i) => i + 1)

      store.catalog.initDone()

      done()
    }
    setTimeout(() => {
      fetchData()
    }, 4000)
  }, [])

  const max = 4

  return (
    <div>
      <p className="mt-4 mb-2 text-center font-serif">World</p>
      <ProgressBar
        className="min-w-[480px]"
        label={index < max ? progessLabel : 'Done'}
        value={index}
        max={max}
      />
    </div>
  )
}
