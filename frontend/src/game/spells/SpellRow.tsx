import { FC } from 'react'
import { Magia } from 'magiaTypes'
import Image from 'next/image'
import { ethers } from 'ethers'
import healing from '../../../public/assets/sprites/spells/001-WHITE-HEALING.png'
import curse from '../../../public/assets/sprites/spells/002-BLACK-CURSE.png'
import fireball from '../../../public/assets/sprites/spells/003-FIRE-FIREBALL.png'
import giantGrowth from '../../../public/assets/sprites/spells/004-EARTH-GIANTGROWTH.png'
import energyBlast from '../../../public/assets/sprites/spells/005-WATER-ENERGYBLAST.png'

interface ISpellRow {
  data: Magia.SpellData
  setSpellId: (id: string) => void
  spellId: string
  index: number
}

export const SpellRow: FC<ISpellRow> = ({
  data,
  setSpellId,
  spellId,
  index,
}) => {
  let image: any
  if (index === 1) {
    image = healing
  }
  if (index === 2) {
    image = curse
  }
  if (index === 3) {
    image = fireball
  }
  if (index === 4) {
    image = giantGrowth
  }
  if (index === 5) {
    image = energyBlast
  }
  // className={`flex items-center justify-between ${
  //   unitId === id ? 'border-2 border-rose-500' : ''
  // }`}
  return (
    <label
      className={`flex items-center justify-between ${
        spellId === index.toString() ? 'border-2 border-rose-500' : ''
      }`}
    >
      <div>
        <p className="self-start">{data.name}</p>
        <input
          type="radio"
          id={index.toString()}
          value={index.toString()}
          className="appearance-none p-2 text-black"
          checked={spellId === index.toString()}
          onChange={(e) => setSpellId(e.target.value)}
        />
        <Image src={image} width={64} height={64} />
      </div>
      <p>{parseInt(ethers.utils.formatUnits(data.cost[0]))}</p>
      <p>{parseInt(ethers.utils.formatUnits(data.cost[1]))}</p>
      <p>{parseInt(ethers.utils.formatUnits(data.cost[2]))}</p>
      <p>{ethers.utils.formatUnits(data.craftTime, 0)}</p>
    </label>
  )
}
