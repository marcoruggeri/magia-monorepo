import { observer } from 'mobx-react-lite'
import Image from 'next/image'
import { FC } from 'react'
import PennantSprites from '../../../public/assets/sprites/pennants/pennants.json'

interface Props {
  heroId: number
  className?: string
  width?: number
  height?: number
}
const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, '0')

export const PennantImage: FC<Props> = observer(
  ({ heroId, className, width, height }) => {
    if (!height) height = 128
    if (!width) width = 128

    const fname =
      PennantSprites[zeroPad(heroId, 3) as keyof typeof PennantSprites]

    return (
      <Image
        className={className}
        src={`/assets/sprites/pennants/${fname}`}
        width={width}
        height={height}
      ></Image>
    )
  }
)
