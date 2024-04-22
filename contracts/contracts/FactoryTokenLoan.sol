// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TokenLoan.sol";

contract FactoryTokenLoan {
    address public owner;
    address[] public allLoans;
    mapping(address => bool) public isLoan;

    event LoanCreated(address indexed loanAddress, address indexed lender, address indexed borrower, uint256 amountOffered, uint256 amountCollateral, uint256 duration);

    /**
     * @dev Constructor to initialize the FactoryTokenLoan contract with the owner.
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Modifier to check if the caller is the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    /**
     * @dev Function to create a new loan contract.
     * @param _tokenOffered Address of the token offered for the loan.
     * @param _tokenCollateral Address of the token provided as collateral.
     * @param _amountOffered Amount of token offered.
     * @param _amountCollateral Amount of token provided as collateral.
     * @param _duration Duration of the loan.
     * @param _loanOwner Address of the owner of the loan.
     * @return Address of the newly created loan contract.
     */
    function createLoan(
        address _tokenOffered,
        address _tokenCollateral,
        uint256 _amountOffered,
        uint256 _amountCollateral,
        uint256 _duration,
        address _loanOwner
    ) external returns (address) {
        TokenLoan newLoan = new TokenLoan(
            _tokenOffered,
            _tokenCollateral,
            _amountOffered,
            _amountCollateral,
            _duration,
            _loanOwner
        );
        allLoans.push(address(newLoan));
        isLoan[address(newLoan)] = true;
        emit LoanCreated(address(newLoan), msg.sender, address(0), _amountOffered, _amountCollateral, _duration);
        return address(newLoan);
    }

    /**
     * @dev Function to get all created loan contracts.
     * @return Array of addresses representing all loan contracts.
     */
    function getAllLoans() external view returns (address[] memory) {
        return allLoans;
    }

    /**
     * @dev Function to transfer ownership of the contract.
     * @param _newOwner Address of the new owner.
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        owner = _newOwner;
    }
}
