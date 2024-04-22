import { expect } from "chai";
import { ethers } from "hardhat";
import { FactoryTokenLoan } from "../typechain-types";
import { Signer } from 'ethers';
import { ProtocolERC20__factory, ProtocolERC20 } from "../typechain-types";

describe('FactoryTokenLoan', function () {
  let loanFactory: FactoryTokenLoan;
  let offeredERC20: ProtocolERC20;
  let collateralERC20: ProtocolERC20;
  let deployer: Signer;
  let newDeployer: Signer;
  let owner: Signer;
  let lender: Signer;
  let borrower: Signer;

  beforeEach(async function () {
    [deployer, newDeployer, owner, lender, borrower] = await ethers.getSigners();

    // Deploy Loan Factory SC
    loanFactory = await ethers.deployContract("FactoryTokenLoan", []);

    // Deploy protocolERC20 token
    const protocolERC20Factory = (await ethers.getContractFactory(
      "ProtocolERC20", owner
    )) as ProtocolERC20__factory;

    const totalSupply = (10 ** 9).toString()

    offeredERC20 = await protocolERC20Factory.deploy(
      ethers.parseEther(totalSupply),
    )

    collateralERC20 = await protocolERC20Factory.deploy(
      ethers.parseEther(totalSupply),
    )

    // Transfer 50 token units to lender address of offered token
    await offeredERC20.transfer(lender, 50);

    // Transfer 50 token units to lender address of borrower token
    await collateralERC20.transfer(borrower, 50);
  });

  it('Should create a new loan', async function () {
    const amountOffered = 100;
    const amountCollateral = 200;
    const duration = 3600; // 1 hour

    await loanFactory.createLoan(
      offeredERC20.getAddress(),
      collateralERC20.getAddress(),
      amountOffered,
      amountCollateral,
      duration,
      borrower,
    );

    const loans = await loanFactory.getAllLoans();
    expect(loans.length).to.equal(1);

    const loanAddress = loans[0];
  });

  it('Should fail if transfering ownsership from a non-owner', async function () {
    await expect(
      loanFactory.connect(owner).transferOwnership(newDeployer)
    ).to.be.revertedWith('Only owner can call this function');
  });


  it('Should transfer ownership of the factory', async function () {
    await loanFactory.connect(deployer).transferOwnership(newDeployer);

    const ownerAddress = await loanFactory.owner();
    expect(ownerAddress).to.equal(newDeployer);
  });

});