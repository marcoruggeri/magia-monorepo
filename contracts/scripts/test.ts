import { ethers } from "hardhat";
import { MagiaLands } from "../typechain";
import { UnitType } from "../types";

export async function test(unitsAddress: string) {
  let unitsContract = (await ethers.getContractAt(
    "MagiaLands",
    unitsAddress
  )) as MagiaLands;

  // const array: any = [];
  // for (let i = 0; i < 100; i++) {
  //   array.push(i);
  // }
  const test = await unitsContract.getUnit(779);
  console.log(test);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  test("0x43D900698f716179794553B5BCaacb0e37080828")
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
