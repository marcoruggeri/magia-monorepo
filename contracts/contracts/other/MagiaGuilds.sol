// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../interfaces/IERC20.sol";

import "hardhat/console.sol";

contract MagiaGuilds is ERC721EnumerableUpgradeable, OwnableUpgradeable {
    struct Guild {
        uint256 guildMaster;
        string name;
    }

    address public gameDiamond;
    address public gold;
    address public lumber;
    address public mana;

    // questId => Unit
    mapping(uint256 => Guild) public guilds;

    function initialize(
        address _gameDiamond,
        address _gold,
        address _lumber,
        address _mana
    ) public initializer {
        __ERC721_init("MagiaGuilds", "MGD");
        __Ownable_init();
        gameDiamond = _gameDiamond;
        gold = _gold;
        lumber = _lumber;
        mana = _mana;
    }

    function mint(address _account, Guild calldata _guild) external {
        require(msg.sender == gameDiamond, "MagiaGuilds: restricted");
        uint256 tokenId = totalSupply() + 1;
        guilds[tokenId] = _guild;
        _mint(_account, tokenId);
    }

    function getGuild(uint256 _guildId) external view returns (Guild memory) {
        return guilds[_guildId];
    }
}
