// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../interfaces/IERC1155.sol";
import "../interfaces/IERC721.sol";

import "hardhat/console.sol";

contract MagiaLands is ERC721EnumerableUpgradeable, OwnableUpgradeable {
    struct Land {
        uint256 heroId;
        uint256 coordinateX;
        uint256 coordinateY;
        uint256 unitTokenId;
        uint256 gold;
        uint256 lumber;
        uint256 mana;
        uint256 building;
    }

    // tokenId => Land
    mapping(uint256 => Land) private lands;

    address public gameDiamond;

    function initialize(address _gameDiamond) public initializer {
        __ERC721_init("MagiaLand", "MLN");
        __Ownable_init();
        gameDiamond = _gameDiamond;
    }

    function mintLands(Land[] calldata _land) external onlyOwner {
        for (uint256 i; i < _land.length; i++) {
            Land memory newLand = _land[i];
            lands[totalSupply()] = newLand;
            _safeMint(address(this), totalSupply());
        }
    }

    function setUnit(uint256 _landId, uint256 _unitTokenId) external {
        require(msg.sender == gameDiamond, "MagiaGold: restricted");
        lands[_landId].unitTokenId = _unitTokenId;
    }

    function setBuilding(uint256 _landId, uint256 _buildingId) external {
        require(msg.sender == gameDiamond, "MagiaHeroes: only gameDiamond");
        lands[_landId].building = _buildingId;
    }

    function setHero(uint256 _landId, uint256 _heroId) external {
        require(msg.sender == gameDiamond, "MagiaHeroes: only gameDiamond");
        lands[_landId].heroId = _heroId;
    }

    function claimGold(uint256 _landId, uint256 _amount) external {
        require(msg.sender == gameDiamond, "MagiaHeroes: only gameDiamond");
        lands[_landId].gold -= _amount;
    }

    function claimLumber(uint256 _landId, uint256 _amount) external {
        require(msg.sender == gameDiamond, "MagiaHeroes: only gameDiamond");
        lands[_landId].lumber -= _amount;
    }

    function claimMana(uint256 _landId, uint256 _amount) external {
        require(msg.sender == gameDiamond, "MagiaHeroes: only gameDiamond");
        lands[_landId].mana -= _amount;
    }

    function getLandById(uint256 _landId) external view returns (Land memory) {
        return lands[_landId];
    }

    function getHero(uint256 _landId) external view returns (uint256) {
        return lands[_landId].heroId;
    }

    function getUnit(uint256 _landId) external view returns (uint256) {
        return lands[_landId].unitTokenId;
    }

    function getMap() external view returns (Land[10000] memory map_) {
        for (uint256 i; i < 10000; i++) {
            map_[i] = lands[i];
        }
    }

    function getBatchMapRange(uint256 _start, uint256 _end)
        external
        view
        returns (Land[1000] memory batchedMap_)
    {
        uint256 index;
        for (; _start < _end; _start++) {
            batchedMap_[index] = lands[_start];
            index++;
        }
    }

    function getBatchMap(uint256[] calldata _tokenIds)
        external
        view
        returns (Land[1000] memory batchedMap_)
    {
        for (uint256 i; i < _tokenIds.length; i++) {
            batchedMap_[i] = lands[i];
        }
    }

    // function getGoldMap() external view returns (uint256[10000] memory map_) {
    //     for (uint256 i; i < 10000; i++) {
    //         map_[i] = lands[i].gold;
    //     }
    // }

    // function getLumberMap() external view returns (uint256[10000] memory map_) {
    //     for (uint256 i; i < 10000; i++) {
    //         map_[i] = lands[i].lumber;
    //     }
    // }

    // function getManaMap() external view returns (uint256[10000] memory map_) {
    //     for (uint256 i; i < 10000; i++) {
    //         map_[i] = lands[i].mana;
    //     }
    // }

    function getHeroesMap() external view returns (uint256[10000] memory map_) {
        for (uint256 i; i < 10000; i++) {
            map_[i] = lands[i].heroId;
        }
    }

    function getBuildingMap()
        external
        view
        returns (uint256[10000] memory map_)
    {
        for (uint256 i; i < 10000; i++) {
            map_[i] = lands[i].heroId;
        }
    }

    function getUnitsMap() external view returns (uint256[10000] memory map_) {
        for (uint256 i; i < 10000; i++) {
            map_[i] = lands[i].unitTokenId;
        }
    }

    function getBuilding(uint256 _landId) external view returns (uint256) {
        return lands[_landId].building;
    }

    function getLandGold(uint256 _landId) external view returns (uint256) {
        return lands[_landId].gold;
    }

    function getLandLumber(uint256 _landId) external view returns (uint256) {
        return lands[_landId].lumber;
    }

    function getLandMana(uint256 _landId) external view returns (uint256) {
        return lands[_landId].mana;
    }

    function checkUnit(uint256 _unitId, uint256 _landId)
        external
        view
        returns (bool res_)
    {
        if (lands[_landId].unitTokenId == _unitId) res_ = true;
    }

    function checkCoords(
        uint256 _fromLandId,
        uint256 _toLandId,
        uint256 _range
    ) external view {
        uint256 fromX = lands[_fromLandId].coordinateX;
        uint256 fromY = lands[_fromLandId].coordinateY;
        uint256 toX = lands[_toLandId].coordinateX;
        uint256 toY = lands[_toLandId].coordinateY;
        if (fromX == toX && fromY == toY) {
            revert("MagiaLands: equal from to coords");
        }
        uint256 xDiff;
        uint256 yDiff;
        if (fromX > toX) {
            xDiff = fromX - toX;
        } else {
            xDiff = toX - fromX;
        }
        if (fromY > toY) {
            yDiff = fromY - toY;
        } else {
            yDiff = toY - fromY;
        }
        require(
            xDiff <= _range && toX >= 0 && toX < 100,
            "MagiaLands: Invalid x"
        );
        require(
            yDiff <= _range && toY >= 0 && toY < 100,
            "MagiaLands: Invalid y"
        );
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
