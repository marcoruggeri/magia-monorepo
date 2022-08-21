import { ethers } from "hardhat";
import { MagiaLands } from "../typechain";
import { Land } from "../types";

export async function addLands(landsAddress: string) {
  // const gasPrice = 35000000000;

  let landsContract = (await ethers.getContractAt(
    "MagiaLands",
    landsAddress
  )) as MagiaLands;

  console.log("start addLands");

  let landsArray: Land[] = [];
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      let r = Math.floor(Math.random() * 20);
      let gold = 0;
      let lumber = 0;
      let mana = 0;
      if (r === 0) {
        gold = Math.floor(Math.random() * 49999) + 10000;
      }
      if (r === 1) {
        lumber = Math.floor(Math.random() * 49999) + 10000;
      }
      if (r === 2) {
        mana = Math.floor(Math.random() * 49999) + 10000;
      }
      const newLand: Land = {
        heroId: 0,
        coordinateX: i,
        coordinateY: j,
        unitTokenId: 0,
        gold,
        lumber,
        mana,
        building: 0,
      };
      landsArray.push(newLand);
    }
  }
  for (let i = 0; i < 200; i++) {
    let newArray = landsArray.splice(0, 50);
    console.log("minting I", i);
    // if (i != 387) {
    //   continue;
    // }
    const addLandsTx = await landsContract.mintLands(newArray);
    await addLandsTx.wait();
  }

  console.log("complete addLands");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  addLands("0xc05964c14c91B831Cc82977eaf1c7b6914668aE7")
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
