import { observer } from 'mobx-react'
import Image from 'next/image'
import { FC, useEffect } from 'react'
import { useAppContext } from '../../providers/AppContext'
import { LoginManagerStep, LoginStepProps } from './LoginManager'

export const FetchHeroes: FC<LoginStepProps> = observer(({ setStep }) => {
  const { api } = useAppContext()

  useEffect(() => {
    const doFetch = async () => {
      await api.hero.fetchHeroes()
      setStep(LoginManagerStep.SELECT_ACCOUNT)
    }

    doFetch()
  }, [])

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex animate-pulse justify-center pt-4 pb-2">
        <Image src="/assets/logo-big.png" width={129} height={94} />
      </div>
    </div>
  )
})
