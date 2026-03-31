import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  // User's wallet address
  const USER_WALLET = "0xc1AFe7a2635F99308bE2922a26515C005eD90B89";
  
  // Tokens from user's wallet (the ones that show in MetaMask)
  const SHUSDC = "0xE2e061b12eDF2a17e80775C6953fEd9050D52407";
  const SHETH = "0x7a9514534157068327685Dd40f09444D5C7AC28A";
  
  console.log("Deployer:", deployer.address);
  console.log("User wallet:", USER_WALLET);
  
  // Get token contracts
  const shUSDC = await ethers.getContractAt("ShadeToken", SHUSDC);
  const shETH = await ethers.getContractAt("ShadeToken", SHETH);
  
  // Check current balances
  const usdcBal = await shUSDC.balanceOf(USER_WALLET);
  const ethBal = await shETH.balanceOf(USER_WALLET);
  
  console.log("\nCurrent balances:");
  console.log("  shUSDC:", usdcBal.toString());
  console.log("  shETH:", ethBal.toString());
  
  // Mint tokens to user (uint64 safe amounts)
  console.log("\nMinting tokens to user...");
  
  try {
    // 10,000 USDC with 6 decimals = 10,000,000,000
    const usdcAmount = BigInt(10000) * BigInt(10**6);
    await (await shUSDC.mint(USER_WALLET, usdcAmount)).wait();
    console.log("✅ Minted 10,000 shUSDC to user");
  } catch (e) {
    console.log("❌ shUSDC mint failed:", e.message);
  }
  
  try {
    // 10 ETH with 18 decimals = 10 * 10^18
    const ethAmount = BigInt(10) * BigInt(10**18);
    await (await shETH.mint(USER_WALLET, ethAmount)).wait();
    console.log("✅ Minted 10 shETH to user");
  } catch (e) {
    console.log("❌ shETH mint failed:", e.message);
  }
  
  // Check new balances
  const newUsdcBal = await shUSDC.balanceOf(USER_WALLET);
  const newEthBal = await shETH.balanceOf(USER_WALLET);
  
  console.log("\nNew balances:");
  console.log("  shUSDC:", newUsdcBal.toString());
  console.log("  shETH:", newEthBal.toString());
}

main().catch(console.error);
