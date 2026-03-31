import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  const SHUSDC = "0x74fC63Bf82117bA25aA7bF5f36Ceb4D3238048ac";
  const POOL = "0x78785303B3963C0f53D75a0eD27b2e78903ACDA3";
  
  const shUSDC = await ethers.getContractAt("ShadeToken", SHUSDC);
  
  console.log("Testing approve with small amounts...\n");
  
  // Try with a small amount (1000 tokens with 6 decimals)
  const smallAmount = 1000000000n; // 1000 * 10^6
  
  console.log("Test: approve with", smallAmount.toString());
  try {
    const tx = await shUSDC.approve(POOL, smallAmount);
    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ Success! Gas used:", receipt?.gasUsed.toString());
    
    const allowance = await shUSDC.allowance(deployer.address, POOL);
    console.log("Allowance:", allowance.toString());
  } catch (e: any) {
    console.log("❌ Failed:", e.message);
    if (e.reason) console.log("Reason:", e.reason);
  }
  
  // Also try with just 1 token
  console.log("\nTest: approve with 1 token");
  try {
    const tx = await shUSDC.approve(POOL, 1000000n);
    await tx.wait();
    console.log("✅ Success with 1 token!");
  } catch (e: any) {
    console.log("❌ Failed:", e.message);
  }
}

main().catch(console.error);
