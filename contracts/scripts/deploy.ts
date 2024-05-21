const hre = require("hardhat");

async function main() {
  // Deploy ERC20 token
  const initialSupply = hre.ethers.parseEther("18000000");
  const ERC20Token = await hre.ethers.getContractFactory("ProtocolERC20");
  const erc20Token = await ERC20Token.deploy(initialSupply);

  console.log("ERC20 Token deployed to:", erc20Token.target);

  // Deploy ERC721 token
  const ERC721Token = await hre.ethers.getContractFactory("ProtocolERC721");
  const erc721Token = await ERC721Token.deploy();

  console.log("ERC721 Token deployed to:", erc721Token.target);

  // Deploy LendingBorrowingERC721
  const LendingBorrowingERC721 = await hre.ethers.getContractFactory("LendingBorrowingERC721");
  const lendingBorrowingERC721 = await LendingBorrowingERC721.deploy(erc721Token.target, erc20Token.target);

  console.log("LendingBorrowingERC721 deployed to:", lendingBorrowingERC721.target);

  // Transfer all ERC20 tokens to the LendingBorrowingERC721 contract
  const transferTx = await erc20Token.transfer(lendingBorrowingERC721.target, initialSupply);

  await transferTx.wait(); // Ensure the transaction is mined

  console.log(`Transferred ${hre.ethers.formatEther(initialSupply)} ERC20 tokens to LendingBorrowingERC721 at address:`, lendingBorrowingERC721.target);
}

// Adding this pattern to be able to use async/await everywhere and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});