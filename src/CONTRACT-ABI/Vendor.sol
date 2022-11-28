// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
contract VENDOR {

    struct Vendor {
        string name;
        string category;
        string vendorAddress;
        string contactNo;
        address walletAddress;
    }

    mapping (address => Vendor) vendorList;
    mapping (address => string[]) public contractData;
    Vendor[] public vendors;

    function addVendor(string memory name, string memory category, string memory vendorAddress, string memory contactNo, address vendorWalletAddress) public    {
        Vendor memory newVendor = Vendor(name, category, vendorAddress, contactNo, vendorWalletAddress) ;
        vendorList[vendorWalletAddress]= newVendor ;
        vendors.push(newVendor);
    }

    function getAllVendor() public view returns ( Vendor[] memory) {
        return vendors;
    }

    function getVendorData(address vendorWalletAddress) public  view returns (Vendor memory){
        return vendorList[vendorWalletAddress];
    } 

    function assignContractToVendor(address vendorWalletAddress, string memory vendorContractID) public  {
        contractData[vendorWalletAddress].push(vendorContractID);
    }

    function assignContractToMultipleVendor(address[] memory vendorWalletAddress, string memory vendorContractID) public  {
        for(uint i=0; i<5; i++){
            contractData[vendorWalletAddress[i]].push(vendorContractID);
        }
    }

    function getVendorContract(address vendorWalletAddress) public  view returns( string[] memory value){
        return contractData[vendorWalletAddress];
    }

}