import { observer } from 'mobx-react'
import { useMemo } from 'react'
import { useAppContext } from '../../providers/AppContext'
import { Craft } from './Craft'
import { Inventory } from './Inventory'
import { Leaderboard } from './Leaderboard'
import { Notifications } from './Notifications'
import { SelectedLandInfo } from './SelectedLandInfo'
import { Settings } from './Settings'
import { SidebarSelector } from './SidebarSelector'

export const HUDSidebar = observer(() => {
  const { store } = useAppContext()

  const isFullHeightBar = useMemo(() => {
    const fullHeightBars = [
      'craft',
      'inventory',
      'leaderboard',
      'wallet',
      'settings',
    ]
    return fullHeightBars.includes(store.ui.hudSidebarOpen || '')
  }, [store.ui.hudSidebarOpen])

  if (!store.ui.worldLoaded) {
    return <></>
  }

  return (
    <div
      className={`fixed top-0 right-0 flex max-h-[100vh] w-[420px] flex-col bg-transparent ${
        isFullHeightBar && 'min-h-full'
      }`}
    >
      <SidebarSelector />
      {store.ui.hudSidebarOpen && (
        <div className="flex-vertical pb-4">
          <SidebarSwitch />
        </div>
      )}
    </div>
  )
})

const SidebarSwitch = observer(() => {
  const { store } = useAppContext()
  switch (store.ui.hudSidebarOpen) {
    case 'craft':
      return <Craft />
    case 'inventory':
      return <Inventory />
    case 'leaderboard':
      return <Leaderboard />
    case 'leaderboard':
      return <Leaderboard />
    case 'notifications':
      return <Notifications />
    case 'settings':
      return <Settings />
    case 'landInfo':
      return <SelectedLandInfo />

    default:
      break
  }
  return <></>
})
