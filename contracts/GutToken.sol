pragma solidity ^0.8.4; // Define solidity version

// Declare the smart contract
contract GutToken {
    uint256 public totalSupply; // Gut token total supply

    // Constructor function
    constructor() {
        totalSupply = 1000000; // Assign 1,000,000 Gut token as a total supply
    }
}
