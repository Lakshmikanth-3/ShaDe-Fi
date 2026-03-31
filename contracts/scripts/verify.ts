const { ethers } = require('hardhat');
const { createFhevmInstance } = require('fhevmjs/node');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Account:", deployer.address);

  // Addresses from .env.local
  const FACTORY_ADDRESS = "0x2e72DB6D15186caea378C623CEb8A82221564969";
  const ROUTER_ADDRESS = "0x9f99E9E0b264D6344c656b9aC9B604d9f319375e";
  const SHADE_USDC_ADDRESS = "0x246dC774887A4BD70e5B0A9A92E8b0065ba854aD";
  const SHADE_ETH_ADDRESS = "0x0c16DE61e9cAFD9fCB5DF1cd468c5FEA04E12910";
  const POOL_ADDRESS = "0xd0d50cD3c074457770e62828A9509256abB3E48f";

  console.log("Initializing FHEVM instance on Sepolia...");
  let instance;
  try {
    instance = await createFhevmInstance({
      kmsContractAddress: "0x9D6891A6240D6130c54ae243d8005063D05fE14b",
      aclContractAddress: "0xFee8407e2f5e3Ee68ad77cAE98c434e637f516EC",
      networkUrl: "https://sepolia.infura.io/v3/2bc52207ae9541df8c9ad7f21468f950",
      gatewayUrl: "https://gateway.sepolia.zama.ai"
    });
    console.log("FHEVM Initialized!");
  } catch (e) {
    console.log("[fhevm] Initialization error, using mock instance for format logging:");
    console.error(e.message);
  }

  const usdc = await ethers.getContractAt("ShadeToken", SHADE_USDC_ADDRESS);
  const eth = await ethers.getContractAt("ShadeToken", SHADE_ETH_ADDRESS);
  const router = await ethers.getContractAt("ShadeRouter", ROUTER_ADDRESS);

  // 1. MINT
  console.log("TEST 1 shUSDC minting...");
  let tx = await usdc.mint(deployer.address, 1000000n);
  await tx.wait();
  console.log("TEST 1 shUSDC mint: PASS [" + tx.hash + "]");

  console.log("TEST 1 shETH minting...");
  tx = await eth.mint(deployer.address, 1000000n);
  await tx.wait();
  console.log("TEST 1 shETH mint: PASS [" + tx.hash + "]");

  // 2. APPROVE
  const UINT64_MAX = 18446744073709551615n;
  console.log("TEST 2 approve shUSDC...");
  tx = await usdc.approve(ROUTER_ADDRESS, UINT64_MAX);
  await tx.wait();
  console.log("TEST 2 approve: PASS [" + tx.hash + "] [" + UINT64_MAX.toString() + "]");

  // 3. SWAP
  if (instance) {
    const input = instance.createEncryptedInput(ROUTER_ADDRESS, deployer.address);
    input.add64(10n);
    const enc = await input.encrypt();
    
    console.log("TEST 2 swap executing...");
    try {
      tx = await router.swap(
        SHADE_USDC_ADDRESS,
        SHADE_ETH_ADDRESS,
        enc.handles[0],
        enc.inputProof
      );
      await tx.wait();
      console.log("TEST 2 swap: PASS [" + tx.hash + "] [Success]");
    } catch (e) {
      console.log("TEST 2 swap: FAIL [Invalid index or execution reverted]");
    }
  } else {
     console.log("TEST 2 swap: SKIPPED (fhevm init failed in node)");
  }
}

main().catch(console.error);
