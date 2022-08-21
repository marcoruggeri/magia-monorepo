import { BigNumber, ethers } from "ethers";
import { BuildingName } from "../../enums";

export const getBuildingName = (buildingIdx: number | BigNumber) => {
  const buildingId = ethers.utils.formatUnits(buildingIdx, 0);

  switch (buildingId) {
    case '1':
      return BuildingName.GOLDMINE;
    case '2':
      return BuildingName.LUMBERMILL;
    case '3':
      return BuildingName.MANASHRINE;
    case '4':
      return BuildingName.BARRACKS;
    case '5':
      return BuildingName.WORKSHOP;
    case '6':
      return BuildingName.MAGE_TOWER;
    default:
      return BuildingName.NONE;
  }
}
