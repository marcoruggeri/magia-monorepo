import Image from 'next/image'
import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import { Tabs } from '../common/Tabs'
import { SidebarContainer } from './common/SidebarContainer'
import { SidebarHeader } from './common/SidebarHeader'
import { Buildings } from './craft/Buildings'
import { Units } from './craft/Units'
import { Spells } from './craft/Spells'

export const Craft = observer(() => {
  const panes = ['Buildings', 'Units', 'Spells']
  const [activePane, setActivePane] = useState(panes[0])

  return (
    <SidebarContainer>
      <div className="pr-3">
        <SidebarHeader
          title="Craft"
          description="Craft buildings, spells or units using gold, lumber and mana"
          Icon={() => (
            <Image
              src="/assets/icons/craft-icon.svg"
              width={40}
              height={40}
              className="mt-2 block"
            />
          )}
        />

        <Tabs ids={panes} activeId={activePane} setActive={setActivePane} />
      </div>

      <PaneSwitch id={activePane} />
    </SidebarContainer>
  )
})

interface PaneSwitchProps {
  id: string
}
const PaneSwitch: FC<PaneSwitchProps> = ({ id }) => {
  if (id === 'Buildings') {
    return <Buildings />
  } else if (id === 'Units') {
    return <Units />
  } else if (id === 'Spells') {
    return <Spells />
  }

  return <></>
}
