import { observer } from 'mobx-react'
import { useState } from 'react'
import { ButtonRegular } from '../../ui/Button'

interface IInventoryItem {
  Image: JSX.Element
  quantity?: number
  useItem?: () => any
  actionLabel?: string
}

export const InventoryItem = observer(({ item }: { item: IInventoryItem }) => {
  const [open, setOpen] = useState(false)

  const actionButton = !!item.useItem && !!item.actionLabel

  const handleToggle = () => {
    setOpen((s) => !s)
    // if we were closed then leave it at that
    if (!open) {
      return
    }
  }

  if (item.quantity === 0) {
    return <></>
  }

  return (
    <div
      className={`flex flex-col items-center py-2 ${
        !open && 'hover:bg-brown-light/10'
      }`}
      onClick={handleToggle}
    >
      {item.Image}
      {!open || !actionButton ? (
        item.quantity ? (
          <p className="mt-1 text-center text-[20px] font-bold">
            x{item.quantity}
          </p>
        ) : (
          <></>
        )
      ) : (
        <ButtonRegular
          onClick={item.useItem}
          className="min-w-[70%] max-w-[70%]"
        >
          {item.actionLabel}{' '}
        </ButtonRegular>
      )}
    </div>
  )
})
