// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MagiaGold is ERC20Upgradeable, OwnableUpgradeable {
    address public gameDiamond;

    function initialize() public initializer {
        __ERC20_init("MagiaGold", "MGL");
        __Ownable_init();
    }

    function setAddresses(address _gameDiamond) external onlyOwner {
        gameDiamond = _gameDiamond;
    }

    function mint(address _account, uint256 _amount) external {
        require(msg.sender == gameDiamond, "MagiaGold: restricted");
        _mint(_account, _amount);
    }

    function burnFrom(address _account, uint256 _amount) external {
        require(msg.sender == gameDiamond, "MagiaGold: restricted");
        _burn(_account, _amount);
    }
}
