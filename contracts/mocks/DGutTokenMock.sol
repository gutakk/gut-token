pragma solidity ^0.8.4;

import "../tokenization/DGutToken.sol";

contract DGutTokenMock is DGutToken {
  function mint(address _account, uint256 _amount) public {
    _mint(_account, _amount);
  }

  function burn(address _account, uint _amount) public {
    _burn(_account, _amount);
  }
}
