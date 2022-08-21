import Image from 'next/image'
import { FC } from 'react'
import { Spell } from '../../../enums'
import TileSprites from '../../../public/assets/sprites/spells/spells.json'

interface Props {
  sprite: Spell
  className?: string
  width?: number
  height?: number
}

const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, '0')

export const SpellImage: FC<Props> = ({ sprite, className, width, height }) => {
  if (!height) height = 128
  if (!width) width = 128

  const fname =
    TileSprites[zeroPad(parseInt(sprite), 3) as keyof typeof TileSprites]

  return (
    <Image
      className={className}
      src={`/assets/sprites/spells/${fname}`}
      width={width}
      height={height}
    ></Image>
  )
}
