// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "contracts/Vendor.sol";

contract REF is ERC721URIStorage, Ownable {
    address VENDOR_CONTRACT_ADDRESS = 0x0CBD3365020919127B1F29935d10Bb6cFB335e2A;
    VENDOR VENDOR_CONTRACT = VENDOR(VENDOR_CONTRACT_ADDRESS);

    using Counters for Counters.Counter;
    uint[] public nftTokenList;
    Counters.Counter private _tokenIds;
   
    struct Price {
        uint256 amount;
    }

   struct Collection {
        string collection;
        uint token;
    }

    mapping(uint256 => Price) internal _prices;
    Collection[] public collections;

    constructor() ERC721("REF", "REF") {}

    function getVendorData(address vendorWalletAddress) public view returns(VENDOR.Vendor memory ) {
        return VENDOR_CONTRACT.getVendorData(vendorWalletAddress);
    }

    function getVendorContract(address vendorWalletAddress) public view returns(string[] memory value) {
        return VENDOR_CONTRACT.getVendorContract(vendorWalletAddress);
    }

    function getAllVendor() public view returns(VENDOR.Vendor[] memory) {
        return VENDOR_CONTRACT.getAllVendor();
    }

    function assignContractToVendor(address vendorWalletAddres, string memory vendorContractID) public  {
         VENDOR_CONTRACT.assignContractToVendor(vendorWalletAddres, vendorContractID);
    }

    function assignContractToMultipleVendor(address[] memory vendorWalletAddress, string memory vendorContractID) public  {
         VENDOR_CONTRACT.assignContractToMultipleVendor(vendorWalletAddress, vendorContractID);
    }


    function mintNFT(string memory tokenURI, uint amount, string memory category)
        public
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        nftTokenList.push(newItemId);
        _setNftPrice(newItemId,amount);
        _setNftCollection(newItemId,category);
        return newItemId;
    }

    function setTokenURI (string memory tokenURI, uint tokrnID) public {
        _setTokenURI(tokrnID, tokenURI);
    }

    function getToken() public view returns (uint[] memory) {
        return  nftTokenList;
    }

    function _setNftPrice(
        uint256 token,
        uint amount
    ) public {
        _prices[token] = Price(amount);
    }

    function getNftPrice(uint tokenId)
        public
        view
        returns (uint amount)
    {
      
        Price memory priceData = _prices[tokenId];
        return (priceData.amount);
    }

    function _setNftCollection(uint token, string memory collectionName) internal {
       Collection memory newCollection = Collection({
            collection:collectionName,
            token:token
        });
       collections.push(newCollection);
    }

    function getCollection() public view returns ( Collection[] memory) {
        return collections;
    }
  
}