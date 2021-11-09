pragma solidity ^0.8.4; // Define solidity version

import "./GutToken.sol";

contract LendingVault {
    GutToken public tokenContract;

    event Deposit(uint256 _amount);

    constructor(GutToken _tokenContract) {
        tokenContract = _tokenContract;
    }

    function deposit(uint256 _amount) external {
        tokenContract.transferFrom(msg.sender, address(this), _amount);

        emit Deposit(_amount);
    }
}
