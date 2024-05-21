import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { Contract } from 'ethers';

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
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
];

const ERC721ContractABI = [
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_TOKENS",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
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
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "tokenOfOwnerByIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
];

const LendingBorrowingERC721ABI = [{
  "inputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "name": "depositedTokens",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},];


@Injectable()
export class InfuraService {
  private readonly lendingBorrowingERC721Address = 'YOUR_LENDING_BORROWING_ERC721_ADDRESS';

  private readonly provider: ethers.JsonRpcProvider;
  private lendingBorrowingERC721Contract: Contract;
  private eRC721Contract: Contract;
  private eRC20Contract: Contract;

  constructor() {
    dotenv.config();
    this.provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC);
    this.initContract();

  }

  private initContract() {
    this.lendingBorrowingERC721Contract = new ethers.Contract(process.env.FACTORY_LOAN_TOKEN_ADDRESS, LendingBorrowingERC721ABI, this.provider);
    this.eRC721Contract = new ethers.Contract(process.env.ERC_721_ADDRESSS, ERC721ContractABI, this.provider);
    this.eRC20Contract = new ethers.Contract(process.env.ERC_20_ADDRESSS, ERC20ContractABI, this.provider);

  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address);

    return ethers.formatEther(balance);
  }


  async getERC20Balance(tokenContractAddress: string, walletAddress: string): Promise<string> {
    // Connect to the contract using ethers.Contract
    const tokenContract = new ethers.Contract(tokenContractAddress, ERC20ContractABI, this.provider);

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

  async getERC721Balance(tokenContractAddress: string, walletAddress: string): Promise<string> {

    // Connect to the contract using ethers.Contract
    const tokenContract = new ethers.Contract(tokenContractAddress, ERC721ContractABI, this.provider);

    // Fetch token balance
    const balance = await tokenContract.balanceOf(walletAddress);

    return balance;
  }

  async getIfUserDepositedNFT(address: string): Promise<boolean> {
    const depositNftIndex = await this.lendingBorrowingERC721Contract.depositedTokens(address);
    return depositNftIndex > 0;
  }

  async getIfUserOwnsNFT(address: string): Promise<boolean> {
    const balance = await this.eRC721Contract.balanceOf(address);
    return balance > 0;
  }

  async getAvailableNfts(): Promise<number> {
    const totalSupply = await this.eRC721Contract.totalSupply();
    const max_tokens = await this.eRC721Contract.MAX_TOKENS();
    return max_tokens - totalSupply;
  }

  async getHasERC20Allowance(owner: string, spender: string): Promise<boolean> {
    const total: number = await this.eRC20Contract.allowance(owner, spender);
    return total >= 500000000000000000n;
  }


  async getHasERC721Allowance(owner: string): Promise<boolean> {
    const balance: bigint = await this.eRC721Contract.balanceOf(owner);

    if (balance === 0n) return false;
    const tokenId: number = await this.eRC721Contract.tokenOfOwnerByIndex(owner, 0);
    const operatorAddress: string = await this.eRC721Contract.getApproved(tokenId);

    return operatorAddress === process.env.FACTORY_LOAN_TOKEN_ADDRESS;
  }

}