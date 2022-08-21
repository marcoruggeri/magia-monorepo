import { useAppContext } from '../../../providers/AppContext'
import { VerticalScroll } from '../../common/VerticalScroll'
import { UnitImage } from '../../ui/UnitImage'
import { PaneTransition } from '../common/PaneTransition'
import { CraftableItem } from './CraftableItem'

export const Units = () => {
  const { store, api } = useAppContext()

  return (
    <VerticalScroll>
      <PaneTransition>
        {store.catalog.craftableUnits.map((unit) => {
          const canBuild = store.player.canBuildUnit(unit.id)
          return (
            <CraftableItem
              key={unit.id}
              item={{
                name: unit.name,
                goldCost: unit.cost.gold,
                lumberCost: unit.cost.lumber,
                manaCost: unit.cost.mana,
                craftTime: unit.craftTime,
                image: (
                  <div className="-ml-2">
                    <UnitImage sprite={unit.id} width={100} height={100} />
                  </div>
                ),
                craftFunction: async () => {
                  const res = await api.unit.craft(unit)
                  console.log(res)
                },
                disabled: canBuild === true ? false : canBuild,
              }}
            />
          )
        })}
      </PaneTransition>
    </VerticalScroll>
  )
}
