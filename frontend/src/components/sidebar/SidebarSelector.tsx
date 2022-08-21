import Image from 'next/image'
import { FC } from 'react'
import { useAppContext } from '../../providers/AppContext'

export type SidebarId = keyof typeof sidebars
const sidebars = {
  craft: { label: 'Craft', icon: '/assets/icons/sidebar/craft.svg' },
  inventory: {
    label: 'Inventory',
    icon: '/assets/icons/sidebar/inventory.svg',
  },
  leaderboard: {
    label: 'Leaderboard',
    icon: '/assets/icons/sidebar/leaderboard.svg',
  },
  // wallet: { label: 'Wallet', icon: '/assets/icons/sidebar/wallet.svg' },
  settings: { label: 'Settings', icon: '/assets/icons/sidebar/settings.svg' },
  notifications: {
    label: 'Notifications',
    icon: '/assets/icons/sidebar/notifications.svg',
  },
}

export const SidebarSelector: FC = () => {
  const { store } = useAppContext()

  const handleClick = (id: SidebarId) => {
    if (store.ui.hudSidebarOpen === id) {
      store.ui.closeHUDSidebar()
      return
    }

    store.ui.openHUDSidebar(id)
  }

  return (
    <div className="sidebar__panel-switcher flex flex-none justify-end space-x-3 pt-4 pb-6 pr-4">
      {(Object.keys(sidebars) as SidebarId[]).map((id) => {
        const sidebar = sidebars[id]
        return (
          <button
            key={sidebar.label}
            className="group relative pb-6"
            onClick={() => handleClick(id)}
          >
            <Image
              src={sidebar.icon}
              width={56}
              height={56}
              alt={sidebar.label}
            />
            <span className="label-sm absolute left-[50%] -bottom-2 block -translate-x-1/2 opacity-0">
              {sidebar.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
