import Image from 'next/image'
import { FC } from 'react'
import { $enum } from 'ts-enum-util'
import { Resource, Spell } from '../../../enums'
import TileSprites from '../../../public/assets/sprites/spells/spells.json'

interface Props {
  resource: Resource
  className?: string
  width?: number
  height?: number
}

export const ResourceImage: FC<Props> = ({
  resource,
  className,
  width,
  height,
}) => {
  if (!height) height = 40
  if (!width) width = 40

  const fname = Resource[resource].toLowerCase()

  return (
    <Image
      className={className}
      src={`/assets/icons/${fname}.svg`}
      width={width}
      height={height}
    ></Image>
  )
}
