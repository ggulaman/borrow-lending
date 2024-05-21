// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract ProtocolERC721 is ERC721Enumerable {
    uint256 public constant MAX_TOKENS = 300;
    uint256 private _tokenCount;
    mapping(address => bool) private _hasMinted;

    constructor() ERC721("AlphabetCollection", "ABC") {}

    function mintToken() external {
        require(_tokenCount < MAX_TOKENS, "Collection is full");
        require(!_hasMinted[msg.sender], "Address has already minted a token");
        
        _safeMint(msg.sender, _tokenCount);
        _tokenCount++;
        _hasMinted[msg.sender] = true;
    }
}