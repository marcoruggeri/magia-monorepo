import { ethers } from "hardhat";
import { VRFFacet, MagiaLands } from "../typechain";

export async function register(diamondAddress: string, landsAddress: string) {
  let vrfFacet = (await ethers.getContractAt(
    "VRFFacet",
    diamondAddress
  )) as VRFFacet;

  let landsContract = (await ethers.getContractAt(
    "MagiaLands",
    landsAddress
  )) as MagiaLands;

  const tilePre = await landsContract.getLandById(12);
  console.log("tilePre", tilePre);

  // const register = await vrfFacet.testRegister(2, 12);
  // await register.wait();

  const tilePost = await landsContract.getLandById(0);
  console.log("tilePost", tilePost);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  register(
    "0x6BfD4b06f7b3776eDF1f08a49389f7BE10Bd70ae",
    "0x10c6F88D6F8aB1E9EeF313d1F93BF620DA811cb0"
  )
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
