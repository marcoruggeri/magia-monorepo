import { Switch } from '@headlessui/react'
import { observer } from 'mobx-react'
import Image from 'next/image'
import { useAppContext } from '../../providers/AppContext'
import { ButtonRegular } from '../ui/Button'
import { SidebarContainer } from './common/SidebarContainer'
import { SidebarHeader } from './common/SidebarHeader'

export const Settings = observer(() => {
  const { store } = useAppContext()

  const killHero = async () => {
    if (
      !window.confirm("Are you sure? You won't be able to use this hero again.")
    ) {
      return
    }
    const heroes = store.contract.useSigned('heroes')
    if (store.player.hero) {
      await heroes.transferFrom(
        store.wallet.address,
        '0x0000000000000000000000000000000000000001',
        store.player.hero?.id,
        { spinnerLabel: 'killing hero' }
      )
      window.location.reload()
    }
  }

  return (
    <SidebarContainer>
      <div className="pr-3">
        <SidebarHeader
          title="Settings"
          description="Currently only for debugging. Proceed with caution!"
          Icon={() => (
            <Image
              src="/assets/icons/settings-icon.svg"
              width={40}
              height={40}
              className="mt-2 block"
            />
          )}
        />
        <div className="flex items-center justify-center border-b border-b-white/50 pb-2 text-center text-[20px] font-bold">
          Debug
          <span>
            <Switch.Group>
              <div className=" pl-4 pt-2 ">
                <Switch
                  checked={store.debug.enabled}
                  onChange={store.debug.toggleDebug}
                  className={`${
                    store.debug.enabled ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      store.debug.enabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </Switch.Group>
          </span>
        </div>

        <div className="px-5 pt-5">
          <p>
            Kill your hero by transferring to a null address. This will end your
            game.
          </p>
          <ButtonRegular className="mt-4" onClick={() => killHero()}>
            KillHero
          </ButtonRegular>
        </div>
      </div>
    </SidebarContainer>
  )
})
