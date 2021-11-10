// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4; // Define solidity version

// Declare the smart contract
contract GutToken {
    uint256 internal _totalSupply;
    string public constant name = "GutToken";
    string public constant symbol = "GUT";
    uint8 public constant decimals = 18;

    mapping(address => uint256) internal _balances;
    mapping(address => mapping(address => uint256)) internal allowed;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    // Constructor function
    constructor(uint256 _initialSupply) {
        _totalSupply = _initialSupply; // Assigns Gut token with initialSupply as a totalSupply
        _balances[msg.sender] = _totalSupply; // Allocates totalSupply amount of Gut token to deployer address
    }

    /**
     * @dev Gets total supply of the token
     * @return uint256 totalSupply
    */
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev Gets the balance of specified address
     * @param _addr Address to query the balance
     * @return uint256 Balance of specified address
    */
    function balanceOf(address _addr) public view returns (uint256) {
        return _balances[_addr];
    }

    /**
     * @dev Transfers tokens to specified address from address that call this function
     * @param _to The receiver address
     * @param _value The amount of token to be transferred
     * @return boolean Transfer status (true = success, false = unsuccess)
    */
    function transfer(address _to, uint256 _value) public returns (bool) {
        // Condition to check if msg.sender has enough balance to transfer amount of _value
        require(_balances[msg.sender] >= _value, "insufficient funds");

        _balances[msg.sender] -= _value; // Subtract tokens from sender address by _value
        _balances[_to] += _value; // Add tokens to _to address by _value

        // According to ERC20 standard transfer function MUST fire the Transfer event
        emit Transfer(msg.sender, _to, _value);

        return true; // Return the transfer status (success)
    }

    /**
     * @dev Transfers tokens from specified address to another specified address
     * @param _from The sender address
     * @param _to The receiver address
     * @param _value The amount of token to be transferred
     * @return boolean Transfer status (true = success, false = unsuccess)
    */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        // Condition to check if msg.sender has enough balance to transfer amount of _value
        require(_balances[_from] >= _value, "insufficient funds");
        // Condition to check if msg.sender try to spend tokens on _from account more than allowance
        require(allowed[_from][msg.sender] >= _value , "insufficient allowance");

        _balances[_from] -= _value; // Subtract tokens from _from address by _value
        _balances[_to] += _value; // Add tokens to _to address by _value
        allowed[_from][msg.sender] -= _value; // Decrease spender allowance

        // According to ERC20 standard transfer function MUST fire the Transfer event
        emit Transfer(_from, _to, _value);

        return true; // Return the transfer status (success)
    }

    /**
     * @dev Checks the amount of tokens that owner allowed to spender for delegate transfer
     * @param _owner Address that own the tokens
     * @param _spender Address that request to spend the tokens
     * @return uint256 Amount of tokens that available for spender
    */
    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowed[_owner][_spender];
    }

    /**
     * @dev Approves the specified address to spend the specified amount of tokens on behalf of address that call this function
     * @param _spender The address that will spend the token on behalf of address that call this function
     * @param _value The amount of token to be spent
     * @return boolean Approve status (true = success, false = unsuccess)
    */
    function approve(address _spender, uint256 _value) public returns (bool) {
        // Assign allowance value of address that call this function to _spender by _value
        allowed[msg.sender][_spender] = _value;

        // According to ERC20 standard approve function MUST fire the Approval event
        emit Approval(msg.sender, _spender, _value);

        return true; // Return approve status (success)
    }
}
