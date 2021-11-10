pragma solidity ^0.8.4; // Define solidity version

import "./GutToken.sol";
import "./tokenization/DGutToken.sol";

contract LendingVault {
    GutToken public gutToken;
    DGutToken public dGutToken;

    event Deposit(uint256 _amount);

    constructor(GutToken _gutTokenContract, DGutToken _dGutTokenContract) {
        gutToken = _gutTokenContract;
        dGutToken = _dGutTokenContract;
    }

    function deposit(uint256 _amount) external {
        // Transfer GutToken to lending vault
        gutToken.transferFrom(msg.sender, address(this), _amount);
        // mint debt Gut token to msg.sender
        dGutToken.mint(msg.sender, _amount);

        // Emit deposit event
        emit Deposit(_amount);
    }
}
