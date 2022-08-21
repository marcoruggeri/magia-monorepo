import { FC } from 'react'
import { Magia } from 'magiaTypes'
import { BuildingImage } from 'src/components/ui/BuildingImage'
import { Building } from '../../../enums'
import { ethers } from 'ethers'
import { Tileset } from '../../../enums'

interface IBuildingRow {
  data: Magia.BuildingData
  setBuildingId: (id: string) => void
  buildingId: string
}

export const BuildingRow: FC<IBuildingRow> = ({
  data,
  setBuildingId,
  buildingId,
}) => {
  let sprite = Tileset.NONE
  let spriteGlow = Tileset.NONE
  if (ethers.utils.formatUnits(data.buildingType, 0) === '1') {
    sprite = Tileset.GOLDMINE
    spriteGlow = Tileset.GOLDMINE_HIGHLIGHTED
  }
  if (ethers.utils.formatUnits(data.buildingType, 0) === '2') {
    sprite = Tileset.LUMBERMILL
    spriteGlow = Tileset.LUMBERMILL_HIGHLIGHTED
  }
  if (ethers.utils.formatUnits(data.buildingType, 0) === '3') {
    sprite = Tileset.MANASHRINE
    spriteGlow = Tileset.MANASHRINE_HIGHLIGHTED
  }
  if (ethers.utils.formatUnits(data.buildingType, 0) === '4') {
    sprite = Tileset.BARRACKS
    spriteGlow = Tileset.BARRACKS_HIGHLIGHTED
  }
  if (ethers.utils.formatUnits(data.buildingType, 0) === '5') {
    sprite = Tileset.WORKSHOP
    spriteGlow = Tileset.WORKSHOP_HIGHLIGHTED
  }
  if (ethers.utils.formatUnits(data.buildingType, 0) === '6') {
    sprite = Tileset.MAGE_TOWER
    spriteGlow = Tileset.MAGE_TOWER_HIGHLIGHTED
  }
  return (
    <label className="flex items-center justify-between">
      <div>
        <p className="self-start">{data.name}</p>
        <input
          type="radio"
          id={ethers.utils.formatUnits(data.buildingType, 0)}
          value={ethers.utils.formatUnits(data.buildingType, 0)}
          className="appearance-none p-2 text-black"
          checked={
            buildingId === ethers.utils.formatUnits(data.buildingType, 0)
          }
          onChange={(e) => setBuildingId(e.target.value)}
        />
        <BuildingImage
          sprite={
            buildingId === ethers.utils.formatUnits(data.buildingType, 0)
              ? spriteGlow
              : sprite
          }
          className="block"
          width={50}
          height={50}
        />
      </div>
      <p>{parseInt(ethers.utils.formatUnits(data.cost[0]))}</p>
      <p>{parseInt(ethers.utils.formatUnits(data.cost[1]))}</p>
      <p>{parseInt(ethers.utils.formatUnits(data.cost[2]))}</p>
      <p>{ethers.utils.formatUnits(data.craftTime, 0)}</p>
    </label>
  )
}
