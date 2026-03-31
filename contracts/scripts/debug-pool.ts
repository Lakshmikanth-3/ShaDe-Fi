import { ethers } from "hardhat";

async function main() {
  const FACTORY = "0x2Aa874B07E2449936a78E6E173b3A56643b98CF0";
  const SHUSDC = "0x32790069298e934c449FF85eb621CA4962fDeb65";
  const SHETH = "0x6f61310dCF2041c1D3aA1b017272e115901b2b4a";

  const factory = await ethers.getContractAt("ShadeFactory", FACTORY);

  console.log("Factory:", FACTORY);
  console.log("shUSDC:", SHUSDC);
  console.log("shETH:", SHETH);

  // Check both orderings
  const pool1 = await factory.getPool(SHUSDC, SHETH);
  const pool2 = await factory.getPool(SHETH, SHUSDC);
  const totalPools = await factory.totalPools();

  console.log("\nPool (shUSDC, shETH):", pool1);
  console.log("Pool (shETH, shUSDC):", pool2);
  console.log("Total pools:", totalPools.toString());

  // Get all pools
  for (let i = 0; i < Number(totalPools); i++) {
    const pool = await factory.allPools(i);
    console.log(`Pool ${i}:`, pool);
  }
}

main().catch(console.error);
