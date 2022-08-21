import Head from 'next/head'
import { useState, useEffect, StrictMode } from 'react'

import { observer } from 'mobx-react-lite'
import { useAppContext } from '../providers/AppContext'
import { ContractsPanel } from '../components/debug/Contracts'
import { useHotkeys } from 'react-hotkeys-hook'

import { GameContainer } from '../game/GameContainer'
import { LoginManager } from '../components/account/LoginManager'

const Home = observer(() => {
  const {
    store: { wallet },
    controller,
  } = useAppContext()

  const [contractsOpen, setContractsOpen] = useState(false)
  const closeContracts = () => setContractsOpen(false)

  useHotkeys('ctrl+p', (e) => {
    if (!contractsOpen) setContractsOpen(true)
    e.preventDefault()
  })

  return (
    <div>
      <Head>
        <title>Magia</title>
      </Head>

      <GameContainer />
      <LoginManager />
      <ContractsPanel isOpen={contractsOpen} close={closeContracts} />
    </div>
  )
})

export default Home
