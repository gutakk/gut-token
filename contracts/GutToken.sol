pragma solidity ^0.8.4; // Define solidity version

// Declare the smart contract
contract GutToken {
    uint256 internal totalSupply_;

    mapping(address => uint256) internal balances;

    // Constructor function
    constructor(uint256 _initialSupply) {
        totalSupply_ = _initialSupply; // Assigns Gut token with initialSupply as a totalSupply
        balances[msg.sender] = totalSupply_; // Allocates totalSupply amount of Gut token to deployer address
    }

    /**
     * @dev Gets total supply of the token
     * @return uint256 totalSupply
     */
    function totalSupply() public view returns (uint256) {
        return totalSupply_;
    }

    /**
     * @dev Gets the balance of specified address
     * @param _addr Address to query the balance
     * @return uint256 Balance of specified address
     */
    function balanceOf(address _addr) public view returns (uint256) {
        return balances[_addr];
    }
}
