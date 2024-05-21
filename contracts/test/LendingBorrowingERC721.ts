import { expect } from "chai";
import { ethers } from "hardhat";
import { ProtocolERC721__factory, ProtocolERC721, ProtocolERC20__factory, ProtocolERC20, LendingBorrowingERC721, LendingBorrowingERC721__factory } from "../typechain-types";
import { Signer } from 'ethers';


describe("LendingBorrowingERC721", function () {
  let lendingBorrowingERC721: LendingBorrowingERC721;
  let protocolERC721: ProtocolERC721;
  let protocolERC20: ProtocolERC20;
  let lendingBorrowingERC721Address: string;
  let protocolERC721Address: string;
  let protocolERC20Address: string;
  let owner: Signer;
  let user: Signer;
  let user2: Signer;
  beforeEach(async function () {
    [owner, user, user2] = await ethers.getSigners();

    // Deploy ERC721 AlphabetCollection contract
    const protocolERC721Factory = (await ethers.getContractFactory(
      "ProtocolERC721", owner
    )) as ProtocolERC721__factory;

    protocolERC721 = await protocolERC721Factory.deploy()
    protocolERC721Address = await protocolERC721.getAddress()


    // Deploy ERC20 Token contract
    const protocolERC20Factory = (await ethers.getContractFactory(
      "ProtocolERC20", owner
    )) as ProtocolERC20__factory;

    const totalSupply = (18 * 10 ^ (6 + 18)).toString()

    protocolERC20 = await protocolERC20Factory.deploy(
      ethers.parseEther(totalSupply),
    )
    protocolERC20Address = await protocolERC20.getAddress()

    // Deploy LendingBorrowingERC721 contract
    const lendingBorrowingERC721Factory = (await ethers.getContractFactory(
      "LendingBorrowingERC721", owner
    )) as LendingBorrowingERC721__factory;

    lendingBorrowingERC721 = await lendingBorrowingERC721Factory.deploy(protocolERC721Address, protocolERC20Address)
    lendingBorrowingERC721Address = await lendingBorrowingERC721.getAddress()

    // Transfer ERC20 to lendingBorrowingERC721f
    await protocolERC20.connect(owner).transfer(lendingBorrowingERC721, 500000000000000000n);

  });

  it("Should swap ERC721 tokens for ERC20 tokens", async function () {
    // Mint ERC721 token to user
    await protocolERC721.connect(user).mintToken();

    // Approve LendingBorrowingERC721 contract to spend ERC721 token
    await protocolERC721.connect(user).setApprovalForAll(lendingBorrowingERC721, true);

    // Perform token swap
    await lendingBorrowingERC721.connect(user).swapToken();

    // Check if user received ERC20 tokens
    const balance = await protocolERC20.balanceOf(await user.getAddress());
    expect(balance).to.equal(500000000000000000n);
  });

  it("Should not swap if no ERC721 tokens are owned by user", async function () {
    // Attempt token swap without owning ERC721 tokens
    await expect(lendingBorrowingERC721.connect(user).swapToken()).to.be.revertedWith("No tokens to swap");
  });

  it("Should not swap if already deposited", async function () {
    // Mint ERC721 token to user
    await protocolERC721.connect(user).mintToken();

    // Approve LendingBorrowingERC721 contract to spend ERC721 token
    await protocolERC721.connect(user).setApprovalForAll(lendingBorrowingERC721, true);

    // Perform token swap once
    await lendingBorrowingERC721.connect(user).swapToken();

    // Transfer ERC20 to lendingBorrowingERC721
    await protocolERC20.connect(owner).transfer(lendingBorrowingERC721, 500000000000000000n);

    // Attempt to perform token swap again
    await expect(lendingBorrowingERC721.connect(user).swapToken()).to.be.revertedWith("Already deposited");
  });

  it("Should withdraw deposited ERC721 tokens and ERC20 tokens", async function () {
    // Mint ERC721 token to user
    await protocolERC721.connect(user).mintToken();

    // Approve LendingBorrowingERC721 contract to spend ERC721 token
    await protocolERC721.connect(user).setApprovalForAll(lendingBorrowingERC721, true);

    // Perform token swap
    await lendingBorrowingERC721.connect(user).swapToken();

    // Allow lendingBorrowingERC721 to trasnfer ERC20 tokens
    await protocolERC20.connect(user).approve(lendingBorrowingERC721, 500000000000000000n);

    // Withdraw deposited tokens
    await lendingBorrowingERC721.connect(user).withdrawToken();

    // Check if user no longer has deposited tokens
    const balance = await protocolERC20.balanceOf(await user.getAddress());
    expect(balance).to.equal(0);

    // Check if user received deposited ERC721 token back
    const tokenId = await protocolERC721.balanceOf(await user.getAddress());
    expect(tokenId).to.equal(1);
  });

  it("Should not withdraw if no tokens are deposited", async function () {
    // Attempt to withdraw tokens without depositing
    await expect(lendingBorrowingERC721.connect(user).withdrawToken()).to.be.revertedWith("Not deposited");
  });

});