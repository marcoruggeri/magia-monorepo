import { Dialog } from '@headlessui/react'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { $enum } from 'ts-enum-util'
import { Resource } from '../../../enums'
import { useAppContext } from '../../providers/AppContext'
import { ModalDialog } from '../../types/ui/Dialogs'
import { ButtonRegular, ButtonTransparent } from './Button'
import { ModalFlexHeight } from './ModalFlexHeight'
import { ResourceImage } from './ResourceImage'

export const Transmute = observer(() => {
  const { store, controller } = useAppContext()

  const [quantity, setQuantity] = useState(2)

  const [outputResource, setOutputResrouce] = useState<Resource>(Resource.GOLD)

  const cost = 200 + quantity
  const output = quantity / 2
  const max = (store.player.hero?.energy || 0) - 200

  const handleStart = async () => {
    await controller.magic.castTransmute(outputResource, quantity)
  }

  return (
    <ModalFlexHeight
      // open={true}
      open={store.ui.modalOpen === ModalDialog.TRANSMUTE}
      onClose={() => store.ui.closeModal()}
      className="pb-2"
    >
      <Dialog.Title>
        <span className="mb-4 block text-center font-serif text-[40px] font-bold text-green-120">
          Transmute
        </span>
      </Dialog.Title>
      <p className="text-center text-lg">Formula</p>
      <p className="mb-4 text-center">
        (Base cost 200 Energy) + 2 Energy for 1 Resource
      </p>

      <div className="my-2 mb-4 text-center">
        <p className="mb-2 text-lg">Input</p>
        <input
          className="mx-2 w-[200px]"
          type="range"
          min={2}
          max={max}
          step={2}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
      </div>
      <div className="text-center">
        <p className="mb-2 text-lg">Output</p>
        <div className="flex justify-center ">
          {$enum(Resource).map((r) => {
            const selected = outputResource === r
            const cls = selected ? 'border-gold-100' : 'border-white/30'
            return (
              <div
                key={r}
                className={`border-2 p-4 ${cls}`}
                onClick={() => setOutputResrouce(r)}
              >
                <ResourceImage resource={r} />
              </div>
            )
          })}
        </div>
        <div className="my-4">
          <p>
            {output}{' '}
            <span className="capitalize">
              {Resource[outputResource].toLowerCase()}
            </span>
          </p>
          <p className="text-sm">for</p>
          <p> {cost} Energy</p>
        </div>
      </div>

      <div className="mt-2 flex justify-center space-x-2">
        <ButtonRegular onClick={handleStart}>Cast</ButtonRegular>
        <ButtonTransparent onClick={() => store.ui.closeModal()}>
          Cancel
        </ButtonTransparent>
      </div>
    </ModalFlexHeight>
  )
})
