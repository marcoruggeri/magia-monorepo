import { ethers } from "hardhat";
import { MagiaSpells } from "../typechain";
import { Spell } from "../types";

export async function addSpells(spellsAddress: string) {
  // const gasPrice = 35000000000;

  let spellsContract = (await ethers.getContractAt(
    "MagiaSpells",
    spellsAddress
  )) as MagiaSpells;

  const spell1: Spell = {
    craftTime: 0,
    magicReqs: [5, 0, 0, 0, 0],
    cost: [
      ethers.utils.parseUnits("100"),
      ethers.utils.parseUnits("100"),
      ethers.utils.parseUnits("200"),
    ],
    name: "Healing", // heal a unit
  };

  const spell2: Spell = {
    craftTime: 0,
    magicReqs: [0, 5, 0, 0, 0],
    cost: [
      ethers.utils.parseUnits("100"),
      ethers.utils.parseUnits("100"),
      ethers.utils.parseUnits("200"),
    ],
    name: "Reduce armor", // reduce armor of a unit
  };

  const spell3: Spell = {
    craftTime: 0,
    magicReqs: [0, 0, 5, 0, 0],
    cost: [
      ethers.utils.parseUnits("100"),
      ethers.utils.parseUnits("100"),
      ethers.utils.parseUnits("200"),
    ],
    name: "Fireball", // deal damage
  };

  const spell4: Spell = {
    craftTime: 0,
    magicReqs: [0, 0, 0, 0, 5],
    cost: [
      ethers.utils.parseUnits("100"),
      ethers.utils.parseUnits("100"),
      ethers.utils.parseUnits("200"),
    ],
    name: "Giant strength", // increase attack
  };

  const spell5: Spell = {
    craftTime: 0,
    magicReqs: [0, 0, 0, 5, 0],
    cost: [
      ethers.utils.parseUnits("100"),
      ethers.utils.parseUnits("100"),
      ethers.utils.parseUnits("200"),
    ],
    name: "Ice Armor", // +200 defense
  };

  const spell6: Spell = {
    craftTime: 0,
    magicReqs: [10, 0, 0, 0, 0],
    cost: [
      ethers.utils.parseUnits("200"),
      ethers.utils.parseUnits("200"),
      ethers.utils.parseUnits("300"),
    ],
    name: "Summon Angels", // summon angels
  };

  const spell7: Spell = {
    craftTime: 0,
    magicReqs: [0, 10, 0, 0, 0],
    cost: [
      ethers.utils.parseUnits("200"),
      ethers.utils.parseUnits("200"),
      ethers.utils.parseUnits("300"),
    ],
    name: "Summon Black Knights", // summon black knights
  };

  const spell8: Spell = {
    craftTime: 0,
    magicReqs: [0, 0, 10, 0, 0],
    cost: [
      ethers.utils.parseUnits("200"),
      ethers.utils.parseUnits("200"),
      ethers.utils.parseUnits("300"),
    ],
    name: "Summon Fire Elemental", // summon fire elemental
  };

  const spell9: Spell = {
    craftTime: 0,
    magicReqs: [0, 0, 0, 10, 0],
    cost: [
      ethers.utils.parseUnits("200"),
      ethers.utils.parseUnits("200"),
      ethers.utils.parseUnits("300"),
    ],
    name: "Summon Water Elemental", // summon water elemental
  };

  const spell10: Spell = {
    craftTime: 0,
    magicReqs: [0, 0, 0, 0, 10],
    cost: [
      ethers.utils.parseUnits("200"),
      ethers.utils.parseUnits("200"),
      ethers.utils.parseUnits("300"),
    ],
    name: "Summon Earth Elemental", // summon earth elemental
  };

  const spell11: Spell = {
    craftTime: 0,
    magicReqs: [20, 0, 0, 0, 0],
    cost: [
      ethers.utils.parseUnits("300"),
      ethers.utils.parseUnits("300"),
      ethers.utils.parseUnits("500"),
    ],
    name: "Convert", // convert
  };

  const spell12: Spell = {
    craftTime: 0,
    magicReqs: [0, 20, 0, 0, 0],
    cost: [
      ethers.utils.parseUnits("300"),
      ethers.utils.parseUnits("300"),
      ethers.utils.parseUnits("500"),
    ],
    name: "Plague", // plague
  };

  const spell13: Spell = {
    craftTime: 0,
    magicReqs: [0, 0, 20, 0, 0],
    cost: [
      ethers.utils.parseUnits("300"),
      ethers.utils.parseUnits("300"),
      ethers.utils.parseUnits("500"),
    ],
    name: "Pyroblast", // pyroblast
  };

  const spell14: Spell = {
    craftTime: 0,
    magicReqs: [0, 0, 0, 20, 0],
    cost: [
      ethers.utils.parseUnits("300"),
      ethers.utils.parseUnits("300"),
      ethers.utils.parseUnits("500"),
    ],
    name: "Teleport", // teleport
  };

  const spell15: Spell = {
    craftTime: 0,
    magicReqs: [0, 0, 0, 0, 20],
    cost: [
      ethers.utils.parseUnits("300"),
      ethers.utils.parseUnits("300"),
      ethers.utils.parseUnits("500"),
    ],
    name: "Transmute", // pyroblast
  };

  console.log("adding spell 1");
  const addSpell1Tx = await spellsContract.addSpell(1, spell1);
  await addSpell1Tx.wait();

  console.log("adding spell 2");
  const addSpell2Tx = await spellsContract.addSpell(2, spell2);
  await addSpell2Tx.wait();

  console.log("adding spell 3");
  const addSpell3Tx = await spellsContract.addSpell(3, spell3);
  await addSpell3Tx.wait();

  console.log("adding spell 4");
  const addSpell4Tx = await spellsContract.addSpell(4, spell4);
  await addSpell4Tx.wait();

  console.log("adding spell 5");
  const addSpell5Tx = await spellsContract.addSpell(5, spell5);
  await addSpell5Tx.wait();

  console.log("adding spell 6");
  const addSpell6Tx = await spellsContract.addSpell(6, spell6);
  await addSpell6Tx.wait();

  console.log("adding spell 7");
  const addSpell7Tx = await spellsContract.addSpell(7, spell7);
  await addSpell7Tx.wait();

  console.log("adding spell 8");
  const addSpell8Tx = await spellsContract.addSpell(8, spell8);
  await addSpell8Tx.wait();

  console.log("adding spell 9");
  const addSpell9Tx = await spellsContract.addSpell(9, spell9);
  await addSpell9Tx.wait();

  console.log("adding spell 10");
  const addSpell10Tx = await spellsContract.addSpell(10, spell10);
  await addSpell10Tx.wait();

  console.log("adding spell 11");
  const addSpell11Tx = await spellsContract.addSpell(11, spell11);
  await addSpell11Tx.wait();

  console.log("adding spell 12");
  const addSpell12Tx = await spellsContract.addSpell(12, spell12);
  await addSpell12Tx.wait();

  console.log("adding spell 13");
  const addSpell13Tx = await spellsContract.addSpell(13, spell13);
  await addSpell13Tx.wait();

  console.log("adding spell 14");
  const addSpell14Tx = await spellsContract.addSpell(14, spell14);
  await addSpell14Tx.wait();

  console.log("adding spell 15");
  const addSpell15Tx = await spellsContract.addSpell(15, spell15);
  await addSpell15Tx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  addSpells("0x3DC96850DeAf0799C6Bee275c0c47921997Ce6c1")
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
