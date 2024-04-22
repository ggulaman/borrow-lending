import { expect } from "chai";
import { ethers } from "hardhat";
import { ProtocolERC20__factory, ProtocolERC20 } from "../typechain-types";
import { Signer } from 'ethers';

describe("Token contract", function () {

  let protocolERC20: ProtocolERC20;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer
  let addrs: Signer[];

  beforeEach(async function () {

    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const protocolERC20Factory = (await ethers.getContractFactory(
      "ProtocolERC20", owner
    )) as ProtocolERC20__factory;

    const totalSupply = (10 ** 9).toString()

    protocolERC20 = await protocolERC20Factory.deploy(
      ethers.parseEther(totalSupply),
    )
  });

  describe("Deployment", function () {
    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await protocolERC20.balanceOf(owner);
      expect(await protocolERC20.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await protocolERC20.transfer(addr1, 50);
      const addr1Balance = await protocolERC20.balanceOf(addr1);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await protocolERC20.connect(addr1).transfer(addr2, 50);
      const addr2Balance = await protocolERC20.balanceOf(addr2);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await protocolERC20.balanceOf(owner);

      // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
      // `require` will evaluate false and revert the transaction.

      await expect(
        protocolERC20.connect(addrs[0]).transfer(owner, 1)
      ).to.be.revertedWithCustomError(protocolERC20, 'ERC20InsufficientBalance');

      // Owner balance shouldn't have changed.
      expect(await protocolERC20.balanceOf(owner)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await protocolERC20.balanceOf(owner);

      // Transfer 100 tokens from owner to addr1.
      await protocolERC20.transfer(addr1, 100);

      // Transfer another 50 tokens from owner to addr2.
      await protocolERC20.transfer(addr2, 50);

      // Check balances.
      const finalOwnerBalance = await protocolERC20.balanceOf(owner);
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150n);

      const addr1Balance = await protocolERC20.balanceOf(addr1);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await protocolERC20.balanceOf(addr2);
      expect(addr2Balance).to.equal(50);
    });

  });
});
