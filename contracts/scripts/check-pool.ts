import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractAt("ShadeFactory", "0xC8fCAdF348BDec277F37bbc0fA59412dd4dE64a7");
  const pool = await factory.getPool(
    "0x4bdAF1bA3c5a820C0E7dAdCAAf0be81f9001c04f", 
    "0xd8a04281aa5Db5C3CDe0be89c08310F1c1b22e01"
  );
  console.log("Pool address from factory:", pool);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
