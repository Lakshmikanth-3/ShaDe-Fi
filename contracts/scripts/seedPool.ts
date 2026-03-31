import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Seeding pool with deployer:", deployer.address);

  // NEW contract addresses from deployment
  const FACTORY = "0x2Aa874B07E2449936a78E6E173b3A56643b98CF0";
  const SHUSDC = "0x32790069298e934c449FF85eb621CA4962fDeb65";
  const SHETH = "0x6f61310dCF2041c1D3aA1b017272e115901b2b4a";
  const ROUTER = "0xDDd7f9145C024A10C3F9eE86F7Ce77c3eD0610FD";

  // Get contracts
  const factory = await ethers.getContractAt("ShadeFactory", FACTORY);
  const shUSDC = await ethers.getContractAt("ShadeToken", SHUSDC);
  const shETH = await ethers.getContractAt("ShadeToken", SHETH);
  const router = await ethers.getContractAt("ShadeRouter", ROUTER);

  // Get pool address
  const poolAddr = await factory.getPool(SHUSDC, SHETH);
  console.log("Pool address:", poolAddr);

  // Check if pool is initialized
  const pool = await ethers.getContractAt("ShadePool", poolAddr);
  
  try {
    // Try to get reserves - will fail if not initialized
    const reserves = await pool.getEncryptedReserves();
    console.log("Pool already initialized, reserves:", reserves);
    console.log("Pool is ready for swaps!");
    return;
  } catch (e) {
    console.log("Pool not initialized, need to add initial liquidity");
  }

  // Mint tokens to deployer for seeding
  console.log("\nMinting tokens...");
  const mintUsdcTx = await shUSDC.mint(deployer.address, ethers.parseUnits("100000", 6)); // 100k USDC
  await mintUsdcTx.wait();
  console.log("Minted 100,000 shUSDC");

  const mintEthTx = await shETH.mint(deployer.address, ethers.parseUnits("100", 18)); // 100 ETH
  await mintEthTx.wait();
  console.log("Minted 100 shETH");

  // Check balances
  const usdcBal = await shUSDC.balanceOf(deployer.address);
  const ethBal = await shETH.balanceOf(deployer.address);
  console.log("\nBalances:");
  console.log("  shUSDC:", usdcBal.toString());
  console.log("  shETH:", ethBal.toString());

  console.log("\n⚠️  IMPORTANT: Pool initialization requires encrypted inputs.");
  console.log("Please use the frontend to initialize the pool:");
  console.log("  1. Go to localhost:3000/pool");
  console.log("  2. Enter amounts for both tokens");
  console.log("  3. Click 'Add Liquidity'");
  console.log("\nThe deploy script already created the pool at:", poolAddr);
  console.log("You just need to initialize it with the first liquidity via the UI.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
