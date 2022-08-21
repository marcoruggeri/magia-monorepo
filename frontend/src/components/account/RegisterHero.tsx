import { Dialog } from '@headlessui/react'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { useAppContext } from '../../providers/AppContext'
import { ButtonPrimary } from '../ui/Button'
import { LoginManagerStep, LoginStepProps } from './LoginManager'

interface Props extends LoginStepProps {
  autoRegister: boolean
}

export const RegisterHero: FC<Props> = observer(({ setStep, autoRegister }) => {
  const { api, store, controller } = useAppContext()

  // have we checked that a hero wasn't already minted?
  const [loaded, setLoaded] = useState(false)

  const doRegister = async () => {
    const {
      err,
      res: { landId },
    } = await api.hero.register()
    if (err || !landId) {
      return
    }

    setStep(LoginManagerStep.COMPLETE)

    controller.map.panToLandId(landId)
  }

  useEffect(() => {
    const checkHero = async () => {
      // init the mint/register flow
      const isRegistered = await api.hero.isPlayerHeroRegistered()

      if (isRegistered) {
        setStep(LoginManagerStep.COMPLETE)
      } else if (autoRegister) {
        // maybe auto reg
        await doRegister()
      }

      setLoaded(true)
    }

    checkHero()
  }, [])

  if (!loaded) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="heading-level-2 text-center">
          Checking if hero is registered to the map...
        </p>
      </div>
    )
  }
  return (
    <div className="flex h-full flex-col justify-center">
      <Dialog.Title>
        <span className="mb-4 -mt-4 block text-center font-serif text-[40px] font-bold text-green-120">
          Register Your Hero
        </span>
      </Dialog.Title>
      <div className="mx-auto mb-7 max-w-[520px] text-center text-[20px] leading-9">
        <p>
          Congratulations you've minted a hero{' '}
          <span className="text-gold-100">{store.player.hero!.name}</span>.
        </p>
        <p>
          Register{' '}
          <span className="text-gold-100">{store.player.hero!.name} </span> to
          the map to start playing!
        </p>
      </div>
      <div className="flex justify-center">
        <ButtonPrimary onClick={doRegister}>Register</ButtonPrimary>
      </div>
    </div>
  )
})
