import { ethers } from 'ethers'
import { Dialog } from '@headlessui/react'
import axios from 'axios'
import { observer } from 'mobx-react'
import { FC, useEffect, useState } from 'react'
import { seed } from '../../lib/utils/seed'
import { useAppContext } from '../../providers/AppContext'
import { Account } from '../../stores/wallet'
import { shortenAddress } from '../../util/shortenAddress'
import { ButtonCancel, ButtonPrimary, ButtonRegular } from '../ui/Button'
import { LoginManagerStep, LoginStepProps } from './LoginManager'
import Image from 'next/image'
import { WHITELIST_ENABLED } from '../../lib/constants'
import { useRouter } from 'next/router'

interface Props extends LoginStepProps {
  setSelectedAccount: (account: Account) => void
  selectedAccount?: Account
}

export const AccountSelector: FC<Props> = observer(
  ({ setStep, setSelectedAccount, selectedAccount }) => {
    const { store, api } = useAppContext()

    const { query } = useRouter()

    useEffect(() => {
      store.wallet.loadAccounts()
    }, [])

    const [isAlpha, setIsAlpha] = useState(false)

    useEffect(() => {
      // alpha wait override
      if (query.alpha && query.alpha === 'started') {
        return
      }

      // if (typeof window !== 'undefined') {
      //   if (window.location.hostname == 'alpha.magia.gg') {
      //     setIsAlpha(true)
      //   }
      // }
    }, [])

    // TODO: show hero info when address is selected

    return (
      <div className="mx-auto w-[564px]">
        <div className="flex justify-center  pb-2">
          <Image src="/assets/logo-big.png" width={129} height={94} />
        </div>
        <Dialog.Title className="mb-2 text-center font-serif text-[40px] font-bold tracking-tight text-green-120">
          Select an Account
        </Dialog.Title>

        <div>
          {/* {selectedAccount && <p>Address: {selectedAccount.address}</p>} */}
          {store.wallet.hasAccounts ? (
            <div>
              <div className="mx-auto max-h-[309px]  border-[2px] border-gold-200 pb-[6px]">
                {store.wallet.accounts.map((a, idx) => {
                  const isSelected = a.address === selectedAccount?.address
                  return (
                    <div
                      className={`pt-[6px] transition-all ${
                        isSelected ? 'px-2' : 'px-10 '
                      }`}
                      key={a.key.substring(0, 20)}
                    >
                      <button
                        className={`block w-full rounded-[3px] border p-2 font-semibold ${
                          isSelected ? 'border-gold-200' : 'border-gold-200/40'
                        }`}
                        onClick={() => setSelectedAccount(a)}
                      >
                        {idx + 1}. {shortenAddress(a.address)}
                      </button>
                    </div>
                  )
                })}
              </div>
              {selectedAccount && (
                <p className="my-2 text-center">
                  <span className="mr-2">Address:</span>
                  {selectedAccount.address}
                </p>
              )}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <ButtonCancel
                  disabled={!selectedAccount}
                  className="mt-auto "
                  onClick={() => setStep(LoginManagerStep.FORGET_ACCOUNT)}
                >
                  Forget
                </ButtonCancel>

                {!isAlpha ? (
                  <ButtonPrimary
                    disabled={!selectedAccount}
                    className="mt-2 w-full"
                    onClick={async () => {
                      if (selectedAccount) {
                        // setup the wallet
                        await store.wallet.selectAccount(selectedAccount)

                        // debug
                        // setStep(LoginManagerStep.TEST_BACKEND_CONTRACT)
                        // return

                        // if (process.env.NEXT_PUBLIC_WHITELIST_ENABLED) {
                        //   setStep(LoginManagerStep.CHECK_WHITELIST)
                        //   return
                        // }

                        // mint hero (or continue)
                        setStep(LoginManagerStep.BUILDING_WORLD)
                      }
                    }}
                  >
                    Go
                  </ButtonPrimary>
                ) : (
                  <p className="flex items-center justify-center">
                    Alpha starting 10/08 2PM UTC
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center">
              No accounts found. Generate one or import a private key
            </p>
          )}
        </div>
        <div>
          <h3 className="mt-10 mb-2 text-center font-serif text-[26px] font-bold tracking-tight text-green-120">
            or add an account
          </h3>
          <div className="flex space-x-5">
            <ButtonRegular
              className="flex-1"
              onClick={() => setStep(LoginManagerStep.GENERATE_ACCOUNT)}
            >
              Generate
            </ButtonRegular>
            <ButtonRegular
              className="flex-1"
              onClick={() => setStep(LoginManagerStep.IMPORT_ACCOUNT)}
            >
              Import
            </ButtonRegular>
          </div>
        </div>
      </div>
    )
  }
)
