import { observer } from 'mobx-react'
import Image from 'next/image'
import { useAppContext } from '../../providers/AppContext'
import { SidebarContainer } from './common/SidebarContainer'
import { SidebarHeader } from './common/SidebarHeader'

export const Notifications = observer(() => {
  const { store } = useAppContext()

  return (
    <SidebarContainer>
      <div className="pr-3">
        <SidebarHeader
          title="Notifications"
          description=""
          Icon={() => (
            <Image
              src="/assets/icons/notifications-icon.svg"
              width={40}
              height={40}
              className="mt-2 block"
            />
          )}
        />
        <p className="border-b border-b-white/50 pb-2 text-center text-[20px] font-bold">
          Errors
        </p>
        {store.ui.notifications.map((n, idx) => (
          <p key={idx}>{n.message}</p>
        ))}
      </div>
    </SidebarContainer>
  )
})
