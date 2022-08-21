import { observer } from 'mobx-react'
import { useAppContext } from '../../providers/AppContext'
import { ButtonRegular } from './Button'

export const WalletStatus = observer(() => {
  const {
    store: { wallet },
    controller: { user },
  } = useAppContext()

  const maybeForgetWallet = () => {
    const quit = confirm('Forget stored wallet and reload?')
    if (quit) {
      // wallet.clearSavedWallet()
      window.location.reload()
    }
  }

  const handleWalletClick = wallet.connected ? maybeForgetWallet : user.init

  return (
    <div className={`col-start-2 flex items-center justify-end pr-4`}>
      <ButtonRegular
        onClick={handleWalletClick}
        className={`flex flex-col items-center justify-center border-2 border-brown-primary bg-brown-light font-sans font-bold text-yellow-primary ${
          wallet.connected ? 'p-1 text-sm' : 'p-2 text-xl'
        }`}
      >
        {wallet.connected ? (
          <>
            <div className="flex items-center">
              {wallet.logo && (
                <div
                  className="my-1 mr-2 block w-6"
                  dangerouslySetInnerHTML={{ __html: wallet.logo }}
                ></div>
              )}
              <span>{wallet.addressShort}</span>
            </div>
          </>
        ) : (
          <span className="uppercase">connect</span>
        )}
      </ButtonRegular>
    </div>
  )
})
