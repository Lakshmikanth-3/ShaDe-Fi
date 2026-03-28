import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1. Deploy ShadeFactory
  const Factory = await ethers.getContractFactory("ShadeFactory");
  const factory = await Factory.deploy();
  await factory.waitForDeployment();
  console.log("ShadeFactory deployed:", await factory.getAddress());

  // 2. Deploy ShadeRouter
  const Router = await ethers.getContractFactory("ShadeRouter");
  const router = await Router.deploy(await factory.getAddress());
  await router.waitForDeployment();
  console.log("ShadeRouter deployed:", await router.getAddress());

  // 3. Deploy test tokens
  const Token = await ethers.getContractFactory("ShadeToken");

  const shadeUSDC = await Token.deploy("Shade USDC", "shUSDC");
  await shadeUSDC.waitForDeployment();
  console.log("shadeUSDC deployed:", await shadeUSDC.getAddress());

  const shadeETH = await Token.deploy("Shade ETH", "shETH");
  await shadeETH.waitForDeployment();
  console.log("shadeETH deployed:", await shadeETH.getAddress());

  // 4. Create pool via factory
  const tx = await factory.createPool(
    await shadeUSDC.getAddress(),
    await shadeETH.getAddress()
  );
  await tx.wait();
  const poolAddr = await factory.getPool(
    await shadeUSDC.getAddress(),
    await shadeETH.getAddress()
  );
  console.log("Pool created:", poolAddr);

  console.log("\n--- Copy to frontend/.env.local ---");
  console.log(`NEXT_PUBLIC_FACTORY_ADDRESS=${await factory.getAddress()}`);
  console.log(`NEXT_PUBLIC_ROUTER_ADDRESS=${await router.getAddress()}`);
  console.log(`NEXT_PUBLIC_SHADE_USDC_ADDRESS=${await shadeUSDC.getAddress()}`);
  console.log(`NEXT_PUBLIC_SHADE_ETH_ADDRESS=${await shadeETH.getAddress()}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
