import { ethers } from "hardhat";
import { MagiaHeroes } from "../typechain";
import { Hero } from "../types";

export async function mintHero(heroesAddress: string) {
  let heroesContract = (await ethers.getContractAt(
    "MagiaHeroes",
    heroesAddress
  )) as MagiaHeroes;

  const hero: Hero = {
    white: 20,
    black: 0,
    fire: 0,
    water: 0,
    earth: 0,
    exp: 0,
    level: 1,
    energy: 500,
    name: "Test",
  };

  const mintHero = await heroesContract.mintHero(hero);
  await mintHero.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  mintHero("0x9e57a5e4884fc93E607Ed016EE427de14a3C9803")
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
