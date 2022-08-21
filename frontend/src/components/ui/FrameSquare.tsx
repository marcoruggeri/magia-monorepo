import { Dialog } from '@headlessui/react'
import { observer } from 'mobx-react-lite'
import { FC, ReactNode } from 'react'

interface IProps {
  children?: ReactNode
  className?: string
  open: boolean
  onClose: () => void
}

export const FrameSquare: FC<IProps> = observer(
  ({ children, className, open, onClose }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40  backdrop-filter"></div>
          <div
            style={{ backgroundImage: "url('/assets/ui/frame-square.svg')" }}
            className={`relative flex h-[692px] w-[705px]  flex-col  bg-contain bg-center bg-no-repeat p-8 text-white ${
              className ? className : ''
            }`}
          >
            <span
              className="absolute right-0 top-1/2 block h-[24px] w-[24px] -translate-y-1/2"
              style={{ backgroundImage: "url('/assets/ui/jewel.svg')" }}
            ></span>
            <span
              className="absolute left-0 top-1/2 block h-[24px] w-[24px] -translate-y-1/2"
              style={{ backgroundImage: "url('/assets/ui/jewel.svg')" }}
            ></span>
            {children}
          </div>
        </div>
      </Dialog>
    )
  }
)
