import { observer } from 'mobx-react-lite'
import Image from 'next/image'
import { FC } from 'react'
import { UnitType } from '../../../enums'
import UnitSprites from '../../../public/assets/sprites/units/units.json'

interface IUnitImage {
  sprite: UnitType
  className?: string
  width?: number
  height?: number
}

const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, '0')

export const UnitImage: FC<IUnitImage> = observer(
  ({ sprite, className, width, height }) => {
    if (!height) height = 128
    if (!width) width = 128

    const fname = UnitSprites[zeroPad(sprite, 3) as keyof typeof UnitSprites]

    return (
      <Image
        className={className}
        src={`/assets/sprites/units/${fname}`}
        width={width}
        height={height}
      ></Image>
    )
  }
)
