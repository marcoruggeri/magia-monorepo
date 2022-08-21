import Image from 'next/image'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { useAppContext } from '../../providers/AppContext'
import inventoryPanelLogo from '../../assets/icons/inventory-panel-logo.svg'
import { buildingTypeToSprite } from '../../lib/sprites/buildingTypeToSprite'
import { BuildingImage } from '../ui/BuildingImage'
import { getSpellImage, getSpellNameByID } from '../../util/getSpellImage'
import { ButtonRegular, ButtonTransparent } from '../ui/Button'
import { ethers } from 'ethers'
import { UnitImage } from '../ui/UnitImage'
import { getBuildingName } from '../../util/getBuildingName'
import { LoadingSpinner } from '../ui/LoadingSpinner'

import { Tabs } from '../common/Tabs'
import { SidebarContainer } from './common/SidebarContainer'
import { SidebarHeader } from './common/SidebarHeader'
import { Buildings } from './inventory/Buildings'
import { Units } from './inventory/Units'
import { Spells } from './inventory/Spells'

export const Inventory = observer(() => {
  const panes = ['Buildings', 'Units', 'Spells']
  const [activePane, setActivePane] = useState(panes[0])

  return (
    <SidebarContainer>
      <div className="pr-3">
        <SidebarHeader
          title="Inventory"
          description="Use your inventory to recruit an army, build a building or cast a spell"
          Icon={() => (
            <Image
              src="/assets/icons/inventory-icon.svg"
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

// interface IInventoryItem {
//   name: string
//   image: JSX.Element
//   quantity: number
//   useItem?: () => Promise<void>
// }

// enum InventoryItemState {
//   NONE,
//   SELECTED,
//   USED,
// }

// const InventoryItem = observer(({ item }: { item: IInventoryItem }) => {
//   const [state, setState] = useState<InventoryItemState>(
//     InventoryItemState.NONE
//   )

//   const handleCraft = async () => {
//     if (item.useItem) {
//       await item.useItem()
//       setState(InventoryItemState.USED)
//     }
//   }

//   const quantity = ethers.utils.formatUnits(item.quantity, 0)

//   if (quantity === '0') {
//     return null
//   }

//   return (
//     <div className="px-3 pb-1">
//       <div
//         key={item.name}
//         className="my-2 flex cursor-pointer items-center"
//         onClick={() => item.useItem && setState(InventoryItemState.SELECTED)}
//       >
//         <div className="w-[35%]">{item.image}</div>
//         <div className="flex w-[65%] flex-col">
//           <p className="text-md mb-2">{item.name}</p>
//           <p>Quantity: {quantity}</p>
//         </div>
//       </div>
//       {state === InventoryItemState.SELECTED && (
//         <div className="flex justify-between pb-1">
//           <ButtonRegular onClick={handleCraft}>Craft</ButtonRegular>
//           <ButtonTransparent onClick={() => setState(InventoryItemState.NONE)}>
//             Cancel
//           </ButtonTransparent>
//         </div>
//       )}
//       {state === InventoryItemState.USED && (
//         <div className="flex justify-between pb-1">
//           <ButtonRegular onClick={handleCraft}>Use Again</ButtonRegular>
//           <ButtonTransparent onClick={() => setState(InventoryItemState.NONE)}>
//             Done
//           </ButtonTransparent>
//         </div>
//       )}
//     </div>
//   )
// })

// const BuildingItems = observer(() => {
//   const { store, api } = useAppContext()
//   const [hasTriedToFetch, setHasTriedToFetch] = useState(false)

//   useEffect(() => {
//     if (!store.player.buildings.length && !hasTriedToFetch) {
//       api.inventory.getBuildings().finally(() => setHasTriedToFetch(true))
//     }
//   }, [store.player.buildings])

//   const hasBuildings = store.player.buildings.some(
//     (quantity) => ethers.utils.formatUnits(quantity, 0) !== '0'
//   )

//   if (!hasBuildings && !hasTriedToFetch) {
//     return (
//       <div className="flex items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     )
//   }

//   if (!hasBuildings && hasTriedToFetch) {
//     return (
//       <p className="p-3 text-center">
//         You don't have any building yet, you can obtain one using the "Craft"
//         panel.
//       </p>
//     )
//   }

//   return (
//     <>
//       {store.player.buildings.map((buildingAmount, idx) => (
//         <InventoryItem
//           key={idx}
//           item={{
//             name: getBuildingName(idx + 1),
//             image: (
//               <BuildingImage
//                 sprite={buildingTypeToSprite(`${idx + 1}` as any)}
//                 width={100}
//                 height={100}
//               />
//             ),
//             quantity: buildingAmount,
//           }}
//         />
//       ))}
//     </>
//   )
// })

// const UnitItems = () => {
//   const { store, api } = useAppContext()
//   const [hasTriedToFetch, setHasTriedToFetch] = useState(false)

//   useEffect(() => {
//     if (!store.player.units.length && !hasTriedToFetch) {
//       api.inventory.getUnits().finally(() => setHasTriedToFetch(true))
//     }
//   }, [store.player.units])

//   if (!store.player.units.length && !hasTriedToFetch) {
//     return (
//       <div className="flex items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     )
//   }

//   if (!store.player.units.length && hasTriedToFetch) {
//     return (
//       <p className="p-3 text-center">
//         You don't have any unit yet, you can obtain one using the "Craft" panel.
//       </p>
//     )
//   }

//   return (
//     <>
//       {store.player.units.map((unit, idx) => (
//         <InventoryItem
//           key={idx}
//           item={{
//             name: unit.name,
//             image: (
//               <UnitImage
//                 className="block"
//                 sprite={unit.unitType}
//                 width={100}
//                 height={100}
//               ></UnitImage>
//             ),
//             quantity: store.player.units.filter(
//               (u) => u.unitType === unit.unitType
//             ).length,
//           }}
//         />
//       ))}
//     </>
//   )
// }

// const SpellItems = () => {
//   const { store, api } = useAppContext()
//   const [hasTriedToFetch, setHasTriedToFetch] = useState(false)

//   useEffect(() => {
//     if (!store.player.spells.length && !hasTriedToFetch) {
//       api.inventory.getSpells().finally(() => setHasTriedToFetch(true))
//     }
//   }, [store.player.spells])

//   const hasSpells = store.player.spells.some(
//     (quantity) => ethers.utils.formatUnits(quantity, 0) !== '0'
//   )

//   if (!hasSpells && !hasTriedToFetch) {
//     return (
//       <div className="flex items-center justify-center">
//         <LoadingSpinner />
//       </div>
//     )
//   }

//   if (!hasSpells) {
//     return (
//       <p className="p-3 text-center">
//         You don't have any spells yet, you can obtain one using the "Craft"
//         panel.
//       </p>
//     )
//   }

//   return (
//     <>
//       {store.player.spells.map((spellAmount, idx) => (
//         <InventoryItem
//           key={idx}
//           item={{
//             name: getSpellNameByID(idx + 1),
//             image: (
//               <Image
//                 src={getSpellImage(getSpellNameByID(idx + 1))}
//                 width={100}
//                 height={100}
//               />
//             ),
//             quantity: spellAmount,
//             useItem: async () => {
//               console.log('Tried to use spell')
//             },
//           }}
//         />
//       ))}
//     </>
//   )
// }
