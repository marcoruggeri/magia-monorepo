import { observer } from 'mobx-react-lite'
import dynamic from 'next/dynamic'
import { StrictMode, useEffect, useState } from 'react'
import { HUD } from '../components/ui/HUD'
import { useAppContext } from '../providers/AppContext'
import { EquipBuilding } from './buildings/EquipBuilding'

const GameEngine = dynamic(() => import('../game/GameEngine'), {
  ssr: false,
})

export const GameContainer = observer(() => {
  const { store } = useAppContext()

  return (
    <>
      <BuildBar />
      <div id="game"></div>
      <GameEngine />

      <StrictMode>
        {store.initialised && (
          <>
            <EquipBuilding />

            <HUD />
          </>
        )}
      </StrictMode>
    </>
  )
})

const BuildBar = () => {
  const [frontend, setFrontend] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hostname == 'building.magia.gg') {
        setFrontend(true)
      }
    }
  }, [])

  return frontend ? <BuildMessage /> : <></>
}

const BuildMessage = () => (
  <div className="fixed top-0 left-0 z-[9999] w-full text-center text-sm">
    This is the latest development build of Magia. Please expect bugs.{' '}
    <a
      className="mr-2 text-brown-light"
      href="https://discord.gg/6EmMzRwNqS"
      target="_blank"
    >
      Join the discord
    </a>
    to stay up to date.
  </div>
)
