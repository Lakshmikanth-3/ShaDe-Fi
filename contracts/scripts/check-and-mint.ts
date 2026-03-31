import { ethers } from "hardhat";

async function main() {
  const deployer = (await ethers.getSigners())[0];
  
  // Contracts
  const SHUSDC = "0x32790069298e934c449FF85eb621CA4962fDeb65";
  const SHETH = "0x6f61310dCF2041c1D3aA1b017272e115901b2b4a";
  const POOL = "0x5D650254c7F30bdA154709f614cFb1bE369e7009";
  
  const shUSDC = await ethers.getContractAt("ShadeToken", SHUSDC);
  const shETH = await ethers.getContractAt("ShadeToken", SHETH);
  const pool = await ethers.getContractAt("ShadePool", POOL);
  
  console.log("Deployer:", deployer.address);
  
  // Check pool reserves
  try {
    const reserves = await pool.getEncryptedReserves();
    console.log("\nPool reserves (encrypted handles):", reserves);
    console.log("ReserveA:", reserves[0].toString());
    console.log("ReserveB:", reserves[1].toString());
    
    if (reserves[0] === 0n && reserves[1] === 0n) {
      console.log("\n⚠️  POOL HAS NO LIQUIDITY!");
      console.log("You need to add liquidity first via /pool page before swapping.");
    } else {
      console.log("\n✅ Pool has liquidity");
    }
  } catch (e) {
    console.log("\n❌ Error checking reserves:", e.message);
  }
  
  // Check deployer balances
  const usdcBal = await shUSDC.balanceOf(deployer.address);
  const ethBal = await shETH.balanceOf(deployer.address);
  
  console.log("\nDeployer balances:");
  console.log("  shUSDC:", usdcBal.toString());
  console.log("  shETH:", ethBal.toString());
  
  // If no tokens, mint some
  if (usdcBal < 10000n || ethBal < 10n) {
    console.log("\nMinting tokens to deployer...");
    try {
      await (await shUSDC.mint(deployer.address, ethers.parseUnits("100000", 6))).wait();
      await (await shETH.mint(deployer.address, ethers.parseUnits("100", 18))).wait();
      console.log("✅ Minted 100,000 shUSDC and 100 shETH");
    } catch (e) {
      console.log("❌ Mint failed:", e.message);
    }
  }
}

main().catch(console.error);
