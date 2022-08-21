import Image from 'next/image'
import { FC } from 'react'
import { PanelIcon } from './PanelIcon'

interface Props {
  title?: string
  description?: string
  Icon?: () => JSX.Element
}

export const SidebarHeader: FC<Props> = ({ title, description, Icon }) => {
  return (
    <header className="sidebar__panel__header pb-2 pl-[25px] pr-[20px]">
      {title && <h2 className="mb-3 font-serif font-bold">{title}</h2>}
      <PanelIcon>{Icon && <Icon />}</PanelIcon>
      {description && <p className="text-md pr-20">{description}</p>}
    </header>
  )
}
