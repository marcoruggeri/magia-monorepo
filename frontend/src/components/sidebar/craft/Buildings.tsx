import { Transition } from '@headlessui/react'
import { observer } from 'mobx-react'
import { useAppContext } from '../../../providers/AppContext'
import { VerticalScroll } from '../../common/VerticalScroll'
import { BuildingImage } from '../../ui/BuildingImage'
import { PaneTransition } from '../common/PaneTransition'
import { CraftableItem } from './CraftableItem'

export const Buildings = observer(() => {
  const { store, api } = useAppContext()

  const handleCraft = async (buildingId: number) => {
    await api.building.craft(buildingId)
  }

  return (
    <VerticalScroll>
      <PaneTransition>
        {store.catalog.buildings.map((building) => (
          <CraftableItem
            key={building.name}
            item={{
              name: building.name,
              image: (
                <div className="ml-2">
                  <BuildingImage
                    sprite={building.sprite}
                    width={88}
                    height={88}
                  />
                </div>
              ),
              goldCost: building.cost.gold,
              lumberCost: building.cost.lumber,
              manaCost: building.cost.mana,
              craftTime: building.craftTime,
              craftFunction: () => handleCraft(building.id),
            }}
          />
        ))}
      </PaneTransition>
    </VerticalScroll>
  )
})
