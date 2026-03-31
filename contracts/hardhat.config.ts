import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  paths: {
    sources: "./src",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    // Zama fhEVM co-processor runs ON Ethereum Sepolia (chain 11155111)
    // FHE precompile contracts are pre-deployed by Zama at fixed addresses on Sepolia
    fhevm_sepolia: {
      url: "https://sepolia.infura.io/v3/2bc52207ae9541df8c9ad7f21468f950",
      chainId: 11155111,
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
    },
    localhost: {
      url: "http://localhost:8545",
    },
  },
};

export default config;

