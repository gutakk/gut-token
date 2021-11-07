pragma solidity ^0.8.4; // Define solidity version

// Declare the smart contract
contract GutToken {
    uint256 internal totalSupply_;
    string public constant name = "GutToken";
    string public constant symbol = "GUT";
    uint8 public constant decimals = 18;

    mapping(address => uint256) internal balances;

    event Transfer(address indexed from, address indexed to, uint256 value);

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

    /**
     * @dev Transfers tokekn to specified address from msg.sender
     * @param _to The receiver address
     * @param _value The amount of token to be transferred
     * @return boolean Transfer status (true = success, false = unsuccess)
     */
    function transfer(address _to, uint256 _value) public returns (bool) {
        // Condition to check if msg.sender has enough balance to transfer amount of _value
        require(balances[msg.sender] >= _value, "insufficient funds");

        balances[msg.sender] -= _value; // Subtract token from sender by _value
        balances[_to] += _value; // Add token to recipient by _value

        // According to ERC20 standard transfer function MUST fire the Transfer event
        emit Transfer(msg.sender, _to, _value);

        return true; // Return the transfer status (success)
    }
}
