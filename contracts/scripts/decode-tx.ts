import { ethers } from "hardhat";

async function main() {
  const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/2bc52207ae9541df8c9ad7f21468f950");
  
  const txHash = "0xe66567ec20315fe9e00750f2ccc7f5120a013774a402edaafa8e54539effd7c5";
  
  console.log("Fetching transaction:", txHash);
  
  const tx = await provider.getTransaction(txHash);
  const receipt = await provider.getTransactionReceipt(txHash);
  
  console.log("\nTransaction details:");
  console.log("From:", tx?.from);
  console.log("To:", tx?.to);
  console.log("Data:", tx?.data);
  console.log("Value:", tx?.value.toString());
  
  console.log("\nReceipt:");
  console.log("Status:", receipt?.status);
  console.log("Gas used:", receipt?.gasUsed.toString());
  
  // Try to decode the data
  if (tx?.data) {
    // Check if it's an approve call
    const approveSelector = tx.data.slice(0, 10);
    console.log("\nFunction selector:", approveSelector);
    
    // Decode approve(address,bytes32,bytes)
    // selector: 0xe73a2... (need to calculate)
    try {
      // Get token contract
      const token = await ethers.getContractAt("ShadeToken", tx.to!);
      const iface = token.interface;
      
      // Try to parse transaction
      const parsed = iface.parseTransaction({ data: tx.data, value: tx.value });
      console.log("\nParsed function:", parsed?.name);
      console.log("Args:", parsed?.args);
    } catch (e) {
      console.log("Could not parse with ShadeToken ABI:", (e as Error).message);
      
      // Manual decode
      const data = tx.data;
      console.log("\nManual decode:");
      console.log("Selector:", data.slice(0, 10));
      console.log("Arg1 (spender):", "0x" + data.slice(10, 74));
      console.log("Arg2 (bytes32):", "0x" + data.slice(74, 138));
      console.log("Arg3 offset:", data.slice(138, 202));
      console.log("Rest (proof):", data.slice(202));
    }
  }
}

main().catch(console.error);
