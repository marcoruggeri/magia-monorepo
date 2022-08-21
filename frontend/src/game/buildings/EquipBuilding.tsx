import { Dialog } from '@headlessui/react'
import { observer } from 'mobx-react-lite'
import { useAppContext } from '../../providers/AppContext'
import { ModalDialog } from '../../types/ui/Dialogs'
import { BuildingImage } from 'src/components/ui/BuildingImage'
import { Building } from '../../../enums'
import { GoldFrame } from 'src/components/ui/GoldFrame'
import { buildingTypeToSprite } from '../../lib/sprites/buildingTypeToSprite'
import { ButtonRegular, ButtonTransparent } from '../../components/ui/Button'
import { ModalFlexHeight } from '../../components/ui/ModalFlexHeight'

export const EquipBuilding = observer(() => {
  const { api, store, controller } = useAppContext()

  const equipBuilding = async (building: Building) => {
    store.ui.closeModal()
    if (store.land.selectedLandId) {
      store.land.stashSelected()
      await api.building.equip(building, store.land.selectedLandId)
      controller.map.maybeReselectTile()
    }
  }

  return (
    <ModalFlexHeight
      open={store.ui.modalOpen === ModalDialog.EQUIPBUILDING}
      onClose={store.ui.closeModal}
      className="pb-4"
    >
      <p className="heading-level-2 mb-8 text-center">
        Select a Building to Equip
      </p>
      {!store.player.deployableBuildings.length && (
        <p className="px-10 pb-4 text-center">
          You don't have any buildings to equip here. Craft some first!
        </p>
      )}
      <div className="flex justify-center space-x-2">
        {store.player.deployableBuildings.map(([building, qty]) => {
          return (
            <div key={building} className="inline-flex flex-col items-center">
              <BuildingImage
                sprite={buildingTypeToSprite(building)}
                width={88}
                height={88}
              />
              <ButtonRegular
                className="mt-2"
                onClick={() => equipBuilding(building)}
              >
                Equip
              </ButtonRegular>
            </div>
          )
        })}
      </div>

      <div className="flex justify-center space-x-2 pt-4">
        <ButtonTransparent onClick={store.ui.closeModal}>
          Cancel
        </ButtonTransparent>
      </div>
    </ModalFlexHeight>
  )
})
