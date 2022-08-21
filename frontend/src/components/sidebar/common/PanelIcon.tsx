import Image from 'next/image'
import { FC, ReactNode } from 'react'
import closePanel from '../../../assets/icons/close.svg'
import { useAppContext } from '../../../providers/AppContext'

interface Props {
  children: ReactNode
}

export const PanelIcon: FC<Props> = ({ children }) => {
  const { store } = useAppContext()
  const hasImage = !!children
  return (
    <div className="absolute right-0 top-0 z-[20] h-[90px] w-[90px] translate-x-[40%] -translate-y-[45%] ">
      {hasImage && (
        <div className="image-block-hack relative overflow-hidden rounded-full backdrop-blur-md">
          <Image
            src="/assets/ui/frame-circle-thin.svg"
            width={90}
            height={90}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {children}
          </div>
        </div>
      )}

      <button
        className={`absolute top-[5px] ${
          !hasImage && 'translate-x-[24px] translate-y-1'
        }`}
        onClick={store.ui.closeHUDSidebar}
      >
        <img src={closePanel.src} alt="Close Panel" />
      </button>
    </div>
  )
}
