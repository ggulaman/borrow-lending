
import { ethers, BrowserProvider } from "ethers";
import { useCallback } from "react";

const LENDING_ABI = [
  {
    "inputs": [],
    "name": "swapToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const ERC20_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
]

const ERC721_ABI = [
  {
    "inputs": [],
    "name": "mintToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
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
]

export const useWeb3 = () => {


  const mintNFT = useCallback(async (provider: BrowserProvider) => {
    try {
      const signer = await provider.getSigner();

      const erc721Contract = new ethers.Contract(
        process.env.REACT_APP_ERC_721_ADDRESSS ?? '0xC86B41f4612E9edc2d86074F99aB565E9803c685',
        ERC721_ABI,
        signer
      );

      const tx = await erc721Contract.mintToken();
      await tx.wait();
    } catch (error) {
      console.error(`Transaction not executed with error: ${error}`)
    }

  }, [])


  const approveNFTTransfer = useCallback(async (provider: BrowserProvider) => {
    try {
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      const erc721Contract = new ethers.Contract(
        process.env.REACT_APP_ERC_721_ADDRESSS ?? '0xC86B41f4612E9edc2d86074F99aB565E9803c685',
        ERC721_ABI,
        signer
      );

      const tokenIdIndex = await erc721Contract.tokenOfOwnerByIndex(signerAddress, 0)
      console.log(`tokennID is ${tokenIdIndex}`)
      const tx = await erc721Contract.approve(process.env.REACT_APP_FACTORY_LOAN_TOKEN_ADDRESS, tokenIdIndex);
      await tx.wait();
    } catch (error) {
      console.error(`Transaction not executed with error: ${error}`)
    }
  }, [])

  const depositNFT = useCallback(async (provider: BrowserProvider) => {
    try {
      const signer = await provider.getSigner();

      const lendingContract = new ethers.Contract(
        process.env.REACT_APP_FACTORY_LOAN_TOKEN_ADDRESS ?? '0x080D4568F8B1E028F9CdaeE8f472ae702D365b56',
        LENDING_ABI,
        signer
      );

      const tx = await lendingContract.swapToken();
      await tx.wait();
    } catch (error) {
      console.error(`Transaction not executed with error: ${error}`)
    }

  }, []);

  const approveERC20Transfer = useCallback(async (provider: BrowserProvider) => {
    try {
      const signer = await provider.getSigner();

      const erc20Contract = new ethers.Contract(
        process.env.REACT_APP_ERC_20_ADDRESSS ?? '0xD3E51288aBF278feE0DaB592958B94b7360fB7A8',
        ERC20_ABI,
        signer
      );

      const tx = await erc20Contract.approve(process.env.REACT_APP_FACTORY_LOAN_TOKEN_ADDRESS, ethers.parseEther("0.5"));
      await tx.wait();
    } catch (error) {
      console.error(`Transaction not executed with error: ${error}`)
    }
  }, [])


  const depositERC20 = useCallback(async (provider: BrowserProvider) => {
    try {
      const signer = await provider.getSigner();

      const lendingContract = new ethers.Contract(
        process.env.REACT_APP_FACTORY_LOAN_TOKEN_ADDRESS ?? '0x080D4568F8B1E028F9CdaeE8f472ae702D365b56',
        LENDING_ABI,
        signer
      );

      const tx = await lendingContract.withdrawToken();
      await tx.wait();
    } catch (error) {
      console.error(`Transaction not executed with error: ${error}`)
    }

  }, []);

  return {
    mintNFT,
    approveNFTTransfer,
    depositNFT,
    approveERC20Transfer,
    depositERC20
  }

}



