import { ethers, upgrades } from "hardhat";

export async function upgradeContract(contractAddress: string) {
  console.log("start upgrade");

  // Upgrading
  const Contract = await ethers.getContractFactory("MagiaHeroes");
  const upgraded = await upgrades.upgradeProxy(contractAddress, Contract);
  console.log("complete upgrade");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  upgradeContract("0xC3EEc2E9CD1D777A04e9F1fa2ae2576754144f22")
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
