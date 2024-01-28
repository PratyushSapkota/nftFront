// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint256 public tokenCount;
    address private immutable market;

    constructor(
        address _market,
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        market = _market;
        tokenCount = 0;
    }

    function mint(string memory _uri) external returns (uint256) {
        tokenCount++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _uri);
        return tokenCount;
    }
}
