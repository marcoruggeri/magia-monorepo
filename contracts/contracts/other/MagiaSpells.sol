// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../interfaces/IERC20.sol";

contract MagiaSpells is ERC1155Upgradeable, OwnableUpgradeable {
    struct Spell {
        uint256 craftTime;
        uint256[5] magicReqs; // [white, black, fire, water, earth]
        uint256[3] cost; // [gold, lumber, mana]
        string name;
    }

    address public gameDiamond;
    address public gold;
    address public lumber;
    address public mana;

    // tokenId => Spell
    mapping(uint256 => Spell) public spells;

    function initialize(
        address _gameDiamond,
        address _gold,
        address _lumber,
        address _mana
    ) public initializer {
        __ERC1155_init("");
        __Ownable_init();
        gameDiamond = _gameDiamond;
        gold = _gold;
        lumber = _lumber;
        mana = _mana;
    }

    function mint(address _account, uint256 _spellId) external {
        require(msg.sender == gameDiamond, "MagiaSpells: restricted");
        _mint(_account, _spellId, 1, "");
    }

    function burn(
        address _account,
        uint256 _spellId,
        uint256 _amount
    ) external {
        require(msg.sender == gameDiamond, "MagiaSpells: restricted");
        _burn(_account, _spellId, _amount);
    }

    function addSpell(uint256 _id, Spell calldata _spell) external onlyOwner {
        spells[_id] = _spell;
    }

    function setAddresses(
        address _gameDiamond,
        address _gold,
        address _lumber,
        address _mana
    ) external onlyOwner {
        gameDiamond = _gameDiamond;
        gold = _gold;
        lumber = _lumber;
        mana = _mana;
    }

    function getCost(uint256 _spellId)
        external
        view
        returns (uint256[3] memory)
    {
        return spells[_spellId].cost;
    }

    function getCraftTime(uint256 _spellId) external view returns (uint256) {
        return spells[_spellId].craftTime;
    }

    function getNameBytes(uint256 _spellId)
        external
        view
        returns (bytes memory)
    {
        return bytes(spells[_spellId].name);
    }

    function getMagicReqs(uint256 _spellId)
        external
        view
        returns (uint256[5] memory)
    {
        return spells[_spellId].magicReqs;
    }

    function getBatchSpells() external view returns (Spell[15] memory spells_) {
        for (uint256 i; i < 15; i++) {
            spells_[i] = spells[i + 1];
        }
    }
}
