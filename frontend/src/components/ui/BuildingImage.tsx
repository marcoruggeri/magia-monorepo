import Image from 'next/image'
import { FC } from 'react'
import { Tileset } from '../../../enums'
import TileSprites from '../../../public/assets/sprites/lands/lands.json'

interface IBuildingImage {
  sprite: Tileset
  className?: string
  width?: number
  height?: number
}

const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, '0')

export const BuildingImage: FC<IBuildingImage> = ({
  sprite,
  className,
  width,
  height,
}) => {
  if (!height) height = 128
  if (!width) width = 128

  const fname = TileSprites[zeroPad(sprite, 3) as keyof typeof TileSprites]

  return (
    <Image
      className={className}
      src={`/assets/sprites/lands/${fname}`}
      width={width}
      height={height}
    ></Image>
  )
}
