import { Dialog } from '@headlessui/react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import { useAppContext } from '../../providers/AppContext'
import { unwrap } from '../../util/unwrap'
import { ButtonPrimary, ButtonTransparent } from '../ui/Button'
import { LoginManagerStep, LoginStepProps } from './LoginManager'

export const CheckWhitelist: FC<LoginStepProps> = observer(({ setStep }) => {
  const { api, store, controller } = useAppContext()
  const { query } = useRouter()

  // have we checked the whitelist yet?
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const checkWhitelist = async () => {
      // init the mint/register flow
      const heroes = store.contract.use('heroes')
      const isWhitelisted = await heroes.whitelist(store.wallet.address)

      if (
        unwrap.bigNumber(isWhitelisted) > 0 ||
        (query.whitelist && query.whitelist == 'bypass')
      ) {
        setStep(LoginManagerStep.BUILDING_WORLD)
      }

      setLoaded(true)
    }

    checkWhitelist()
  }, [])

  if (!loaded) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="heading-level-2 text-center">Checking Whitelist</p>
      </div>
    )
  }
  return (
    <div className="flex h-full flex-col justify-center">
      <Dialog.Title>
        <span className="mb-4 -mt-4 block text-center font-serif text-[40px] font-bold text-green-120">
          Join the Whitelist
        </span>
      </Dialog.Title>
      <div className="mx-auto mb-7 max-w-[540px] text-center text-[20px] leading-9">
        <p>Welcome to the Magia Alpha.</p>
        <p>Looks like your wallet isn't on the whitelist.</p>
        <p>Join the discord and submit your address to start playing.</p>
        <p className="mt-2">
          <span className="block text-2xl opacity-60">Address:</span>
          {store.wallet.address}
        </p>
      </div>
      <div className="flex items-stretch justify-center space-x-2">
        <ButtonTransparent
          className="  block min-w-[258px] "
          onClick={() => window.location.reload()}
        >
          Reload{' '}
        </ButtonTransparent>
        <a
          className=" disabled:opacity-70' inline-block min-w-[258px] rounded-[8px] border-2 border-[#E4D399] bg-gradient-to-b from-gold-70 to-gold-500 py-2 text-center hover:from-gold-50 hover:to-gold-300"
          href="https://discord.com/invite/6EmMzRwNqS"
          target="_blank"
        >
          {' '}
          Join the discord{' '}
        </a>
      </div>
    </div>
  )
})
