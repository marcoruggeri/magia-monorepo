import { ethers } from 'ethers'
import { FC, useEffect, useState } from 'react'
import { useAppContext } from '../../providers/AppContext'
import { Account } from '../../stores/wallet'
import { ButtonCancel, ButtonRegular } from '../ui/Button'
import { LoginManagerStep, LoginStepProps } from './LoginManager'

interface Props extends LoginStepProps {
  account: Account
}

export const ForgetAccount: FC<Props> = ({ setStep, account }) => {
  const { store } = useAppContext()

  const DEFAULT_KEY_TEXT = 'Click to copy'
  const [keyText, setKeyText] = useState(DEFAULT_KEY_TEXT)

  const doCopy = () => {
    navigator.clipboard.writeText(account.key)
    setKeyText('Copied!')
    setTimeout(() => {
      setKeyText(DEFAULT_KEY_TEXT)
    }, 1500)
  }

  const handleOkay = () => {
    if (
      window.confirm(
        'ATTENTION: Are you absolutely sure you want to forget this account? This is not reversible unless you have saved the private key'
      )
    ) {
      store.wallet.forgetAccount(account)
      setStep(LoginManagerStep.SELECT_ACCOUNT)
    }
  }

  return (
    <div>
      <h2>Forget a private key</h2>
      <p className="mt-2">
        Please make a note of your key somewhere safe. If you will ever want to
        re-import it later.
      </p>

      <div className="group relative my-2 break-all border p-2">
        <p>{account.key}</p>
        <div
          className="absolute inset-0 hidden cursor-pointer select-none items-center justify-center backdrop-blur-sm backdrop-filter group-hover:flex"
          onClick={doCopy}
        >
          <span>{keyText}</span>
        </div>
      </div>
      <div className="flex justify-center">
        <ButtonRegular onClick={handleOkay}>Okay</ButtonRegular>
        <ButtonCancel onClick={() => setStep(LoginManagerStep.SELECT_ACCOUNT)}>
          Cancel
        </ButtonCancel>
      </div>
    </div>
  )
}
