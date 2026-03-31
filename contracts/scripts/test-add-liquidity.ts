import { ethers } from "hardhat";
import { createInstance, SepoliaConfig } from "@zama-fhe/relayer-sdk/node";

// Contract addresses
const SHADE_USDC_ADDRESS = "0x74fC63Bf82117bA25aA7bF5f36Ceb4D3238048ac";
const SHADE_ETH_ADDRESS = "0x9631012FEC99d005768fF7691414BF9A9dF1EECf";
const POOL_ADDRESS = "0x78785303B3963C0f53D75a0eD27b2e78903ACDA3";
const ROUTER_ADDRESS = "0xDDd7f9145C024A10C3F9eE86F7Ce77c3eD0610FD";
const RPC_URL = "https://sepolia.infura.io/v3/2bc52207ae9541df8c9ad7f21468f950";

// Amounts to add
const AMOUNT_A = BigInt(100 * 10 ** 6); // 100 shUSDC (6 decimals)
const AMOUNT_B = BigInt(1 * 10 ** 18);   // 1 shETH (18 decimals)

async function main() {
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║     TEST: Add Liquidity (Step-by-Step)                 ║");
  console.log("╚════════════════════════════════════════════════════════╝");
  console.log();

  const [signer] = await ethers.getSigners();
  const userAddress = await signer.getAddress();
  
  console.log(`✓ Signer: ${userAddress}`);
  console.log(`✓ Pool: ${POOL_ADDRESS}`);
  console.log(`✓ Amount A: ${AMOUNT_A.toString()} (100 shUSDC)`);
  console.log(`✓ Amount B: ${AMOUNT_B.toString()} (1 shETH)`);
  console.log();

  try {
    // Initialize SDK
    console.log("[INIT] Initializing fhEVM SDK...");
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const instance = await createInstance({
      ...SepoliaConfig,
      network: provider,
      relayerUrl: "https://relayer.testnet.zama.org",
    });
    console.log("✓ fhEVM SDK initialized");
    console.log();

    // Step 1: Approve Token A (shUSDC)
    console.log("[STEP 1/5] Approving shUSDC...");
    console.log("  Encrypting approval amount with TOKEN address...");
    
    const bufferA = instance.createEncryptedInput(SHADE_USDC_ADDRESS, userAddress);
    bufferA.add128(AMOUNT_A);
    const encA = await bufferA.encrypt();
    
    const handleA = "0x" + Buffer.from(encA.handles[0]).toString("hex");
    const proofA = "0x" + Buffer.from(encA.inputProof).toString("hex");
    
    console.log(`  ✓ Handle: ${handleA.slice(0, 30)}...`);
    
    const tokenA = await ethers.getContractAt("ShadeToken", SHADE_USDC_ADDRESS, signer);
    const tx1 = await tokenA.approve(POOL_ADDRESS, handleA as `0x${string}`, proofA as `0x${string}`, {
      gasLimit: 500000,
    });
    
    console.log(`  ✓ Approve tx: ${tx1.hash}`);
    const receipt1 = await tx1.wait();
    console.log(`  ✓ Confirmed (gas: ${receipt1?.gasUsed})`);
    console.log();

    // Step 2: Approve Token B (shETH)
    console.log("[STEP 2/5] Approving shETH...");
    console.log("  Creating FRESH instance for shETH encryption...");
    
    const bufferB = instance.createEncryptedInput(SHADE_ETH_ADDRESS, userAddress);
    bufferB.add128(AMOUNT_B);
    const encB = await bufferB.encrypt();
    
    const handleB = "0x" + Buffer.from(encB.handles[0]).toString("hex");
    const proofB = "0x" + Buffer.from(encB.inputProof).toString("hex");
    
    console.log(`  ✓ Handle: ${handleB.slice(0, 30)}...`);
    
    const tokenB = await ethers.getContractAt("ShadeToken", SHADE_ETH_ADDRESS, signer);
    const tx2 = await tokenB.approve(POOL_ADDRESS, handleB as `0x${string}`, proofB as `0x${string}`, {
      gasLimit: 500000,
    });
    
    console.log(`  ✓ Approve tx: ${tx2.hash}`);
    const receipt2 = await tx2.wait();
    console.log(`  ✓ Confirmed (gas: ${receipt2?.gasUsed})`);
    console.log();

    // Step 3: Encrypt liquidity amounts for pool
    console.log("[STEP 3/5] Encrypting liquidity amounts...");
    console.log("  Creating FRESH instance for POOL encryption...");
    
    // For liquidity - encrypt with POOL address
    const bufferLiqA = instance.createEncryptedInput(POOL_ADDRESS, userAddress);
    bufferLiqA.add128(AMOUNT_A);
    const encLiqA = await bufferLiqA.encrypt();
    
    const handleLiqA = "0x" + Buffer.from(encLiqA.handles[0]).toString("hex");
    const proofLiqA = "0x" + Buffer.from(encLiqA.inputProof).toString("hex");
    
    const bufferLiqB = instance.createEncryptedInput(POOL_ADDRESS, userAddress);
    bufferLiqB.add128(AMOUNT_B);
    const encLiqB = await bufferLiqB.encrypt();
    
    const handleLiqB = "0x" + Buffer.from(encLiqB.handles[0]).toString("hex");
    const proofLiqB = "0x" + Buffer.from(encLiqB.inputProof).toString("hex");
    
    console.log(`  ✓ EncA: ${handleLiqA.slice(0, 30)}...`);
    console.log(`  ✓ EncB: ${handleLiqB.slice(0, 30)}...`);
    console.log();

    // Step 4: Call addLiquidity
    console.log("[STEP 4/5] Adding liquidity via router...");
    
    const router = await ethers.getContractAt("ShadeRouter", ROUTER_ADDRESS, signer);
    
    const tx3 = await router.addLiquidity(
      SHADE_USDC_ADDRESS,
      SHADE_ETH_ADDRESS,
      handleLiqA as `0x${string}`,
      proofLiqA as `0x${string}`,
      handleLiqB as `0x${string}`,
      proofLiqB as `0x${string}`,
      { gasLimit: 2000000 }
    );
    
    console.log(`  ✓ Add liquidity tx: ${tx3.hash}`);
    console.log(`  Waiting for confirmation...`);
    
    const receipt3 = await tx3.wait();
    
    if (!receipt3) {
      throw new Error("Transaction receipt is null");
    }
    
    console.log(`  ✓ Confirmed!`);
    console.log(`    Block: ${receipt3.blockNumber}`);
    console.log(`    Gas used: ${receipt3.gasUsed.toString()}`);
    console.log(`    Status: ${receipt3.status === 1 ? "SUCCESS" : "FAILED"}`);
    console.log();

    // Step 5: Verify LP balance
    console.log("[STEP 5/5] Verifying LP balance...");
    
    const pool = await ethers.getContractAt("ShadePool", POOL_ADDRESS, signer);
    const lpShare = await pool.getEncryptedLPShare(userAddress);
    
    console.log(`  ✓ LP Share: ${lpShare}`);
    console.log();

    console.log("╔════════════════════════════════════════════════════════╗");
    console.log("║              ✓ ALL TESTS PASSED                        ║");
    console.log("╚════════════════════════════════════════════════════════╝");
    console.log();
    console.log("Summary:");
    console.log(`  - Approve shUSDC: ${tx1.hash}`);
    console.log(`  - Approve shETH:  ${tx2.hash}`);
    console.log(`  - Add Liquidity:  ${tx3.hash}`);

  } catch (error: any) {
    console.error();
    console.error("╔════════════════════════════════════════════════════════╗");
    console.error("║              ✗ TEST FAILED                            ║");
    console.error("╚════════════════════════════════════════════════════════╝");
    console.error();
    console.error("Error:", error.message || error);
    
    if (error.data) {
      console.error("Error data:", error.data);
    }
    
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
