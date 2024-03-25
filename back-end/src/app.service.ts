import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';


const ERC20ContractABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

const ERC721ContractABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "name": "owner",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  // Additional ERC-721 functions go here...
];

@Injectable()
export class InfuraService {
  private readonly lineaProvider: ethers.JsonRpcProvider;
  private readonly lineaGoerliProvider: ethers.JsonRpcProvider;


  constructor() {
    dotenv.config();
    this.lineaProvider = new ethers.JsonRpcProvider(process.env.INFURA_LINEA_MAINNET_ENDPOINT);
    this.lineaGoerliProvider = new ethers.JsonRpcProvider(process.env.INFURA_LINEA_GOERLI_ENDPOINT);
  }

  async getBalance(address: string, network: 'linea' | 'linea-goerli'): Promise<string> {
    const tmpProvider = network === 'linea' ? this.lineaProvider : this.lineaGoerliProvider;
    const balance = await tmpProvider.getBalance(address);

    return ethers.formatEther(balance);
  }


  async getERC20Balance(tokenContractAddress: string, walletAddress: string, network: 'linea' | 'linea-goerli'): Promise<string> {
    const tmpProvider = network === 'linea' ? this.lineaProvider : this.lineaGoerliProvider;

    // Connect to the contract using ethers.Contract
    const tokenContract = new ethers.Contract(tokenContractAddress, ERC20ContractABI, tmpProvider);

    // Fetch token balance
    const balance = await tokenContract.balanceOf(walletAddress);

    // Fetch token decimals
    const decimals = await tokenContract.decimals();

    // Adjust balance according to decimals
    const balanceAdjusted = BigInt(balance)

    // Convert balance to human-readable format
    const balanceInEther = ethers.formatUnits(balanceAdjusted, decimals);

    return balanceInEther;
  }

  async getERC721Balance(tokenContractAddress: string, walletAddress: string, network: 'linea' | 'linea-goerli'): Promise<string> {
    const tmpProvider = network === 'linea' ? this.lineaProvider : this.lineaGoerliProvider;

    // Connect to the contract using ethers.Contract
    const tokenContract = new ethers.Contract(tokenContractAddress, ERC721ContractABI, tmpProvider);

    // Fetch token balance
    const balance = await tokenContract.balanceOf(walletAddress);

    return balance;
  }
}