import { Dialog } from '@headlessui/react'
import { FC, ReactNode } from 'react'
import { GoldFrame } from './GoldFrame'

interface Props {
  children?: ReactNode
}

export const GoldFramedDialog: FC<Props> = ({ children }) => {
  return (
    <Dialog.Panel className="fixed z-50 min-w-[420px] max-w-[700px] text-white">
      <GoldFrame className="gold-framed-dialog">{children}</GoldFrame>
    </Dialog.Panel>
  )
}
