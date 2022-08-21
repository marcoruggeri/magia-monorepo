import Image from 'next/image'
import { FC } from 'react'
import { Children } from '../../../magiaTypes'

interface Props extends Children {
  width?: number
}

export const FrameCircleThin: FC<Props> = ({ width, children }) => {
  if (!width) {
    width = 90
  }
  const childWidth = width - 22

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-full backdrop-blur-md"
      style={{ width, height: width }}
    >
      <div className="absolute inset-0 ">
        <Image
          src={'/assets/ui/frame-circle-thin.svg'}
          width={width}
          height={width}
        />
      </div>
      <div className="" style={{ width: childWidth, height: childWidth }}>
        {children}
      </div>
    </div>
  )
}
