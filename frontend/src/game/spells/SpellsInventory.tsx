import { FC } from 'react'
import Image from 'next/image'
import { ethers } from 'ethers'
import healing from '../../../public/assets/sprites/spells/001-WHITE-HEALING.png'
import curse from '../../../public/assets/sprites/spells/002-BLACK-CURSE.png'
import fireball from '../../../public/assets/sprites/spells/003-FIRE-FIREBALL.png'
import giantGrowth from '../../../public/assets/sprites/spells/004-EARTH-GIANTGROWTH.png'
import energyBlast from '../../../public/assets/sprites/spells/005-WATER-ENERGYBLAST.png'

interface ISpellsInventory {
  amount: number
  spellType: number
}

export const SpellsInventory: FC<ISpellsInventory> = ({
  amount,
  spellType,
}) => {
  let array = []
  for (let i = 0; i < amount; i++) {
    array.push(i)
  }
  let sprite: any
  if (ethers.utils.formatUnits(spellType, 0) === '1') {
    sprite = healing
  }
  if (ethers.utils.formatUnits(spellType, 0) === '2') {
    sprite = curse
  }
  if (ethers.utils.formatUnits(spellType, 0) === '3') {
    sprite = fireball
  }
  if (ethers.utils.formatUnits(spellType, 0) === '4') {
    sprite = giantGrowth
  }
  if (ethers.utils.formatUnits(spellType, 0) === '5') {
    sprite = energyBlast
  }
  return (
    <>
      {array.map((i) => (
        <Image key={i} src={sprite} width={100} height={100} />
      ))}
    </>
  )
}
