import { Signer } from "@ethersproject/abstract-signer";
import { ethers, upgrades } from "hardhat";
import {
  DiamondCutFacet,
  DiamondInit__factory,
  Diamond__factory,
  OwnershipFacet,
  AdminFacet,
  MagiaGold,
  MagiaLumber,
  MagiaMana,
  MagiaHeroes,
  MagiaBuildings,
  MagiaLands,
  MagiaUnits,
  MagiaSpells,
  MagiaQuests,
} from "../typechain";
import { addLands } from "./addLands";
import { addUnits } from "./addUnits";
import { addBuildings } from "./addBuildings";
import { addMobs } from "./addMobs";
import { addSpells } from "./addSpells";

const { getSelectors, FacetCutAction } = require("./libraries/diamond");

// const gasPrice = 35000000000;

export async function deployDiamond() {
  const accounts: Signer[] = await ethers.getSigners();
  const deployer = accounts[0];
  const deployerAddress = await deployer.getAddress();
  console.log("Deployer:", deployerAddress);

  // deploy DiamondCutFacet
  const DiamondCutFacet = await ethers.getContractFactory("DiamondCutFacet");
  const diamondCutFacet = await DiamondCutFacet.deploy();
  await diamondCutFacet.deployed();
  console.log("DiamondCutFacet deployed:", diamondCutFacet.address);

  // deploy Diamond
  const Diamond = (await ethers.getContractFactory(
    "Diamond"
  )) as Diamond__factory;
  const diamond = await Diamond.deploy(
    deployerAddress,
    diamondCutFacet.address
  );
  await diamond.deployed();
  console.log("Diamond deployed:", diamond.address);

  // deploy DiamondInit
  const DiamondInit = (await ethers.getContractFactory(
    "DiamondInit"
  )) as DiamondInit__factory;
  const diamondInit = await DiamondInit.deploy();
  await diamondInit.deployed();
  console.log("DiamondInit deployed:", diamondInit.address);

  // deploy facets
  console.log("");
  console.log("Deploying facets");
  const FacetNames = [
    "DiamondLoupeFacet",
    "OwnershipFacet",
    "UnitsFacet",
    "AdminFacet",
    "RegisterFacet",
    "BuildingsFacet",
    "ResourcesFacet",
    "ActionsFacet",
    "SpellsFacet1",
    "SpellsFacet2",
    "SpellsFacet3",
    "QuestsFacet",
  ];
  const cut = [];
  for (const FacetName of FacetNames) {
    const Facet = await ethers.getContractFactory(FacetName);
    const facet = await Facet.deploy();
    await facet.deployed();
    console.log(`${FacetName} deployed: ${facet.address}`);
    cut.push({
      facetAddress: facet.address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet),
    });
  }

  const diamondCut = (await ethers.getContractAt(
    "IDiamondCut",
    diamond.address
  )) as DiamondCutFacet;

  // call to init function
  const functionCall = diamondInit.interface.encodeFunctionData("init");
  const tx = await diamondCut.diamondCut(
    cut,
    diamondInit.address,
    functionCall
  );
  console.log("Diamond cut tx: ", tx.hash);
  const receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`);
  }
  console.log("Completed diamond cut");

  const ownershipFacet = (await ethers.getContractAt(
    "OwnershipFacet",
    diamond.address
  )) as OwnershipFacet;
  const diamondOwner = await ownershipFacet.owner();
  console.log("Diamond owner is:", diamondOwner);

  if (diamondOwner !== deployerAddress) {
    throw new Error(
      `Diamond owner ${diamondOwner} is not deployer address ${deployerAddress}!`
    );
  }

  console.log("deploying Lumber");
  const Lumber = await ethers.getContractFactory("MagiaLumber");
  const lumber = (await upgrades.deployProxy(Lumber, [])) as MagiaLumber;
  await lumber.deployed();

  console.log("deploying Mana");
  const Mana = await ethers.getContractFactory("MagiaMana");
  const mana = (await upgrades.deployProxy(Mana, [])) as MagiaMana;
  await mana.deployed();

  console.log("deploying Heroes");
  const Heroes = await ethers.getContractFactory("MagiaHeroes");
  const heroes = (await upgrades.deployProxy(Heroes, [
    diamond.address,
  ])) as MagiaHeroes;
  await heroes.deployed();

  console.log("deploying Lands");
  const Lands = await ethers.getContractFactory("MagiaLands");
  const lands = (await upgrades.deployProxy(Lands, [
    diamond.address,
  ])) as MagiaLands;
  await lands.deployed();

  console.log("deploying Gold");
  const Gold = await ethers.getContractFactory("MagiaGold");
  const gold = (await upgrades.deployProxy(Gold, [])) as MagiaGold;
  await gold.deployed();

  console.log("deploying Buildings");
  const Buildings = await ethers.getContractFactory("MagiaBuildings");
  const buildings = (await upgrades.deployProxy(Buildings, [
    diamond.address,
    gold.address,
    lumber.address,
    mana.address,
  ])) as MagiaBuildings;
  await buildings.deployed();

  console.log("deploying Units");
  const Units = await ethers.getContractFactory("MagiaUnits");
  const units = (await upgrades.deployProxy(Units, [
    diamond.address,
    gold.address,
    lumber.address,
    mana.address,
  ])) as MagiaUnits;
  await units.deployed();

  console.log("deploying Spells");
  const Spells = await ethers.getContractFactory("MagiaSpells");
  const spells = (await upgrades.deployProxy(Spells, [
    diamond.address,
    gold.address,
    lumber.address,
    mana.address,
  ])) as MagiaSpells;
  await spells.deployed();

  console.log("deploying Quests");
  const Quests = await ethers.getContractFactory("MagiaQuests");
  const quests = (await upgrades.deployProxy(Quests, [
    diamond.address,
    gold.address,
    lumber.address,
    mana.address,
  ])) as MagiaQuests;
  await quests.deployed();

  console.log(`Gold deployed: ${gold.address}`);
  console.log(`Lumber deployed: ${lumber.address}`);
  console.log(`Mana deployed: ${mana.address}`);
  console.log(`Heroes deployed: ${heroes.address}`);
  console.log(`Buildings deployed: ${buildings.address}`);
  console.log(`Lands deployed: ${lands.address}`);
  console.log(`Units deployed: ${units.address}`);
  console.log(`Spells deployed: ${spells.address}`);
  console.log(`Quests deployed: ${quests.address}`);

  const adminFacet = (await ethers.getContractAt(
    "AdminFacet",
    diamond.address
  )) as AdminFacet;

  console.log("setting diamond addresses");
  const setAddresses = await adminFacet.setAddresses(
    gold.address,
    lumber.address,
    mana.address,
    buildings.address,
    lands.address,
    units.address,
    heroes.address,
    spells.address,
    quests.address
  );
  await setAddresses.wait();

  console.log("setting gold addresses");
  const goldSetAddresses = await gold.setAddresses(diamond.address, {});
  await goldSetAddresses.wait();

  console.log("setting lumber addresses");
  const lumberSetAddresses = await lumber.setAddresses(diamond.address, {});
  await lumberSetAddresses.wait();

  console.log("setting mana addresses");
  const manaSetAddresses = await mana.setAddresses(diamond.address, {});
  await manaSetAddresses.wait();

  console.log("adding units");
  await addUnits(units.address);
  console.log("adding buildings");
  await addBuildings(buildings.address);
  console.log("adding spells");
  await addSpells(spells.address);
  console.log("adding lands");
  await addLands(lands.address);
  // console.log("adding mobs");
  // await addMobs(diamond.address);

  return {
    diamondAddress: diamond.address,
    goldAddress: gold.address,
    lumberAddress: lumber.address,
    manaAddress: mana.address,
    heroesAddress: heroes.address,
    buildingsAddress: buildings.address,
    landsAddress: lands.address,
    unitsAddress: units.address,
    spellsAddress: spells.address,
  };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  deployDiamond()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
