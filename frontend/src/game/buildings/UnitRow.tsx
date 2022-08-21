import { FC } from 'react'
import { Magia } from 'magiaTypes'
import { BuildingImage } from 'src/components/ui/BuildingImage'
import { ethers } from 'ethers'
import Image from 'next/image'

interface IUnitRow {
  data: Magia.UnitCraftType
  setUnitId: (id: string) => void
  selected: boolean
  id: string
  image: any
}

export const UnitRow: FC<IUnitRow> = ({
  data,
  setUnitId,
  selected,
  id,
  image,
}) => {
  return (
    <label
      className={`flex items-center justify-between ${
        selected ? 'border-2 border-rose-500' : ''
      }`}
    >
      <div>
        <p className="self-start">{data.name}</p>
        <input
          type="radio"
          id={id}
          value={id}
          className="appearance-none p-2 text-black "
          checked={selected}
          onChange={(e) => setUnitId(e.target.value)}
        />
        <Image src={image} className="block" width={128} height={128} />
      </div>
      <p>{parseInt(ethers.utils.formatUnits(data.cost[0]))}</p>
      <p>{parseInt(ethers.utils.formatUnits(data.cost[1]))}</p>
      <p>{parseInt(ethers.utils.formatUnits(data.cost[2]))}</p>
      <p>{parseInt(ethers.utils.formatUnits(data.craftTime, 0))}</p>
    </label>
  )
}
