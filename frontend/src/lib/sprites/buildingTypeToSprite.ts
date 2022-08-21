import { Building, Tileset } from '../../../enums'

export const buildingTypeToSprite = (buildingType: Building) => {
  if (buildingType === Building.GOLDMINE) {
    return Tileset.GOLDMINE
  }
  if (buildingType === Building.LUMBERMILL) {
    return Tileset.LUMBERMILL
  }
  if (buildingType === Building.MANASHRINE) {
    return Tileset.MANASHRINE
  }
  if (buildingType === Building.BARRACKS) {
    return Tileset.BARRACKS
  }
  if (buildingType === Building.WORKSHOP) {
    return Tileset.WORKSHOP
  }
  if (buildingType === Building.MAGE_TOWER) {
    return Tileset.MAGE_TOWER
  }

  return Tileset.NONE
}
