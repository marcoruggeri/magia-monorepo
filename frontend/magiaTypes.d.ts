import { ReactNode } from 'react'
import { Building, Tileset, TileType } from './enums'
import { BigNumberish } from 'ethers/utils'

type Coord = {
  x: number
  y: number
}

type hexObject = {
  _hex: string
  _isBigNumber: boolean
}

// [white, black, fire, water, earth]
type MagicStatsTuple = ArrayFixedSize<6, number>

export interface Children {
  children: ReactNode
}

namespace Magia {
  export type TileChainType = {
    building: hexObject
    coordinateX: hexObject
    coordinateY: hexObject
    gold: hexObject
    heroId: hexObject
    lumber: hexObject
    mana: hexObject
    unitTokenId: hexObject
  }

  export type TileGameType = {
    building: Building
    coordinateX: number
    coordinateY: number
    isoX: number
    isoY: number
    key: string
    gold: number
    heroId: number
    lumber: number
    mana: number
    unitTokenId: number
    tileType: Tileset
  }

  export type UnitChainType = {
    attack: hexObject
    defense: hexObject
    health: hexObject
    name: string
    range: hexObject
    unitType: hexObject
  }

  export type UnitGameType = {
    attack: number
    defense: number
    health: number
    name: string
    range: number
    unitType: UnitType
  }

  export type TileTuple = {
    data: TileChainType
    gameImage: Phaser.GameObjects.Image
  }

  export type ChainHero = {
    white: hexObject
    black: hexObject
    fire: hexObject
    water: hexObject
    earth: hexObject
    exp: hexObject
    level: hexObject
    energy: hexObject
    name: string
  }
  export type GameHero = {
    white: number
    black: number
    fire: number
    water: number
    earth: number
    exp: number
    level: number
    energy: number
    name: string
  }

  export type BuildingData = {
    level: BigNumberish
    buildingType: BigNumberish
    cost: [BigNumberish, BigNumberish, BigNumberish]
    craftTime: BigNumberish
    name: string
  }

  export type SpellData = {
    craftTime: BigNumberish
    magicReqs: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
    cost: [BigNumberish, BigNumberish, BigNumberish]
    name: string
  }

  export type UnitCraftType = {
    attack: BigNumberish
    defense: BigNumberish
    range: BigNumberish
    health: BigNumberish
    craftedFrom: BigNumberish
    craftTime: BigNumberish
    cost: [BigNumberish, BigNumberish, BigNumberish] // [gold, lumber, mana]
    name: string
  }

  export type UnitCraftTypeWithId = UnitCraftType & {
    id: number
  }
}

export interface FCChildren {
  children?: ReactNode
}
