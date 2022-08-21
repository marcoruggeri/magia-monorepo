import { ethers } from "hardhat";
import { MagiaUnits } from "../typechain";
import { UnitType } from "../types";

export async function addUnits(unitsAddress: string) {
  // const gasPrice = 35000000000;
  let unitsContract = (await ethers.getContractAt(
    "MagiaUnits",
    unitsAddress
  )) as MagiaUnits;

  const unit1: UnitType = {
    attack: 1000,
    defense: 500,
    range: 1,
    health: 500,
    craftedFrom: 4,
    craftTime: 0,
    cost: [ethers.utils.parseUnits("300"), ethers.utils.parseUnits("200"), 0],
    name: "Swordsmen",
  };

  const unit2: UnitType = {
    attack: 600,
    defense: 0,
    range: 2,
    health: 300,
    craftedFrom: 4,
    craftTime: 0,
    cost: [ethers.utils.parseUnits("200"), ethers.utils.parseUnits("300"), 0],
    name: "Bowmen",
  };

  const unit3: UnitType = {
    attack: 700,
    defense: 400,
    range: 1,
    health: 200,
    craftedFrom: 0,
    craftTime: 0,
    cost: [0, 0, 0],
    name: "Skeletons",
  };

  const unit4: UnitType = {
    attack: 800,
    defense: 500,
    range: 1,
    health: 600,
    craftedFrom: 0,
    craftTime: 0,
    cost: [0, 0, 0],
    name: "Ghouls",
  };

  const unit5: UnitType = {
    attack: 1500,
    defense: 500,
    range: 1,
    health: 500,
    craftedFrom: 0,
    craftTime: 0,
    cost: [0, 0, 0],
    name: "Demons",
  };

  const unit6: UnitType = {
    attack: 1000,
    defense: 700,
    range: 1,
    health: 600,
    craftedFrom: 0,
    craftTime: 0,
    cost: [0, 0, 0],
    name: "Hydras",
  };

  const unit7: UnitType = {
    attack: 1500,
    defense: 1000,
    range: 1,
    health: 1500,
    craftedFrom: 0,
    craftTime: 0,
    cost: [0, 0, 0],
    name: "Dragons",
  };

  const unit8: UnitType = {
    attack: 1500,
    defense: 800,
    range: 1,
    health: 1000,
    craftedFrom: 4,
    craftTime: 0,
    cost: [
      ethers.utils.parseUnits("600"),
      ethers.utils.parseUnits("400"),
      ethers.utils.parseUnits("200"),
    ],
    name: "Cavarly",
  };

  const unit9: UnitType = {
    attack: 1250,
    defense: 150,
    range: 4,
    health: 300,
    craftedFrom: 5,
    craftTime: 0,
    cost: [
      ethers.utils.parseUnits("400"),
      ethers.utils.parseUnits("600"),
      ethers.utils.parseUnits("200"),
    ],
    name: "Catapult",
  };

  const unit10: UnitType = {
    attack: 2000,
    defense: 250,
    range: 2,
    health: 500,
    craftedFrom: 6,
    craftTime: 0,
    cost: [
      ethers.utils.parseUnits("600"),
      ethers.utils.parseUnits("400"),
      ethers.utils.parseUnits("600"),
    ],
    name: "Magicians",
  };

  const unit11: UnitType = {
    attack: 0,
    defense: 800,
    range: 1,
    health: 2000,
    craftedFrom: 4,
    craftTime: 0,
    cost: [
      ethers.utils.parseUnits("300"),
      ethers.utils.parseUnits("300"),
      ethers.utils.parseUnits("100"),
    ],
    name: "Shieldsmen",
  };

  const unit12: UnitType = {
    attack: 700,
    defense: 1000,
    range: 1,
    health: 1000,
    craftedFrom: 0,
    craftTime: 0,
    cost: [0, 0, 0],
    name: "Angels",
  };

  const unit13: UnitType = {
    attack: 1200,
    defense: 800,
    range: 1,
    health: 700,
    craftedFrom: 0,
    craftTime: 0,
    cost: [0, 0, 0],
    name: "Black Knights",
  };

  const unit14: UnitType = {
    attack: 1500,
    defense: 700,
    range: 1,
    health: 500,
    craftedFrom: 0,
    craftTime: 0,
    cost: [0, 0, 0],
    name: "Fire Elemental",
  };

  const unit15: UnitType = {
    attack: 900,
    defense: 900,
    range: 1,
    health: 900,
    craftedFrom: 0,
    craftTime: 0,
    cost: [0, 0, 0],
    name: "Water Elemental",
  };

  const unit16: UnitType = {
    attack: 2000,
    defense: 300,
    range: 1,
    health: 400,
    craftedFrom: 0,
    craftTime: 0,
    cost: [0, 0, 0],
    name: "Earth Elemental",
  };

  const addUnit1Tx = await unitsContract.addUnitType(1, unit1);
  await addUnit1Tx.wait();

  const addUnit2Tx = await unitsContract.addUnitType(2, unit2);
  await addUnit2Tx.wait();

  const addUnit3Tx = await unitsContract.addUnitType(3, unit3);
  await addUnit3Tx.wait();

  const addUnit4Tx = await unitsContract.addUnitType(4, unit4);
  await addUnit4Tx.wait();

  const addUnit5Tx = await unitsContract.addUnitType(5, unit5);
  await addUnit5Tx.wait();

  const addUnit6Tx = await unitsContract.addUnitType(6, unit6);
  await addUnit6Tx.wait();

  const addUnit7Tx = await unitsContract.addUnitType(7, unit7);
  await addUnit7Tx.wait();

  const addUnit8Tx = await unitsContract.addUnitType(8, unit8);
  await addUnit8Tx.wait();

  const addUnit9Tx = await unitsContract.addUnitType(9, unit9);
  await addUnit9Tx.wait();

  const addUnit10Tx = await unitsContract.addUnitType(10, unit10);
  await addUnit10Tx.wait();

  const addUnit11Tx = await unitsContract.addUnitType(11, unit11);
  await addUnit11Tx.wait();

  const addUnit12Tx = await unitsContract.addUnitType(12, unit12);
  await addUnit12Tx.wait();

  const addUnit13Tx = await unitsContract.addUnitType(13, unit13);
  await addUnit13Tx.wait();

  const addUnit14Tx = await unitsContract.addUnitType(14, unit14);
  await addUnit14Tx.wait();

  const addUnit15Tx = await unitsContract.addUnitType(15, unit15);
  await addUnit15Tx.wait();

  const addUnit16Tx = await unitsContract.addUnitType(16, unit16);
  await addUnit16Tx.wait();
}

if (require.main === module) {
  addUnits("0x282abB0Efc6BB4008bC471f4cdAd95116627A20d")
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
