// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenLoan {
    address public owner;
    address public lender;
    address public borrower;
    IERC20 public tokenOffered;
    IERC20 public tokenCollateral;
    uint256 public amountOffered;
    uint256 public amountCollateral;
    uint256 public duration;
    uint256 public startTime;
    bool public active;

    event LoanInitiated(address indexed _lender, address indexed _borrower, uint256 _amountOffered, uint256 _amountCollateral, uint256 _duration);
    event LoanCompleted(address indexed _lender, address indexed _borrower, uint256 _amountOffered, uint256 _amountCollateral);

    /**
     * @dev Constructor to initialize the TokenLoan contract with initial parameters.
     */
    constructor(
        address _tokenOffered,
        address _tokenCollateral,
        uint256 _amountOffered,
        uint256 _amountCollateral,
        uint256 _duration,
        address _owner
    ) {
        owner = _owner;
        tokenOffered = IERC20(_tokenOffered);
        tokenCollateral = IERC20(_tokenCollateral);
        amountOffered = _amountOffered;
        amountCollateral = _amountCollateral;
        duration = _duration;
        active = false;
    }

    /**
     * @dev Modifier to check if the caller is the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    /**
     * @dev Modifier to check if the caller is the lender.
     */
    modifier onlyLender() {
        require(msg.sender == lender, "Only lender can call this function");
        _;
    }

    /**
     * @dev Modifier to check if the caller is the borrower.
     */
    modifier onlyBorrower() {
        require(msg.sender == borrower, "Only borrower can call this function");
        _;
    }

    /**
     * @dev Modifier to check if the loan is active.
     */
    modifier loanActive() {
        require(active, "Loan is not active");
        _;
    }

    /**
     * @dev Function to initiate a loan.
     */
    function initiateLoan() external {
        require(!active, "Loan already initiated");
        require(tokenOffered.transferFrom(msg.sender, address(this), amountOffered), "Transfer of offered token failed");
        lender = msg.sender;
        //active = true;
        startTime = block.timestamp;
        emit LoanInitiated(lender, msg.sender, amountOffered, amountCollateral, duration);
    }

    /**
     * @dev Function to borrow tokens by providing collateral.
     * @param _amountCollateral The amount of collateral to provide.
     */
    function borrow(uint256 _amountCollateral) external {
        require(tokenOffered.balanceOf(address(this)) >= amountOffered, "Offered amount not filled");
        require(_amountCollateral >= amountCollateral, "Insufficient collateral");
        require(tokenCollateral.transferFrom(msg.sender, address(this), _amountCollateral), "Transfer of collateral token failed");
        borrower = msg.sender;
        active = true;
        startTime = block.timestamp;
        emit LoanInitiated(lender, borrower, amountOffered, _amountCollateral, duration);
    }

    /**
     * @dev Function for the borrower to repay the loan.
     */
    function repayLoan() external onlyBorrower loanActive {
        require(block.timestamp >= startTime + duration, "Loan duration not completed yet");
        uint256 totalRepayment = amountOffered ;
        require(tokenOffered.transfer(lender, totalRepayment), "Transfer of offered token failed");
        require(tokenCollateral.transfer(borrower, amountCollateral), "Transfer of collateral token failed");
        emit LoanCompleted(lender, borrower, amountOffered, amountCollateral);
        active = false;
    }

    /**
     * @dev Function for the lender to withdraw offered tokens.
     */
    function withdrawOfferedToken() external onlyLender {
        require(!active, "Loan is still active");
        require(tokenOffered.transfer(lender, amountOffered), "Transfer of offered token failed");
        active = false;
    }

    /**
     * @dev Function for the borrower to withdraw collateral.
     */
    function withdrawCollateral() external onlyBorrower {
        require(!active, "Loan is still active");
        require(tokenCollateral.transfer(borrower, amountCollateral), "Transfer of collateral token failed");
        active = false;
    }
}