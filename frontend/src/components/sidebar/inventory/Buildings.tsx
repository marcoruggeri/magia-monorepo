import { observer } from 'mobx-react'
import { buildingTypeToSprite } from '../../../lib/sprites/buildingTypeToSprite'
import { useAppContext } from '../../../providers/AppContext'
import { VerticalScroll } from '../../common/VerticalScroll'
import { BuildingImage } from '../../ui/BuildingImage'
import { PaneTransition } from '../common/PaneTransition'
import { InventoryItem } from './InventoryItem'

export const Buildings = observer(() => {
  const { store } = useAppContext()
  return (
    <VerticalScroll>
      <PaneTransition>
        <div className="grid grid-cols-3">
          {store.player.buildings.map(([id, quantity]) => {
            return (
              <InventoryItem
                key={id}
                item={{
                  Image: (
                    <BuildingImage
                      sprite={buildingTypeToSprite(id)}
                      width={88}
                      height={88}
                    />
                  ),
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
