import { ethers } from "hardhat";
import { createInstance, SepoliaConfig } from "@zama-fhe/relayer-sdk/node";

// Contract addresses (FINAL DEPLOYED 2026-03-31)
const SHADE_USDC_ADDRESS = "0x7D0310a9aa79f1a0000369AEDb6FA6a4a406232a";
const POOL_ADDRESS = "0xB5e69D0FCE7743C46Cd0D354FAe72BcfB31Ab5C0";
const RPC_URL = "https://sepolia.infura.io/v3/2bc52207ae9541df8c9ad7f21468f950";

// Amount to approve: 5 shUSDC (6 decimals)
const APPROVE_AMOUNT = BigInt(5 * 10 ** 6);

async function main() {
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║     TEST: ConfidentialERC20 Encrypted Approve          ║");
  console.log("╚════════════════════════════════════════════════════════╝");
  console.log();

  // Get signer from Hardhat (should be the user's wallet)
  const [signer] = await ethers.getSigners();
  const userAddress = await signer.getAddress();
  
  console.log(`✓ Signer: ${userAddress}`);
  console.log(`✓ Token: ${SHADE_USDC_ADDRESS}`);
  console.log(`✓ Spender (Pool): ${POOL_ADDRESS}`);
  console.log(`✓ Amount: ${APPROVE_AMOUNT.toString()} (5 shUSDC)`);
  console.log();

  try {
    // Step 1: Initialize fhEVM SDK
    console.log("[1/4] Initializing fhEVM SDK...");
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const instance = await createInstance({
      ...SepoliaConfig,
      network: provider,
      relayerUrl: "https://relayer.testnet.zama.org",
    });
    console.log("✓ fhEVM SDK initialized");
    console.log();

    // Step 2: Create encrypted input
    console.log("[2/4] Creating encrypted input for token contract...");
    const buffer = instance.createEncryptedInput(SHADE_USDC_ADDRESS, userAddress);
    
    // IMPORTANT: Matching our euint64 migration
    buffer.add64(APPROVE_AMOUNT);
    
    const encrypted = await buffer.encrypt();
    
    const handle = "0x" + Buffer.from(encrypted.handles[0]).toString("hex");
    const proof = "0x" + Buffer.from(encrypted.inputProof).toString("hex");
    
    console.log(`✓ Handle: ${handle.slice(0, 30)}...${handle.slice(-8)}`);
    console.log(`✓ Proof: ${proof.slice(0, 30)}...${proof.slice(-8)}`);
    console.log();

    // Verify handle prefix
    const expectedPrefix = SHADE_USDC_ADDRESS.toLowerCase().slice(2);
    const actualPrefix = handle.slice(2, 42);
    
    if (actualPrefix !== expectedPrefix) {
      throw new Error(
        `Handle prefix mismatch! Expected: ${expectedPrefix}, Got: ${actualPrefix}`
      );
    }
    console.log("✓ Handle prefix verified (matches token contract)");
    console.log();

    // Step 3: Call approve
    console.log("[3/4] Calling approve(spender, handle, proof)...");
    
    // Use contract instance from Hardhat
    const tokenContract = await ethers.getContractAt("ShadeToken", SHADE_USDC_ADDRESS, signer);
    
    const tx = await tokenContract.approve(POOL_ADDRESS, handle as `0x${string}`, proof as `0x${string}`, {
      gasLimit: 1000000,
    });
    
    console.log(`✓ Transaction sent: ${tx.hash}`);
    console.log(`  Waiting for confirmation...`);
    
    const receipt = await tx.wait();
    
    if (!receipt) {
      throw new Error("Transaction receipt is null");
    }
    
    console.log(`✓ Transaction confirmed! Status: ${receipt.status === 1 ? "SUCCESS" : "FAILED"}`);
    console.log();

    // Step 4: Verify allowance
    console.log("[4/4] Verifying allowance...");
    const allowance = await tokenContract.allowance(userAddress, POOL_ADDRESS);
    console.log(`✓ Allowance: ${allowance.toString()}`);
    
    if (allowance >= APPROVE_AMOUNT) {
      console.log("✓ TEST PASSED: Allowance >= approved amount");
    } else {
      console.log("✗ TEST FAILED: Allowance < approved amount (Check if your account has enough balance)");
      process.exit(1);
    }

    console.log();
    console.log("╔════════════════════════════════════════════════════════╗");
    console.log("║              ✓ ALL TESTS PASSED                        ║");
    console.log("╚════════════════════════════════════════════════════════╝");

  } catch (error: any) {
    console.error();
    console.error("Error:", error.message || error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
