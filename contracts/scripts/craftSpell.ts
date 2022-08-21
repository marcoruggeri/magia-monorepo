import { ethers } from "hardhat";
import { SpellsFacet } from "../typechain";

export async function craftSpell(diamondAddress: string) {
  let spellsfacet = (await ethers.getContractAt(
    "SpellsFacet",
    diamondAddress
  )) as SpellsFacet;

  const tx1 = await spellsfacet.craftSpell(1, 1);
  await tx1.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  craftSpell("0x6BfD4b06f7b3776eDF1f08a49389f7BE10Bd70ae")
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
