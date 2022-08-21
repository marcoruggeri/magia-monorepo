import { FC } from 'react'

import { Children } from '../../../../magiaTypes'

export const SidebarContainer: FC<Children> = ({ children }) => {
  return (
    <div className="flex-vertical w-[393px] rounded-tr-[20px] rounded-tl-[30px] bg-brown-800/90">
      <div className="flex-vertical relative -mt-3 -mb-3 pt-[30px] pb-[18px]">
        <span
          className=" absolute top-0 left-0 block h-[28px] w-full"
          style={{
            backgroundImage: ` url("/assets/ui/sidebar-frame-top.svg")`,
            backgroundSize: '100% 100%',
          }}
        ></span>
        <span className="sidebar-frame__left"></span>
        <span className="sidebar-frame__right"></span>
        <span
          className=" absolute bottom-0 left-0  block h-[26px] w-full"
          style={{
            backgroundImage: ` url("/assets/ui/sidebar-frame-bottom.svg")`,
            backgroundSize: '100% 100%',
          }}
        ></span>
        {children}
      </div>
    </div>
  )
}
