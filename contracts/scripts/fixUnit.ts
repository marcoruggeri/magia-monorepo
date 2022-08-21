import { ethers } from "hardhat";
import { AdminFacet } from "../typechain";
import { Land } from "../types";

export async function fixUnit(diamondAddress: string) {
  let adminFacet = (await ethers.getContractAt(
    "AdminFacet",
    diamondAddress
  )) as AdminFacet;

  // const tx1 = await adminFacet.mintResources(
  //   "0xcbcC7f29E88a6FBF5F3c9bd35EF518Bb3e5e0138"
  // );
  // await tx1.wait();
  const tx = await adminFacet.grantEnergy(20000, 57);
  await tx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  fixUnit("0x6A5CbdFaFE00547eB3630Bc44cD02d121E198C2F")
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
