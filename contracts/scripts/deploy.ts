import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  const bal = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(bal), "ETH");

  // 1. Deploy ShadeFactory
  console.log("\n[1/5] Deploying ShadeFactory...");
  const Factory = await ethers.getContractFactory("ShadeFactory");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();
  const factoryAddr = await factory.getAddress();
  console.log("✅ ShadeFactory:", factoryAddr);

  // 2. Deploy ShadeRouter
  console.log("\n[2/5] Deploying ShadeRouter...");
  const Router = await ethers.getContractFactory("ShadeRouter");
  const router = await Router.deploy(factoryAddr);
  await router.waitForDeployment();
  const routerAddr = await router.getAddress();
  console.log("✅ ShadeRouter:", routerAddr);

  // 3. Deploy shUSDC token (6 decimals)
  console.log("\n[3/5] Deploying ShadeToken (shUSDC, 6 decimals)...");
  const Token = await ethers.getContractFactory("ShadeToken");
  const shadeUSDC = await Token.deploy("Shade USDC", "shUSDC", 6);
  await shadeUSDC.waitForDeployment();
  const shUsdcAddr = await shadeUSDC.getAddress();
  console.log("✅ shUSDC:", shUsdcAddr);

  // 4. Deploy shETH token (18 decimals)
  console.log("\n[4/5] Deploying ShadeToken (shETH, 18 decimals)...");
  const shadeETH = await Token.deploy("Shade ETH", "shETH", 18);
  await shadeETH.waitForDeployment();
  const shEthAddr = await shadeETH.getAddress();
  console.log("✅ shETH:", shEthAddr);

  // 5. Create pool via factory
  console.log("\n[5/5] Creating pool via factory...");
  const poolTx = await factory.createPool(shUsdcAddr, shEthAddr);
  await poolTx.wait();
  const poolAddr = await factory.getPool(shUsdcAddr, shEthAddr);
  console.log("✅ Pool created:", poolAddr);

  const output = `
=== DEPLOYMENT COMPLETE ===
Network: Sepolia (Zama fhEVM co-processor)
Deployer: ${deployer.address}

ShadeFactory: ${factoryAddr}
ShadeRouter:  ${routerAddr}
shUSDC:       ${shUsdcAddr}
shETH:        ${shEthAddr}
Pool:         ${poolAddr}

=== COPY THIS TO frontend/.env.local ===
NEXT_PUBLIC_FACTORY_ADDRESS=${factoryAddr}
NEXT_PUBLIC_ROUTER_ADDRESS=${routerAddr}
NEXT_PUBLIC_SHADE_USDC_ADDRESS=${shUsdcAddr}
NEXT_PUBLIC_SHADE_ETH_ADDRESS=${shEthAddr}
NEXT_PUBLIC_POOL_ADDRESS=${poolAddr}
`;

  console.log(output);

  // Write to a deploy log
  const logPath = path.join(__dirname, "../deploy_output.txt");
  fs.writeFileSync(logPath, output);
  console.log(`\nDeploy output saved to: ${logPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
