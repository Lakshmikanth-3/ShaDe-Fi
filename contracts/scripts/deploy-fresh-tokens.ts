import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying fresh tokens with deployer:", deployer.address);
  
  // Deploy new ShadeToken contracts
  const Token = await ethers.getContractFactory("ShadeToken");
  
  console.log("\nDeploying shUSDC...");
  const shUSDC = await Token.deploy("Shade USDC", "shUSDC");
  await shUSDC.waitForDeployment();
  const shUSDCAddress = await shUSDC.getAddress();
  console.log("✅ shUSDC deployed:", shUSDCAddress);
  
  console.log("\nDeploying shETH...");
  const shETH = await Token.deploy("Shade ETH", "shETH");
  await shETH.waitForDeployment();
  const shETHAddress = await shETH.getAddress();
  console.log("✅ shETH deployed:", shETHAddress);
  
  // Mint to user wallet
  const USER_WALLET = "0xc1AFe7a2635F99308bE2922a26515C005eD90B89";
  
  console.log("\nMinting tokens to user...");
  const usdcAmount = BigInt(10000) * BigInt(10**6); // 10,000 with 6 decimals
  const ethAmount = BigInt(10) * BigInt(10**18); // 10 with 18 decimals
  
  await (await shUSDC.mint(USER_WALLET, usdcAmount)).wait();
  await (await shETH.mint(USER_WALLET, ethAmount)).wait();
  console.log("✅ Minted 10,000 shUSDC and 10 shETH to user");
  
  // Create pool for new tokens
  const FACTORY = "0x2Aa874B07E2449936a78E6E173b3A56643b98CF0";
  const factory = await ethers.getContractAt("ShadeFactory", FACTORY);
  
  console.log("\nCreating pool...");
  const tx = await factory.createPool(shUSDCAddress, shETHAddress);
  await tx.wait();
  const poolAddr = await factory.getPool(shUSDCAddress, shETHAddress);
  console.log("✅ Pool created:", poolAddr);
  
  console.log("\n--- UPDATE frontend/.env.local ---");
  console.log(`NEXT_PUBLIC_SHADE_USDC_ADDRESS=${shUSDCAddress}`);
  console.log(`NEXT_PUBLIC_SHADE_ETH_ADDRESS=${shETHAddress}`);
}

main().catch(console.error);
