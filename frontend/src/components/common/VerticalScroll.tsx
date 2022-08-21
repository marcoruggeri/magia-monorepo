import { FC } from 'react'
import { Children } from '../../../magiaTypes'

export const VerticalScroll: FC<Children> = ({ children }) => (
  <div className="custom-scrollbar scrollbar-thumb-rounded-full flex-vertical mr-2 overflow-y-auto">
    {children}
  </div>
)
