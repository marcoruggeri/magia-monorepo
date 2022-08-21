import { observer } from 'mobx-react'
import Image from 'next/image'
import { Spell } from '../../../../enums'
import { useAppContext } from '../../../providers/AppContext'
import { getSpellImage } from '../../../util/getSpellImage'
import { VerticalScroll } from '../../common/VerticalScroll'
import { SpellImage } from '../../ui/SpellImage'
import { PaneTransition } from '../common/PaneTransition'
import { InventoryItem } from './InventoryItem'

export const Spells = observer(() => {
  const { store, controller } = useAppContext()
  return (
    <VerticalScroll>
      <PaneTransition>
        <div className="grid grid-cols-3">
          {store.player.spells.map(([spell, quantity]) => {
            return (
              <InventoryItem
                key={spell}
                item={{
                  actionLabel: 'Cast',
                  useItem: () => {
                    controller.magic.startCast(spell)
                  },
                  Image: <SpellImage sprite={spell} width={88} height={88} />,
                  quantity,
                }}
              />
            )
          })}
        </div>
      </PaneTransition>
    </VerticalScroll>
  )
})
