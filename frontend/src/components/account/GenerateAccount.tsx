import { ethers } from 'ethers'
import { FC, useEffect, useState } from 'react'
import { useAppContext } from '../../providers/AppContext'
import { Account } from '../../stores/wallet'
import { ButtonRegular } from '../ui/Button'
import { LoginManagerStep, LoginStepProps } from './LoginManager'

interface Props extends LoginStepProps {
  setSelectedAccount: (account: Account) => void
}

export const GenerateAccount: FC<Props> = ({ setSelectedAccount, setStep }) => {
  const { store } = useAppContext()

  const DEFAULT_KEY_TEXT = 'Click to copy'
  const [keyText, setKeyText] = useState(DEFAULT_KEY_TEXT)
  const [newKey, setNewKey] = useState('')

  const doCopy = () => {
    navigator.clipboard.writeText(newKey)
    setKeyText('Copied!')
    setTimeout(() => {
      setKeyText(DEFAULT_KEY_TEXT)
    }, 1500)
  }

  useEffect(() => {
    const newWallet = ethers.Wallet.createRandom()
    const key = newWallet.privateKey
    setNewKey(key)
    const account = store.wallet.addAccountFromKey(key)
    setSelectedAccount(account)
  }, [])

  return (
    <div>
      <h2 className="heading-level-2 text-center">Save your private key</h2>
      <p>
        <span className="text-3xl text-red-400">
          Attention: Never disclose your private key to anyone. With this key
          they can access your account and make transfers.
        </span>
      </p>
      <p className="mt-2">
        Please make a note of your key somewhere safe. You can re-import it
        later. Your private key will be stored in your browser cache. If you
        clear your cache or switch browsers this memeory will be lost.
      </p>

      <div className="group relative my-2 break-all border p-2">
        <p>{newKey}</p>
        <div
          className="absolute inset-0 hidden cursor-pointer select-none items-center justify-center backdrop-blur-sm backdrop-filter group-hover:flex"
          onClick={doCopy}
        >
          <span>{keyText}</span>
        </div>
      </div>
      <div className="flex justify-center">
        <ButtonRegular onClick={() => setStep(LoginManagerStep.SELECT_ACCOUNT)}>
          Continue
        </ButtonRegular>
      </div>
    </div>
  )
}
