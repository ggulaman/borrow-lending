import { HardhatUserConfig } from "hardhat/config";
import dotenv from 'dotenv';
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat"

dotenv.config();
const PRIVATE_KEY = process.env.PRIVATE_KEY ?? '0x'
const SEPOLIA_RPC = process.env.SEPOLIA_RPC ?? ''
const LINEA_SEPOLIA_RPC = process.env.LINEA_SEPOLIA_RPC ?? ''

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    sepolia: {
      url: SEPOLIA_RPC,
      accounts: [PRIVATE_KEY]
    },
    linea_sepolia: {
      url: LINEA_SEPOLIA_RPC,
      accounts: [PRIVATE_KEY]
    }
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  },
  // typechain: {
  //   outDir: "typechain",
  //   target: "ethers-v5",
  // },
};

export default config;
