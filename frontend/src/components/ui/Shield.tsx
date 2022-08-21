import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../providers/AppContext'
import { Dialog } from '../../types/ui/Dialogs'
import { ButtonRegular, ButtonTransparent } from './Button'

export const Shield = observer(() => {
  const { store, controller, api } = useAppContext()

  useEffect(() => {
    if (!store.player.hasShieldActive) {
      controller.map.startShieldUnits()
    }
  }, [store.player.hasShieldActive])

  return (
    <div className="hero-bar-container fixed left-6 top-5">
      <div className="p-5">
        {store.player.hasShieldActive ? <ShieldEdit /> : <ShieldSetup />}
      </div>
    </div>
  )
})

const ShieldSetup = observer(() => {
  const { store, controller } = useAppContext()

  const [duration, setDuration] = useState(1)
  const count = store.ui.unitsToShield.length
  const cost = 100 + count * 7 * duration

  const handleStart = async () => {
    await controller.map.activateShield(duration)
    store.ui.closeDialog(Dialog.SHIELD_OPTIONS)
  }

  return (
    <>
      <p>Shield setup</p>
      <div className="flex">
        <p>Duration</p>
        <input
          className="mx-2"
          type="range"
          min={1}
          max={24}
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
        />
        <p>{duration} hours</p>
      </div>

      <div>
        <p>
          Units selected: <span>{count}</span>
        </p>

        <p>
          Cost: <span>{cost}</span>
        </p>
      </div>
      <div className="flex">
        <ButtonRegular onClick={handleStart}>Start</ButtonRegular>
        <ButtonTransparent
          onClick={() => {
            controller.map.cancelShieldUnits()
            store.ui.closeDialog(Dialog.SHIELD_OPTIONS)
          }}
        >
          Cancel
        </ButtonTransparent>
      </div>
    </>
  )
})

const ShieldEdit = () => {
  const { store, controller } = useAppContext()
  const [duration, setDuration] = useState(1)
  const count = store.player.totalUnitsShielded
  const cost = 100 + count * 7 * duration

  return (
    <>
      <div>
        <div className="mb-3 flex">
          <ButtonRegular
            onClick={async () => {
              store.contract.diamond.cancelShield(store.player.heroId)
              store.ui.closeDialog(Dialog.SHIELD_OPTIONS)
            }}
          >
            Disable Shield
          </ButtonRegular>
          <p className="pl-3">No energy will be refunded</p>
        </div>
        <div className="flex">
          <ButtonRegular
            onClick={async () => {
              await controller.map.resetShield(duration)
              store.ui.closeDialog(Dialog.SHIELD_OPTIONS)
            }}
          >
            Reset Shield
          </ButtonRegular>
          <div className="ml-3">
            <p>Duration</p>
            <input
              className="mx-2"
              type="range"
              min={1}
              max={24}
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            />
            <p>{duration} hours</p>
          </div>
        </div>
        <div>
          <p>
            Units selected: <span>{count}</span>
          </p>

          <p>
            Cost: <span>{cost}</span>
          </p>
        </div>
        <ButtonTransparent
          onClick={() => {
            store.ui.closeDialog(Dialog.SHIELD_OPTIONS)
          }}
        >
          Cancel
        </ButtonTransparent>
      </div>
    </>
  )
}
