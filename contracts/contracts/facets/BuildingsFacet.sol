// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {AppStorage, Modifiers, CraftBuilding} from "../libraries/AppStorage.sol";
import "../interfaces/IMagiaLands.sol";
import "../interfaces/IMagiaBuildings.sol";
import "../interfaces/IERC1155.sol";
import "../interfaces/IERC20.sol";

contract BuildingsFacet is Modifiers {
    event EquipBuilding(
        uint256 indexed _heroId,
        uint256 indexed _buildingId,
        uint256 indexed _landId
    );
    event UnequipBuilding(
        uint256 indexed _heroId,
        uint256 indexed _buildingId,
        uint256 indexed _landId
    );

    function equipBuilding(
        uint256 _heroId,
        uint256 _buildingId,
        uint256 _landId
    )
        external
        onlyHeroOwner(_heroId)
        onlyLandOccupier(_heroId, _landId)
        checkShield(_heroId)
    {
        IMagiaLands landsContract = IMagiaLands(s.landsAddress);
        // check resources on land
        uint256 buildingType = IMagiaBuildings(s.buildingsAddress)
            .getBuildingType(_buildingId);
        if (buildingType == 1) {
            require(
                landsContract.getLandGold(_landId) > 0,
                "GameFacet: no gold"
            );
            s.lastGoldClaimed[_landId] = block.timestamp;
        } else if (buildingType == 2) {
            require(
                landsContract.getLandLumber(_landId) > 0,
                "GameFacet: no lumber"
            );
            s.lastLumberClaimed[_landId] = block.timestamp;
        } else if (buildingType == 3) {
            require(
                landsContract.getLandMana(_landId) > 0,
                "GameFacet: no mana"
            );
            s.lastManaClaimed[_landId] = block.timestamp;
        }
        require(
            landsContract.getUnit(_landId) == 0 ||
                landsContract.getHero(_landId) == _heroId,
            "GameFacet: tile not empty"
        );
        require(
            landsContract.getBuilding(_landId) == 0,
            "GameFacet: Other building"
        );
        IERC1155(s.buildingsAddress).safeTransferFrom(
            msg.sender,
            address(this),
            _buildingId,
            1,
            ""
        );
        landsContract.setBuilding(_landId, _buildingId);

        emit EquipBuilding(_heroId, _buildingId, _landId);
    }

    function unequipBuilding(
        uint256 _heroId,
        uint256 _buildingId,
        uint256 _landId
    ) external onlyHeroOwner(_heroId) onlyLandOccupier(_heroId, _landId) {
        IMagiaLands landsContract = IMagiaLands(s.landsAddress);

        uint256 buildingId = landsContract.getBuilding(_landId);

        require(buildingId == _buildingId, "GameFacet: wrong buildingId");
        IERC1155(s.buildingsAddress).safeTransferFrom(
            msg.sender,
            address(this),
            buildingId,
            1,
            ""
        );
        landsContract.setBuilding(_landId, 0);

        emit UnequipBuilding(_heroId, _buildingId, _landId);
    }

    function craftBuilding(uint256 _heroId, uint256 _buildingId)
        external
        onlyHeroOwner(_heroId)
    {
        IMagiaBuildings buildingsContract = IMagiaBuildings(s.buildingsAddress);
        uint256[3] memory cost = buildingsContract.getCost(_buildingId);
        uint256 craftTime = buildingsContract.getCraftTime(_buildingId);
        uint256 level = buildingsContract.getLevel(_buildingId);
        require(level > 0, "GameFacet: not released yet");
        IERC20(s.goldAddress).burnFrom(msg.sender, cost[0]);
        IERC20(s.lumberAddress).burnFrom(msg.sender, cost[1]);
        IERC20(s.manaAddress).burnFrom(msg.sender, cost[2]);
        if (craftTime == 0) {
            buildingsContract.mint(msg.sender, _buildingId);
        } else {
            require(
                s.craftBuildings[_heroId].buildingId == 0,
                "GameFacet: already crafting"
            );
            uint256 readyTimestamp = block.timestamp + craftTime;
            CraftBuilding memory newBuilding = CraftBuilding(
                _buildingId,
                readyTimestamp
            );
            s.craftBuildings[_heroId] = newBuilding;
        }
    }

    function claimBuilding(uint256 _heroId) external onlyHeroOwner(_heroId) {
        require(
            block.timestamp >= s.craftBuildings[_heroId].readyTimestamp,
            "BuildingsFacet: not ready yet"
        );
        IMagiaBuildings(s.buildingsAddress).mint(
            msg.sender,
            s.craftBuildings[_heroId].buildingId
        );
        delete s.craftBuildings[_heroId];
    }

    function getCraftBuildings(uint256 _heroId)
        external
        view
        returns (CraftBuilding memory)
    {
        return s.craftBuildings[_heroId];
    }
}
