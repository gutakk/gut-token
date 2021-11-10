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

    /**
     * @dev Creates _amount of tokens and transfer to _account and increse total supply
     * @param _account Address to receive minted token
     * @param _amount Amount of token to be minted
    */
    function _mint(address _account, uint256 _amount) internal {
        _totalSupply += _amount; // Increase total supply by _amount
        _balances[_account] += _amount; // Assign _amount of minted token to _account

        // According to ERC20 standard transfer function MUST fire the Transfer event
        // Mint is creating token and transferring to _account
        emit Transfer(address(0), _account, _amount);
    }
    
    /**
     * @dev Remove _amount of tokens from _account and decrease total supply
     * @param _account Address to remove minted token
     * @param _amount Amount of token to be burned
    */
    function _burn(address _account, uint256 _amount) internal {
        // Check if _account has enough balance to burn otherwise throw error
        require(_balances[_account] >= _amount, "burn amount exceeds balance");

        _totalSupply -= _amount; // Decrease total supply by _amount
        _balances[_account] -= _amount; // Remove balance by _amount from _account

        // According to ERC20 standard transfer function MUST fire the Transfer event
        // Burn transfers token to address(0)
        emit Transfer(_account, address(0), _amount);
    }
}
