import { default as lands } from './gnosis/MagiaLands.json'
import { default as heroes } from './gnosis/MagiaHeroes.json'
import { default as units } from './gnosis/MagiaUnits.json'
import { default as buildings } from './gnosis/MagiaBuildings.json'
import { default as diamond } from './gnosis/Diamond.json'
import { default as gold } from './gnosis/MagiaGold.json'
import { default as lumber } from './gnosis/MagiaLumber.json'
import { default as mana } from './gnosis/MagiaMana.json'
import { default as spells } from './gnosis/MagiaSpells.json'
import { default as quests } from './gnosis/MagiaQuests.json'

export const abis = {
  lands,
  heroes,
  units,
  buildings,
  diamond,
  gold,
  lumber,
  mana,
  spells,
  quests,
}

export type ContractKeys = keyof typeof abis

export const getAbi = (name: ContractKeys) => {
  return abis[name]
}

export { lands as landsAbi }
export { heroes as heroesAbi }
export { units as unitsAbi }
export { buildings as buildingsAbi }
export { diamond as diamondAbi }
export { gold as goldAbi }
export { lumber as lumberAbi }
export { mana as manaAbi }
export { spells as spellsAbi }
export { quests as questsAbi }
