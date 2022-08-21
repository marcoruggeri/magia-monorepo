import { ethers } from "hardhat";
import { MagiaBuildings } from "../typechain";
import { Building } from "../types";

export async function addBuildings(buildingsAddress: string) {
  // const gasPrice = 35000000000;
  let buildingsContract = (await ethers.getContractAt(
    "MagiaBuildings",
    buildingsAddress
  )) as MagiaBuildings;

  const building1: Building = {
    level: 1,
    buildingType: 1,
    cost: [ethers.utils.parseUnits("350"), ethers.utils.parseUnits("200"), 0],
    craftTime: 0,
    name: "Gold Mine",
  };

  const building2: Building = {
    level: 1,
    buildingType: 2,
    cost: [ethers.utils.parseUnits("100"), ethers.utils.parseUnits("350"), 0],
    craftTime: 0,
    name: "Lumber Mill",
  };

  const building3: Building = {
    level: 1,
    buildingType: 3,
    cost: [
      ethers.utils.parseUnits("150"),
      ethers.utils.parseUnits("150"),
      ethers.utils.parseUnits("350"),
    ],
    craftTime: 0,
    name: "Mana Shrine",
  };

  const building4: Building = {
    level: 1,
    buildingType: 4,
    cost: [ethers.utils.parseUnits("300"), ethers.utils.parseUnits("100"), 0],
    craftTime: 0,
    name: "Barracks",
  };

  const building5: Building = {
    level: 1,
    buildingType: 5,
    cost: [
      ethers.utils.parseUnits("200"),
      ethers.utils.parseUnits("500"),
      ethers.utils.parseUnits("100"),
    ],
    craftTime: 0,
    name: "Workshop",
  };

  const building6: Building = {
    level: 1,
    buildingType: 6,
    cost: [
      ethers.utils.parseUnits("400"),
      ethers.utils.parseUnits("300"),
      ethers.utils.parseUnits("500"),
    ],
    craftTime: 0,
    name: "Mage Tower",
  };

  const addBuilding1Tx = await buildingsContract.addBuilding(1, building1);
  await addBuilding1Tx.wait();

  const addBuilding2Tx = await buildingsContract.addBuilding(2, building2);
  await addBuilding2Tx.wait();

  const addBuilding3Tx = await buildingsContract.addBuilding(3, building3);
  await addBuilding3Tx.wait();

  const addBuilding4Tx = await buildingsContract.addBuilding(4, building4);
  await addBuilding4Tx.wait();

  const addBuilding5Tx = await buildingsContract.addBuilding(5, building5);
  await addBuilding5Tx.wait();

  const addBuilding6Tx = await buildingsContract.addBuilding(6, building6);
  await addBuilding6Tx.wait();
}
