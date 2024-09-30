// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
 
import "smart_contracts/contracts/openzeppelin/contracts@4.7.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "smart_contracts/contracts/openzeppelin/contracts@4.7.0/access/Ownable.sol";
import "smart_contracts/contracts/openzeppelin/contracts@4.7.0/utils/Counters.sol"; 

contract VoterID is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIDCounter;

    event TokenMinted(address to, uint256 tokenID);
    event TokenRevoked(uint256 tokenID);

    constructor() ERC721("VoterID", "VID") {}

    function safeMint(address to, string memory uri) public onlyOwner {
        require(balanceOf(to) == 0, "Max Mint per wallet reached");
        _tokenIDCounter.increment();
        uint256 tokenID = _tokenIDCounter.current();
        _safeMint(to, tokenID);
        _setTokenURI(tokenID, uri);
        emit TokenMinted(to, tokenID);  // Emit event
    }

    function revoke(uint256 tokenID) external onlyOwner {
        _burn(tokenID);
        emit TokenRevoked(tokenID); // Emit event
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenID) internal virtual override {
        tokenID;
        require(from == address(0) || to == address(0), "Err: Can not transfer SBT");
    }
}