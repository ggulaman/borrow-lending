import { expect } from "chai";
import { ethers } from "hardhat";
import { ProtocolERC721__factory, ProtocolERC721 } from "../typechain-types";
import { Signer } from 'ethers';

describe("AlphabetCollection", function () {
  let protocolERC721: ProtocolERC721;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer
  let addrs: Signer[];
  const MAX_TOKENS = 27;


  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const protocolERC721Factory = (await ethers.getContractFactory(
      "ProtocolERC721", owner
    )) as ProtocolERC721__factory;

    protocolERC721 = await protocolERC721Factory.deploy()
  });

  it("Should mint a token", async function () {
    await protocolERC721.mintToken();
    expect(await protocolERC721.totalSupply()).to.equal(1);
  });

  it("Should not mint more than max tokens", async function () {
    for (let i = 0; i < MAX_TOKENS; i++) {
      // generate a ranmdom wallet
      let randomWallet = ethers.Wallet.createRandom();
      randomWallet = randomWallet.connect(ethers.provider);

      // send ETH to the new wallet so it can perform a tx
      await addr1.sendTransaction({ to: randomWallet.address, value: ethers.parseEther("1") });

      await protocolERC721.connect(randomWallet).mintToken();
    }
    await expect(protocolERC721.mintToken()).to.be.revertedWith("Collection is full");
  });

  it("Should not mint if already minted", async function () {
    await protocolERC721.mintToken();
    await expect(protocolERC721.mintToken()).to.be.revertedWith("Address has already minted a token");
  });
});