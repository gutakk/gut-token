pragma solidity ^0.8.4; // Define solidity version

import "./GutToken.sol";
import "./tokenization/DGutToken.sol";

contract LendingVault {
    GutToken public gutToken;
    DGutToken public dGutToken;

    event Deposit(uint256 _amount);
    event Withdraw(uint256 _amount);

    constructor(GutToken _gutTokenContract, DGutToken _dGutTokenContract) {
        gutToken = _gutTokenContract;
        dGutToken = _dGutTokenContract;
    }

    /**
     * @dev Deposits GutToken to lending vault and receive dGutToken as a debt token
     * @param _amount Amount of token to be deposited
    */
    function deposit(uint256 _amount) external {
        // Transfer GutToken to lending vault
        gutToken.transferFrom(msg.sender, address(this), _amount);
        // mint debt Gut token to msg.sender
        dGutToken.mint(msg.sender, _amount);

        // Emit deposit event
        emit Deposit(_amount);
    }

    /**
     * @dev Withdraws GutToken from lending vault and remove dGutToken
     * @param _amount Amount of token to be withdrawn
    */
    function withdraw(uint256 _amount) external {
        // Burns debt tokens from msg.sender account by _amount
        dGutToken.burn(msg.sender, _amount);
        // Transfers Gut Token from contract to msg.sender account by _amount
        gutToken.transfer(msg.sender, _amount);

        // Emit withdraw event
        emit Withdraw(_amount);
    }
}
