import { ethers } from "hardhat";
import { AdminFacet } from "../typechain";
import { Land } from "../types";

export async function addMobs(diamondAddress: string) {
  // const gasPrice = 35000000000;

  let adminFacet = (await ethers.getContractAt(
    "AdminFacet",
    diamondAddress
  )) as AdminFacet;

  console.log("start addMobs");

  let landIds: number[] = [];
  let unitTypeIds: number[] = [];

  for (let i = 0; i < 10000; i++) {
    let r = Math.floor(Math.random() * 15);
    if (r === 5) {
      landIds.push(i);
      unitTypeIds.push(Math.floor(Math.random() * (7 - 3 + 1)) + 3);
    }
  }

  for (let i = 0; i < 100; i++) {
    if (landIds.length > 0) {
      try {
        let newLand = landIds.splice(0, 10);
        let newUnit = unitTypeIds.splice(0, 10);
        console.log("minting mobs I", i);
        const addMobsTx = await adminFacet.spawnMobs(newLand, newUnit);
        await addMobsTx.wait();
      } catch (e) {
        console.log(e);
      }
    }
  }

  console.log("complete addMobs");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  addMobs("0x6A5CbdFaFE00547eB3630Bc44cD02d121E198C2F")
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
