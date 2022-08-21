import { ethers } from 'ethers'
import { FC, useState } from 'react'
import { useAppContext } from '../../providers/AppContext'
import { Account } from '../../stores/wallet'
import { ButtonCancel, ButtonRegular } from '../ui/Button'
import { LoginManagerStep, LoginStepProps } from './LoginManager'

interface Props extends LoginStepProps {
  setSelectedAccount: (account: Account) => void
}

export const ImportPrivateKey: FC<Props> = ({
  setStep,
  setSelectedAccount,
}) => {
  const { store } = useAppContext()
  const [key, setKey] = useState('')
  const [feedback, setFeedback] = useState('')

  const handleSubmit = () => {
    if (key) {
      if (store.wallet.isKnownKey(key)) {
        setFeedback('account already imported')
        return
      }

      let newWallet: ethers.Wallet

      try {
        // use ethers to validate the key before we accept it
        // even though we'll create the wallet again in the store
        newWallet = new ethers.Wallet(key)
        setFeedback('')
        const account = store.wallet.addAccountFromKey(key)
        setSelectedAccount(account)
        setStep(LoginManagerStep.SELECT_ACCOUNT)
      } catch (e: any) {
        console.log('bad wallet', e.reason)
        if (e.reason) {
          setFeedback(e.reason)
        }
      }
    }
  }

  return (
    <div>
      <h2 className="heading-level-2 text-center">Import Your Burner Wallet</h2>
      <div className="pt-2">
        <p>
          <span className="text-3xl text-red-400">
            Attention: This should only be used to move your burner wallet keys
            exported from Magia. Never provide your actual wallet keys to this
            or any website!
          </span>
        </p>
        <p className="py-3">
          <span className="text-gold-100">Disclaimer</span> This feature is a
          useful tool for the alpha game where we are regularly using different
          domains for testing and it's necessary to move your account around.
          It's not part of the long term vision, we don't condone copy and
          pasting private keys into random websites.
        </p>
        <p>Paste the private key here to import a wallet</p>
        {feedback && <p className="text-brown-light">{feedback}</p>}
        <textarea
          className="my-2 h-24 w-full resize-none border bg-transparent p-4"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        ></textarea>
        <div>
          <ButtonRegular onClick={handleSubmit}>Import</ButtonRegular>
          <ButtonCancel
            onClick={() => setStep(LoginManagerStep.SELECT_ACCOUNT)}
          >
            Cancel
          </ButtonCancel>
        </div>
      </div>
    </div>
  )
}
