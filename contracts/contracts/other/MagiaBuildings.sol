// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../interfaces/IERC20.sol";

contract MagiaBuildings is ERC1155Upgradeable, OwnableUpgradeable {
    struct Building {
        uint256 level;
        uint256 buildingType; // 0 void, 1 goldMine, 2 lumberMill, 3 shrine, 4 barracks
        uint256[3] cost; // [gold, lumber, mana]
        uint256 craftTime;
        string name;
    }

    address public gameDiamond;
    address public gold;
    address public lumber;
    address public mana;

    // tokenId => Building
    mapping(uint256 => Building) public buildings;

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

    function mint(address _account, uint256 _buildingId) external {
        require(msg.sender == gameDiamond, "MagiaBuildings: restricted");
        _mint(_account, _buildingId, 1, "");
    }

    function addBuilding(uint256 _id, Building calldata _building)
        external
        onlyOwner
    {
        buildings[_id] = _building;
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

    function getCost(uint256 _buildingId)
        external
        view
        returns (uint256[3] memory)
    {
        return buildings[_buildingId].cost;
    }

    function getCraftTime(uint256 _buildingId) external view returns (uint256) {
        return buildings[_buildingId].craftTime;
    }

    function getLevel(uint256 _buildingId) external view returns (uint256) {
        return buildings[_buildingId].level;
    }

    function getBuildingType(uint256 _buildingId)
        external
        view
        returns (uint256)
    {
        return buildings[_buildingId].buildingType;
    }

    function getBatchBuildings()
        external
        view
        returns (Building[6] memory buildings_)
    {
        for (uint256 i = 0; i < 6; i++) {
            buildings_[i] = buildings[i + 1];
        }
    }
}
