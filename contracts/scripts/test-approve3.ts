import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  const SHUSDC = "0x74fC63Bf82117bA25aA7bF5f36Ceb4D3238048ac";
  const POOL = "0x78785303B3963C0f53D75a0eD27b2e78903ACDA3";
  
  const shUSDC = await ethers.getContractAt("ShadeToken", SHUSDC);
  
  console.log("Testing encrypted approve...\n");
  
  // Test: Encrypted approve with bytes32 handle and bytes proof
  // For testing, we'll use dummy values to see if the function exists
  console.log("Test: approve(address,bytes32,bytes)");
  try {
    const dummyHandle = "0x0000000000000000000000000000000000000000000000000000000000000001";
    const dummyProof = "0x00";
    const tx = await shUSDC["approve(address,bytes32,bytes)"](POOL, dummyHandle, dummyProof);
    await tx.wait();
    console.log("✅ Encrypted approve worked!\n");
  } catch (e: any) {
    console.log("❌ Failed:", e.message, "\n");
    
    // Check if it's a revert with reason
    if (e.data) {
      console.log("Error data:", e.data);
    }
  }
  
  // Also try checking what functions are available
  console.log("Checking contract fragments...");
  const fragments = shUSDC.interface.fragments;
  fragments.forEach((f: any) => {
    if (f.name && f.name.includes('approve')) {
      console.log("Found:", f.format());
    }
  });
}

main().catch(console.error);
