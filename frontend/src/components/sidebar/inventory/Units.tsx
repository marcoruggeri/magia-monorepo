import { observer } from 'mobx-react'
import { useAppContext } from '../../../providers/AppContext'
import { VerticalScroll } from '../../common/VerticalScroll'
import { UnitImage } from '../../ui/UnitImage'
import { PaneTransition } from '../common/PaneTransition'
import { InventoryItem } from './InventoryItem'

export const Units = observer(() => {
  const { store, controller } = useAppContext()

  return (
    <VerticalScroll>
      <PaneTransition>
        <div className="grid grid-cols-3">
          {store.player.units.map((unit) => {
            return (
              <InventoryItem
                key={unit.id}
                item={{
                  actionLabel: 'Deploy',
                  useItem: () => {
                    store.ui.setDeployableUnit(unit)
                    controller.map.startDeployUnit()
                  },
                  Image: (
                    <UnitImage
                      sprite={unit.unitType}
                      width={100}
                      height={100}
                    />
                  ),
                }}
              />
            )
          })}
        </div>
      </PaneTransition>
    </VerticalScroll>
  )
})
