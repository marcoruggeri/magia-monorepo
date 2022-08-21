import { expect } from "chai";
import { ethers, network } from "hardhat";
import * as hre from "hardhat";
import { deployDiamond } from "../scripts/deploy";
import {
  UnitsFacet,
  MagiaLands,
  MagiaBuildings,
  MagiaHeroes,
  RegisterFacet,
  MagiaUnits,
  BuildingsFacet,
  ResourcesFacet,
  ActionsFacet,
} from "../typechain";
import { Hero } from "../types";
import { BigNumber } from "ethers";
import { impersonate } from "../scripts/helperFunctions";
import { upgrade } from "../scripts/upgradeDiamond";
import { upgradeContract } from "../scripts/upgradeContract";

let g: any;
let unitsFacet: UnitsFacet;
let buildingsFacet: BuildingsFacet;
let resourcesFacet: ResourcesFacet;
let landsContract: MagiaLands;
let buildingsContract: MagiaBuildings;
let heroesContract: MagiaHeroes;
let registerFacet: RegisterFacet;
let unitsContract: MagiaUnits;
let unitTokenId1: BigNumber;
let actionsFacet: ActionsFacet;

describe("Game", function () {
  before(async function () {
    this.timeout(20000000);

    // g = await deployDiamond();

    // await upgrade();
    // await upgradeContract("0xA7902D5fd78e896A1071453D2e24DA41a7fA0004");

    const diamond = "0x6A5CbdFaFE00547eB3630Bc44cD02d121E198C2F";

    // vrfFacet = (await ethers.getContractAt("VRFFacet", diamond)) as VRFFacet;
    buildingsFacet = (await ethers.getContractAt(
      "BuildingsFacet",
      diamond
    )) as BuildingsFacet;
    actionsFacet = (await ethers.getContractAt(
      "ActionsFacet",
      diamond
    )) as ActionsFacet;
    landsContract = (await ethers.getContractAt(
      "MagiaLands",
      "0x43D900698f716179794553B5BCaacb0e37080828"
    )) as MagiaLands;
    // buildingsContract = (await ethers.getContractAt(
    //   "MagiaBuildings",
    //   g.buildingsAddress
    // )) as MagiaBuildings;
    // heroesContract = (await ethers.getContractAt(
    //   "MagiaHeroes",
    //   g.heroesAddress
    // )) as MagiaHeroes;
    // vrfFacet = (await ethers.getContractAt(
    //   "VRFFacet",
    //   g.diamondAddress
    // )) as VRFFacet;
    // unitsContract = (await ethers.getContractAt(
    //   "MagiaUnits",
    //   g.unitsAddress
    // )) as MagiaUnits;
  });
  it("debug", async function () {
    actionsFacet = await impersonate(
      "0xb2cbB625e2A54e1769D6c937296398F1b3F556c2",
      actionsFacet,
      ethers,
      network
    );
    const x = await landsContract.getUnit(779);
    console.log(x);
    // await actionsFacet.startShield(3, [700], [1077], 1);
  });
  // it("mint hero", async function () {
  //   const hero: Hero = {
  //     white: 4,
  //     black: 4,
  //     fire: 4,
  //     water: 4,
  //     earth: 4,
  //     exp: 0,
  //     level: 1,
  //     energy: 500,
  //     name: "Marco",
  //   };
  //   await heroesContract.mintHero(hero);
  // });
  // it("test register", async function () {
  //   await vrfFacet.testRegister(1, [0, 0, 3]);
  // });
  // it("move unit", async function () {
  //   await expect(gameFacet.moveUnit(1, 1, 0, 10)).to.be.revertedWith(
  //     "MagiaLands: Invalid y"
  //   );
  //   await expect(gameFacet.moveUnit(1, 1, 0, 300)).to.be.revertedWith(
  //     "MagiaLands: Invalid x"
  //   );
  //   await gameFacet.moveUnit(1, 1, 0, 1);
  // });
  // it("craft gold mine", async function () {
  //   await buildingsFacet.craftBuilding(1, 1);
  // });
  // it("equip gold mine", async function () {
  //   await buildingsContract.setApprovalForAll(g.diamondAddress, true);
  //   await buildingsFacet.equipBuilding(1, 1, 1);
  // });
  // it("claim gold", async function () {
  //   await expect(resourcesFacet.claimGold(1, 1)).to.be.revertedWith(
  //     "GameFacet: gold minClaim"
  //   );
  //   await hre.network.provider.send("hardhat_mine", ["0x10000"]);
  //   await resourcesFacet.claimGold(1, 1);
  // });
  // it("craft barracks", async function () {
  //   await buildingsFacet.craftBuilding(4, 1);
  // });
  // it("move unit", async function () {
  //   await gameFacet.moveUnit(1, 1, 1, 2);
  // });
  // it("equip barracks", async function () {
  //   await buildingsFacet.equipBuilding(1, 4, 2);
  // });
  // it("craft unit", async function () {
  //   await gameFacet.craftFromBarrack(1, 1, 2);
  // });
  // it("deploy unit", async function () {
  //   await unitsContract.setApprovalForAll(g.diamondAddress, true);
  //   unitTokenId1 = await unitsContract.tokenOfOwnerByIndex(
  //     "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  //     0
  //   );
  //   await gameFacet.deployUnit(1, unitTokenId1, 2, 3);
  // });
  // it("move unit", async function () {
  //   await gameFacet.moveUnit(1, unitTokenId1, 3, 4);
  //   await gameFacet.moveUnit(1, unitTokenId1, 4, 3);
  //   await gameFacet.moveUnit(1, unitTokenId1, 3, 4);
  // });
});
