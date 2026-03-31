import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  // Factory address
  const FACTORY = "0x2Aa874B07E2449936a78E6E173b3A56643b98CF0";
  
  // Your tokens (from wallet)
  const SHUSDC = "0xE2e061b12eDF2a17e80775C6953fEd9050D52407";
  const SHETH = "0x7a9514534157068327685Dd40f09444D5C7AC28A";
  
  const factory = await ethers.getContractAt("ShadeFactory", FACTORY);
  
  console.log("Factory:", FACTORY);
  console.log("shUSDC:", SHUSDC);
  console.log("shETH:", SHETH);
  
  // Check if pool exists
  const poolAddr = await factory.getPool(SHUSDC, SHETH);
  console.log("\nPool address:", poolAddr);
  
  if (poolAddr === "0x0000000000000000000000000000000000000000") {
    console.log("\n⚠️ Pool does not exist. Creating pool...");
    
    try {
      const tx = await factory.createPool(SHUSDC, SHETH);
      await tx.wait();
      
      const newPool = await factory.getPool(SHUSDC, SHETH);
      console.log("✅ Pool created:", newPool);
    } catch (e) {
      console.log("❌ Failed to create pool:", e.message);
    }
  } else {
    console.log("\n✅ Pool exists at:", poolAddr);
  }
}

main().catch(console.error);
