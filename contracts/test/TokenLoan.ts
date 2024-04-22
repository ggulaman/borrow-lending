import { expect } from "chai";
import { ethers } from "hardhat";
import { FactoryTokenLoan } from "../typechain-types";
import { Signer } from 'ethers';
import { ProtocolERC20__factory, ProtocolERC20, TokenLoan } from "../typechain-types";

describe('FactoryTokenLoan', function () {
  let loanFactory: FactoryTokenLoan;
  let offeredERC20: ProtocolERC20;
  let collateralERC20: ProtocolERC20;
  let loan: TokenLoan;
  let deployer: Signer;
  let newDeployer: Signer;
  let owner: Signer;
  let lender: Signer;
  let borrower: Signer;
  let amountOffered: number;
  let amountCollateral: number;
  let duration: number;
  let lenderInitBalance: bigint;


  beforeEach(async function () {
    [deployer, newDeployer, owner, lender, borrower] = await ethers.getSigners();
    amountOffered = 100;
    amountCollateral = 280;
    duration = 3600; // 1 hour


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

    // Transfer amountOffered units to lender address of offered token
    //await collateralERC20.transfer(lender, 300);

    await offeredERC20.transfer(lender, amountOffered);

    // Transfer 300 token units to lender address of borrower token
    await collateralERC20.transfer(borrower, amountCollateral);
    //await offeredERC20.transfer(borrower, 300);

    // Deploy Loan Factory SC
    loanFactory = await ethers.deployContract("FactoryTokenLoan", []);

    // Create a first Loan
    await loanFactory.connect(lender).createLoan(
      offeredERC20.getAddress(),
      collateralERC20.getAddress(),
      amountOffered,
      amountCollateral,
      duration,
      borrower,
    );

    // Get first loan address
    const addressOfFirstLoan = (await loanFactory.getAllLoans())[0];
    loan = await ethers.getContractAt("TokenLoan", addressOfFirstLoan);

    // Lender to deposite offer
    lenderInitBalance = await offeredERC20.balanceOf(lender);

    await offeredERC20.connect(lender).approve(loan, amountOffered);
    // Call the initiateLoan function
    await loan.connect(lender).initiateLoan();

  });

  it('Should allow to deposite the offer', async function () {
    // Perform assertions
    //expect(await loan.active()).to.be.true;
    expect(await offeredERC20.balanceOf(lender)).to.equal(lenderInitBalance - 100n);
  });

  it('Should allow to withdraw balance before any collateral added', async function () {

    await loan.connect(lender).withdrawOfferedToken();

    // Perform assertions
    expect(await loan.active()).to.be.false;
  });

  it('Should borrow tokens by providing collateral', async function () {
    // Call the borrow function
    expect(await collateralERC20.balanceOf(loan)).to.equal(0);
    await collateralERC20.connect(borrower).approve(loan, amountCollateral);
    await loan.connect(borrower).borrow(amountCollateral);

    // Perform assertions
    expect(await loan.active()).to.be.true;
    expect(await collateralERC20.balanceOf(loan)).to.equal(amountCollateral);

    it('Should repay the loan', async function () {
      // Advance time to simulate loan duration completion
      await ethers.provider.send('evm_increaseTime', [duration * 2]);


      expect(await loan.active()).to.be.true;

      // Call the repayLoan function
      await loan.connect(borrower).repayLoan();

      // Perform assertions
      expect(await loan.active()).to.be.false;
    });

  });
});