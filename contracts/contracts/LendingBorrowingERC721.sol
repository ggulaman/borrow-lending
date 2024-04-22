// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

/*
 * @title TokenSwap
 * @dev A contract for swapping ERC721 tokens for ERC20 tokens
 */
contract LendingBorrowingERC721 is ERC721Holder {
    using SafeERC20 for IERC20;

    /*
     * @dev Declaration of variables
     */
    IERC721Enumerable public alphabetCollection; // ERC721 collection contract
    IERC20 public erc20Token; // ERC20 token contract
    uint256 public tokenAmount = 100; // Amount of ERC20 tokens to be swapped for each ERC721 token

    /*
     * @dev Mapping to track deposited tokens by user
     */
    mapping(address => uint256) public depositedTokens;

    /*
     * @dev Events for token swaps and withdrawals
     */
    event TokensSwapped(address indexed user, uint256 indexed tokenId);
    event TokensWithdrawn(address indexed user, uint256 indexed tokenId);

    /*
     * @dev Constructor to initialize the contract with addresses of ERC721 and ERC20 tokens
     * @params _alphabetCollectionAddress Address of the ERC721 token representing the Alphabet collection
     * @params _erc20TokenAddress Address of the ERC20 token users receive in exchange
     */
    constructor(address _alphabetCollectionAddress, address _erc20TokenAddress) {
        alphabetCollection = IERC721Enumerable(_alphabetCollectionAddress);
        erc20Token = IERC20(_erc20TokenAddress);
    }

    /*
     * @dev Function to swap ERC721 tokens for ERC20 tokens
     */
    function swapToken() external {
        // Ensure the contract has ERC20 tokens
        require(erc20Token.balanceOf(address(this)) >= tokenAmount, "Unavailable ERC20 tokens");
        // Ensure user hasn't already deposited tokens
        require(depositedTokens[msg.sender] == 0, "Already deposited");
        // Get the number of ERC721 tokens owned by the user
        uint256 tokenCount = alphabetCollection.balanceOf(msg.sender);
        // Ensure user has at least one ERC721 token
        require(tokenCount > 0, "No tokens to swap");

        // Loop through the user's ERC721 tokens
        for (uint256 i = 0; i < tokenCount; i++) {
            uint256 tokenId = alphabetCollection.tokenOfOwnerByIndex(msg.sender, i);
            // Check if the user owns the token
            if (alphabetCollection.ownerOf(tokenId) == msg.sender) {
                // Transfer ERC721 token to the contract
                alphabetCollection.safeTransferFrom(msg.sender, address(this), tokenId);
                // Transfer ERC20 tokens to the user
                erc20Token.safeTransfer(msg.sender, tokenAmount);
                // Record the deposited token
                depositedTokens[msg.sender] = tokenId +1;
                // Emit an event
                emit TokensSwapped(msg.sender, tokenId);
                return;
            }
        }
        // Revert if no eligible tokens are found
        revert("No eligible tokens found");
    }

    /*
     * @dev Function to withdraw deposited ERC721 tokens and ERC20 tokens
     */
    function withdrawToken() external {
        // Ensure user has deposited tokens
        require(depositedTokens[msg.sender] != 0, "Not deposited");
        // Ensure user has enough ERC20 tokens to withdraw
        require(erc20Token.balanceOf(msg.sender) >= tokenAmount, "Insufficient ERC20 balance");
        // Get the deposited token ID
        uint256 tokenId = depositedTokens[msg.sender] - 1;
        // Reset deposited token record
        depositedTokens[msg.sender] = 0;
        // Transfer ERC20 tokens from the user to the contract
        erc20Token.safeTransferFrom(msg.sender, address(this), tokenAmount);
        // Transfer ERC721 token from the contract to the user
        alphabetCollection.safeTransferFrom(address(this), msg.sender, tokenId);
        // Emit an event
        emit TokensWithdrawn(msg.sender, tokenId);
    }
}