import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

// Mint test tokens to a given address for demo purposes
async function main() {
  const [deployer] = await ethers.getSigners();
  const recipient = process.env.MINT_TO || deployer.address;

  const SHADE_USDC = process.env.SHADE_USDC_ADDRESS || process.env.NEXT_PUBLIC_SHADE_USDC_ADDRESS;
  const SHADE_ETH  = process.env.SHADE_ETH_ADDRESS  || process.env.NEXT_PUBLIC_SHADE_ETH_ADDRESS;

  if (!SHADE_USDC || !SHADE_ETH) {
    console.error("Set NEXT_PUBLIC_SHADE_USDC_ADDRESS and NEXT_PUBLIC_SHADE_ETH_ADDRESS in .env");
    process.exit(1);
  }

  const shadeUSDC = await ethers.getContractAt("ShadeToken", SHADE_USDC);
  const shadeETH  = await ethers.getContractAt("ShadeToken", SHADE_ETH);

  // Mint 1,000,000 shadeUSDC (6 decimals = 1_000_000 * 1e6 raw)
  // ConfidentialERC20 uses uint64 amounts — max ~18.4 quadrillion
  const usdcAmount = 1_000_000n * 1_000_000n; // 1M USDC (6 dec)
  const ethAmount  = 500n * 1_000_000_000_000_000_000n / 1_000_000_000_000n; // 500 ETH scaled to uint64

  console.log(`Minting to: ${recipient}`);

  let tx = await shadeUSDC.mint(recipient, usdcAmount);
  await tx.wait();
  console.log(`✅ Minted ${usdcAmount} shadeUSDC`);

  tx = await shadeETH.mint(recipient, ethAmount);
  await tx.wait();
  console.log(`✅ Minted ${ethAmount} shadeETH`);

  console.log("\nDone! Add liquidity via the Pool page or run the seed script.");
}

main().catch((e) => { console.error(e); process.exit(1); });
