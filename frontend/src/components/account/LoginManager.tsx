import { FC, useEffect, useState } from 'react'
import { useAppContext } from '../../providers/AppContext'
import { Account } from '../../stores/wallet'
import { ButtonPrimary } from '../ui/Button'
import { ModalFlexHeight } from '../ui/ModalFlexHeight'
import { ProgressBar } from '../ui/ProgressBar'
import { AccountSelector } from './AccountSelector'
import { BuildingWorld } from './BuildingWorld'
import { CheckWhitelist } from './CheckWhitelist'
import { FetchHeroes } from './FetchHeroes'
import { ForgetAccount } from './ForgetAccount'
import { GenerateAccount } from './GenerateAccount'
import { ImportPrivateKey } from './ImportPrivateKey'
import { MintHero } from './MintHero'
import { RegisterHero } from './RegisterHero'
import { TestBackEndContract } from './TestBackendContract'

export const enum LoginManagerStep {
  NONE,
  FETCH_HEROES,
  SELECT_ACCOUNT,
  GENERATE_ACCOUNT,
  FORGET_ACCOUNT,
  IMPORT_ACCOUNT,
  CHECK_WHITELIST,
  MINT_HERO,
  REGISTER_HERO,
  TEST_BACKEND_CONTRACT,
  BUILDING_WORLD,
  COMPLETE,
  TERMINATED,
  ERROR,
}

export const LoginManager = () => {
  const [step, setStep] = useState(LoginManagerStep.NONE)

  return (
    <ModalFlexHeight
      open={step !== LoginManagerStep.COMPLETE}
      onClose={() => true}
      className="pb-8"
    >
      <LoginManagerContent step={step} setStep={setStep} />
    </ModalFlexHeight>
  )
}

interface Props {
  step: LoginManagerStep
  setStep: (step: LoginManagerStep) => void
}

const LoginManagerContent: FC<Props> = ({ step, setStep }) => {
  const { store, controller } = useAppContext()

  // if we've just minted we should auto-reg the hero
  const [autoRegister, setAutoRegister] = useState(false)

  // the account that we'll load if the user confirms it
  const [selectedAccount, setSelectedAccount] = useState<Account>()

  useEffect(() => {
    return () => {
      controller.map.panToNextOwnLand()
    }
  }, [])

  if (
    step === LoginManagerStep.NONE ||
    step === LoginManagerStep.FETCH_HEROES
  ) {
    return <FetchHeroes setStep={setStep} />
  } else if (step === LoginManagerStep.SELECT_ACCOUNT) {
    return (
      <AccountSelector
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        setStep={setStep}
      />
    )
  } else if (step === LoginManagerStep.GENERATE_ACCOUNT) {
    return (
      <GenerateAccount
        setStep={setStep}
        setSelectedAccount={setSelectedAccount}
      />
    )
  } else if (step === LoginManagerStep.FORGET_ACCOUNT && selectedAccount) {
    return <ForgetAccount setStep={setStep} account={selectedAccount} />
  } else if (step === LoginManagerStep.IMPORT_ACCOUNT) {
    return (
      <ImportPrivateKey
        setStep={setStep}
        setSelectedAccount={setSelectedAccount}
      />
    )
  } else if (step === LoginManagerStep.MINT_HERO) {
    return (
      <MintHero
        setStep={(step: LoginManagerStep) => {
          setAutoRegister(true)
          setStep(step)
        }}
      />
    )
  } else if (step === LoginManagerStep.BUILDING_WORLD) {
    return <BuildingWorld setStep={setStep} />
  } else if (step === LoginManagerStep.CHECK_WHITELIST) {
    return <CheckWhitelist setStep={setStep} />
  } else if (step === LoginManagerStep.TEST_BACKEND_CONTRACT) {
    return <TestBackEndContract />
  } else if (step === LoginManagerStep.REGISTER_HERO) {
    return <RegisterHero setStep={setStep} autoRegister={autoRegister} />
  }

  return (
    <>
      <ButtonPrimary onClick={() => setStep(LoginManagerStep.COMPLETE)}>
        Go
      </ButtonPrimary>
      <ProgressBar label="Exp: 1600 / 3200" value={50} />
    </>
  )
}

export interface LoginStepProps {
  setStep: (step: LoginManagerStep) => void
}
