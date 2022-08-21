import { ethers } from "hardhat";
import { AdminFacet } from "../typechain";
import { Land } from "../types";

export async function fixUnit(diamondAddress: string) {
  let adminFacet = (await ethers.getContractAt(
    "AdminFacet",
    diamondAddress
  )) as AdminFacet;

  const tx1 = await adminFacet.setAddresses(
    "0x7e7cC511498deCE0F376c69991CF104409c15806",
    "0x2667E66A8c6b887b5A898FE02B589d8F82104a81",
    "0x65BA1D533b4eFEBa2c2c200D354FBC7997162b1A",
    "0x2182CD963bFeF4A121fbd08f1700169bEBA50A60",
    "0x10c6F88D6F8aB1E9EeF313d1F93BF620DA811cb0",
    "0x3D93a330aD6802901d52EAE3bab6715C9C3e16fE",
    "0x9e57a5e4884fc93E607Ed016EE427de14a3C9803",
    "0x3DC96850DeAf0799C6Bee275c0c47921997Ce6c1"
  );
  await tx1.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  fixUnit("0x6BfD4b06f7b3776eDF1f08a49389f7BE10Bd70ae")
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
