import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  const SHUSDC = "0x32790069298e934c449FF85eb621CA4962fDeb65";
  const SHETH = "0x6f61310dCF2041c1D3aA1b017272e115901b2b4a";
  
  const shUSDC = await ethers.getContractAt("ShadeToken", SHUSDC);
  const shETH = await ethers.getContractAt("ShadeToken", SHETH);
  
  console.log("Deployer:", deployer.address);
  
  // Mint with uint64-safe amounts (max 2^64-1 = ~18e18)
  // Use 10,000 tokens with 6 decimals for USDC = 10,000,000,000 (fits in uint64)
  // Use 10 tokens with 18 decimals for ETH = 10e18 (fits in uint64)
  
  console.log("\nMinting 10,000 shUSDC (6 decimals)...");
  try {
    const usdcAmount = BigInt(10000) * BigInt(10**6); // 10,000 with 6 decimals
    await (await shUSDC.mint(deployer.address, usdcAmount)).wait();
    console.log("✅ Minted 10,000 shUSDC");
  } catch (e) {
    console.log("❌ shUSDC mint failed:", e.message);
  }
  
  console.log("\nMinting 10 shETH (18 decimals)...");
  try {
    const ethAmount = BigInt(10) * BigInt(10**18); // 10 with 18 decimals
    await (await shETH.mint(deployer.address, ethAmount)).wait();
    console.log("✅ Minted 10 shETH");
  } catch (e) {
    console.log("❌ shETH mint failed:", e.message);
  }
  
  // Check balances
  const usdcBal = await shUSDC.balanceOf(deployer.address);
  const ethBal = await shETH.balanceOf(deployer.address);
  
  console.log("\nFinal balances:");
  console.log("  shUSDC:", usdcBal.toString());
  console.log("  shETH:", ethBal.toString());
}

main().catch(console.error);
