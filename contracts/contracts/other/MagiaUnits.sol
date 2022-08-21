// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../interfaces/IERC20.sol";

contract MagiaUnits is ERC721EnumerableUpgradeable, OwnableUpgradeable {
    struct Unit {
        uint256 attack;
        uint256 defense;
        uint256 range;
        uint256 health;
        uint256 unitType; // 1 swordsmen, 2 bowmen...
        string name;
    }

    struct UnitType {
        uint256 attack;
        uint256 defense;
        uint256 range;
        uint256 health;
        uint256 craftedFrom;
        uint256 craftTime;
        uint256[3] cost; // [gold, lumber, mana]
        string name;
    }

    address public gameDiamond;
    address public gold;
    address public lumber;
    address public mana;

    // tokenId => Unit
    mapping(uint256 => Unit) public units;
    // unitType => CraftUnit
    mapping(uint256 => UnitType) public unitTypes;

    function initialize(
        address _gameDiamond,
        address _gold,
        address _lumber,
        address _mana
    ) public initializer {
        __ERC721_init("MagiaUnits", "MUN");
        __Ownable_init();
        gameDiamond = _gameDiamond;
        gold = _gold;
        lumber = _lumber;
        mana = _mana;
    }

    function mint(address _account, uint256 _unitTypeId) external {
        require(msg.sender == gameDiamond, "MagiaUnits: restricted");
        uint256 tokenId = totalSupply() + 1;
        Unit memory newUnit = Unit(
            unitTypes[_unitTypeId].attack,
            unitTypes[_unitTypeId].defense,
            unitTypes[_unitTypeId].range,
            unitTypes[_unitTypeId].health,
            _unitTypeId,
            unitTypes[_unitTypeId].name
        );
        units[tokenId] = newUnit;
        _mint(_account, tokenId);
    }

    function decreaseHealth(uint256 _tokenId, uint256 _amount) external {
        require(msg.sender == gameDiamond, "MagiaUnits: restricted");
        units[_tokenId].health -= _amount;
    }

    function increaseHealth(uint256 _tokenId, uint256 _amount) external {
        require(msg.sender == gameDiamond, "MagiaUnits: restricted");
        units[_tokenId].health += _amount;
    }

    function increaseDefense(uint256 _tokenId, uint256 _amount) external {
        require(msg.sender == gameDiamond, "MagiaUnits: restricted");
        units[_tokenId].defense += _amount;
    }

    function decreaseDefense(uint256 _tokenId, uint256 _amount) external {
        require(msg.sender == gameDiamond, "MagiaUnits: restricted");
        units[_tokenId].defense -= _amount;
    }

    function increaseAttack(uint256 _tokenId, uint256 _amount) external {
        require(msg.sender == gameDiamond, "MagiaUnits: restricted");
        units[_tokenId].attack += _amount;
    }

    function addUnitType(uint256 _unitTypeId, UnitType calldata _unitType)
        external
        onlyOwner
    {
        unitTypes[_unitTypeId] = _unitType;
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

    function getCraftedFrom(uint256 _unitTypeId)
        external
        view
        returns (uint256)
    {
        return unitTypes[_unitTypeId].craftedFrom;
    }

    function getCost(uint256 _unitTypeId)
        external
        view
        returns (uint256[3] memory)
    {
        return unitTypes[_unitTypeId].cost;
    }

    function getCraftTime(uint256 _unitTypeId) external view returns (uint256) {
        return unitTypes[_unitTypeId].craftTime;
    }

    function getUnit(uint256 _tokenId) external view returns (Unit memory) {
        return units[_tokenId];
    }

    function getUnitType(uint256 _unitTypeId)
        external
        view
        returns (UnitType memory)
    {
        return unitTypes[_unitTypeId];
    }

    function getUnitTypeId(uint256 _tokenId) external view returns (uint256) {
        return units[_tokenId].unitType;
    }

    function getAttack(uint256 _tokenId) external view returns (uint256) {
        return units[_tokenId].attack;
    }

    function getDefense(uint256 _tokenId) external view returns (uint256) {
        return units[_tokenId].defense;
    }

    function getHealth(uint256 _tokenId) external view returns (uint256) {
        return units[_tokenId].health;
    }

    function getRange(uint256 _tokenId) external view returns (uint256) {
        return units[_tokenId].range;
    }

    function getBatchUnitsType(uint256[] calldata _tokenIds)
        external
        view
        returns (Unit[500] memory batch_)
    {
        for (uint256 i; i < _tokenIds.length; i++) {
            batch_[i] = units[_tokenIds[i]];
        }
    }
}
