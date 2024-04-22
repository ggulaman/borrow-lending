# borrow-lending

This is a demonstration dApp, to show how 3 of the Consensys products are optimal solutions for borrowing/lending app.

The Consensys products used in this demo are:
- Linea
- Metamask
- Infura

# Deployement
###### IMPORTANT: The backend will deactivate if it doesn't receive requests for a certain period. Therefore, when you initially access it and click on the "Connect" button, it might take some time for the backend to wake up.
This repo is currently deployed on https://borrow-lending.netlify.app/ using:
- netlify.com to deploy the front-end
- render.io to deploy the back-end

The addresses of the smart contracts in Sepolia Network are:
- ERC20 token borrowed by users: **0xD3E51288aBF278feE0DaB592958B94b7360fB7A8**
- ERC721 tokens used as collateral by users: **0xC86B41f4612E9edc2d86074F99aB565E9803c685**
- Lending / Borrowing smart contract: **0x080D4568F8B1E028F9CdaeE8f472ae702D365b56**

# Front-end
It's a react web app using Typescript, supported by:
- Metamask SDK, to easily connect Metamask to the dApp
- Axios to handle the HTTP request
- ethers.js to interact with the smart contracts
  
# Back-end
It's a Nest Typescript app, connected to an Infura Node, which pulls data from the blockchain.

# Smart Contracts
Written in solidity and using hardhat to support the development.
