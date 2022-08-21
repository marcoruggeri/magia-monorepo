import { Spell } from '../../enums'
import healing from '../../public/assets/sprites/spells/001-WHITE-HEALING.png'
import curse from '../../public/assets/sprites/spells/002-BLACK-CURSE.png'
import fireball from '../../public/assets/sprites/spells/003-FIRE-FIREBALL.png'
import giantStrength from '../../public/assets/sprites/spells/004-EARTH-GIANTGROWTH.png'
import iceArmor from '../../public/assets/sprites/spells/005-WATER-ENERGYBLAST.png'

export const getSpellImage = (spell: Spell) => {
  switch (spell) {
    case Spell.HEALING:
      return healing
    case Spell.CURSE:
      return curse
    case Spell.FIREBALL:
      return fireball
    case Spell.GROWTH:
      return giantStrength
    case Spell.ARMOR:
      return iceArmor
    default:
      return ''
  }
}

export const getSpellNameByID = (id: number) => {
  switch (id) {
    case 1:
      return 'Healing'
    case 2:
      return 'Reduce Armor'
    case 3:
      return 'Fireball'
    case 4:
      return 'Giant Strength'
    case 5:
      return 'Ice Armor'
    default:
      return ''
  }
}
