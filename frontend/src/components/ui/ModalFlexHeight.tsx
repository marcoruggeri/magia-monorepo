import { Dialog } from '@headlessui/react'
import { observer } from 'mobx-react-lite'
import { FC, ReactNode } from 'react'
import { VerticalScroll } from '../common/VerticalScroll'

interface IProps {
  children?: ReactNode
  className?: string
  outerClassName?: string
  open: boolean
  onClose: () => void
}

export const ModalFlexHeight: FC<IProps> = observer(
  ({ children, className, outerClassName, open, onClose }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-filter"></div>
          <div
            className={`relative flex max-h-[86vh] w-[705px] flex-col  px-2 pt-16 pb-14 text-white ${
              outerClassName ? outerClassName : ''
            }`}
          >
            <span className="absolute top-[28px] left-0 bottom-[30px] w-full overflow-hidden rounded-t-[36px] rounded-b-[38px] bg-brown-1000/90"></span>
            <span
              className=" absolute top-0 left-0 block h-[58px] w-full"
              style={{
                backgroundImage: ` url("/assets/ui/modal-frame-top.svg")`,
                backgroundSize: '100% 100%',
              }}
            ></span>
            <span className="modal-frame__left"></span>
            <span className="modal-frame__right"></span>
            <span
              className=" absolute bottom-0 left-0  block h-[65px] w-full"
              style={{
                backgroundImage: ` url("/assets/ui/modal-frame-bottom.svg")`,
                backgroundSize: '100% 100%',
              }}
            ></span>

            <span
              className="absolute right-0 top-1/2 z-10 block h-[24px] w-[24px] translate-x-2 -translate-y-1/2"
              style={{ backgroundImage: "url('/assets/ui/jewel.svg')" }}
            ></span>
            <span
              className="absolute left-0 top-1/2 z-10 block h-[24px] w-[24px] -translate-x-2 -translate-y-1/2"
              style={{ backgroundImage: "url('/assets/ui/jewel.svg')" }}
            ></span>

            <VerticalScroll>
              <div className={`relative ${className ? className : ''}`}>
                {children}
              </div>
            </VerticalScroll>
          </div>
        </div>
      </Dialog>
    )
  }
)
