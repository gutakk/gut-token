pragma solidity ^0.8.4; // Define solidity version

/**
 * @dev Debt token for Lending Vault
*/
contract DGutToken {
    uint256 internal _totalSupply;
    string public constant name = "DebtGutToken";
    string public constant symbol = "dGUT";
    uint8 public constant decimals = 18;

    mapping(address => uint256) internal _balances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

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

    function _mint(address _account, uint256 _amount) internal {
        _totalSupply += _amount;
        _balances[_account] += _amount;

        emit Transfer(address(0), _account, _amount);
    }
}
