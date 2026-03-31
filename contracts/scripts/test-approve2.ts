import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  const SHUSDC = "0x74fC63Bf82117bA25aA7bF5f36Ceb4D3238048ac";
  const POOL = "0x78785303B3963C0f53D75a0eD27b2e78903ACDA3";
  
  const shUSDC = await ethers.getContractAt("ShadeToken", SHUSDC);
  
  console.log("Testing approve functions...\n");
  
  // Test 1: Standard ERC20 approve with uint256
  console.log("Test 1: approve(address,uint256) with max uint256");
  try {
    const tx1 = await shUSDC["approve(address,uint256)"](POOL, ethers.MaxUint256);
    await tx1.wait();
    console.log("✅ Test 1 PASSED\n");
  } catch (e: any) {
    console.log("❌ Test 1 FAILED:", e.message, "\n");
  }
  
  // Reset approval
  await (await shUSDC["approve(address,uint256)"](POOL, 0)).wait();
  
  // Test 2: Standard ERC20 approve with uint64 max
  console.log("Test 2: approve(address,uint256) with uint64 max");
  try {
    const UINT64_MAX = 18446744073709551615n;
    const tx2 = await shUSDC["approve(address,uint256)"](POOL, UINT64_MAX);
    await tx2.wait();
    console.log("✅ Test 2 PASSED\n");
  } catch (e: any) {
    console.log("❌ Test 2 FAILED:", e.message, "\n");
  }
  
  // Check final allowance
  const allowance = await shUSDC.allowance(deployer.address, POOL);
  console.log("Final allowance:", allowance.toString());
}

main().catch(console.error);
