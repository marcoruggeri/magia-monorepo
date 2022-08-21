import { BigNumberish } from "@ethersproject/bignumber";

export interface Land {
  heroId: BigNumberish;
  coordinateX: BigNumberish;
  coordinateY: BigNumberish;
  unitTokenId: BigNumberish;
  gold: BigNumberish;
  lumber: BigNumberish;
  mana: BigNumberish;
  building: BigNumberish;
}

export interface Unit {
  attack: BigNumberish;
  defense: BigNumberish;
  range: BigNumberish;
  health: BigNumberish;
  name: string;
}

export interface UnitType {
  attack: BigNumberish;
  defense: BigNumberish;
  range: BigNumberish;
  health: BigNumberish;
  craftedFrom: BigNumberish;
  craftTime: BigNumberish;
  cost: [BigNumberish, BigNumberish, BigNumberish];
  name: string;
}

export interface Building {
  level: BigNumberish;
  buildingType: BigNumberish; // 0 void, 1 goldMine, 2 lumberMill, 3 shrine, 4 barracks
  cost: [BigNumberish, BigNumberish, BigNumberish]; // [gold, lumber, mana]
  craftTime: BigNumberish;
  name: string;
}

export interface Hero {
  white: BigNumberish;
  black: BigNumberish;
  fire: BigNumberish;
  water: BigNumberish;
  earth: BigNumberish;
  exp: 0;
  level: 1;
  energy: 500;
  name: string;
}

export interface Spell {
  craftTime: BigNumberish;
  magicReqs: [
    BigNumberish,
    BigNumberish,
    BigNumberish,
    BigNumberish,
    BigNumberish
  ];
  cost: [BigNumberish, BigNumberish, BigNumberish]; // [gold, lumber, mana];
  name: string;
}
