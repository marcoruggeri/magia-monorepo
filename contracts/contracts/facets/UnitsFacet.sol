// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {AppStorage, Modifiers, CraftUnit} from "../libraries/AppStorage.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/IERC721.sol";
import "../interfaces/IMagiaLands.sol";
import "../interfaces/IMagiaHeroes.sol";
import "../interfaces/IMagiaUnits.sol";
import "../interfaces/IMagiaBuildings.sol";

contract UnitsFacet is Modifiers {
    event DeployUnit(
        uint256 indexed _heroId,
        uint256 indexed _occupiedLandId,
        uint256 indexed _landId,
        uint256 _unitTokenId
    );

    event DisplaceUnit(
        uint256 indexed _heroId,
        uint256 indexed _landId,
        uint256 _unitTokenId
    );

    function craftFromBarracks(
        uint256 _heroId,
        uint256 _unitTypeId,
        uint256[] calldata _landIds
    ) external onlyHeroOwner(_heroId) onlyLandOccupierArray(_heroId, _landIds) {
        IMagiaUnits unitsContract = IMagiaUnits(s.unitsAddress);
        require(
            unitsContract.getCraftedFrom(_unitTypeId) == 4,
            "UnitsFacet: wrong id"
        );
        if (_landIds.length == 1) {
            uint256 buildingId = IMagiaLands(s.landsAddress).getBuilding(
                _landIds[0]
            );
            uint256 buildingType = IMagiaBuildings(s.buildingsAddress)
                .getBuildingType(buildingId);
            require(buildingType == 4, "UnitsFacet: no barrack");
        } else {
            for (uint256 i; i < _landIds.length; i++) {
                uint256 buildingId = IMagiaLands(s.landsAddress).getBuilding(
                    _landIds[i]
                );
                uint256 buildingType = IMagiaBuildings(s.buildingsAddress)
                    .getBuildingType(buildingId);
                require(buildingType == 4, "UnitsFacet: no barrack");
            }
        }
        uint256[3] memory cost = unitsContract.getCost(_unitTypeId);
        uint256 craftTime = unitsContract.getCraftTime(_unitTypeId);
        IERC20(s.goldAddress).burnFrom(msg.sender, cost[0]);
        IERC20(s.lumberAddress).burnFrom(msg.sender, cost[1]);
        IERC20(s.manaAddress).burnFrom(msg.sender, cost[2]);
        if (craftTime == 0) {
            unitsContract.mint(msg.sender, _unitTypeId);
        } else {
            uint256 readyTimestamp;
            if (_landIds.length == 1) {
                readyTimestamp = block.timestamp + craftTime;
            } else {
                uint256 discountedCraftTime = craftTime -
                    ((craftTime * (_landIds.length * 10)) / 100);
                readyTimestamp = block.timestamp + discountedCraftTime;
            }
            CraftUnit memory newUnit = CraftUnit(_unitTypeId, readyTimestamp);
            s.craftFromBarracks[_heroId] = newUnit;
        }
    }

    function claimFromBarracks(uint256 _heroId)
        external
        onlyHeroOwner(_heroId)
    {
        require(
            block.timestamp >= s.craftFromBarracks[_heroId].readyTimestamp,
            "UnitsFacet: not ready yet"
        );
        IMagiaUnits(s.unitsAddress).mint(
            msg.sender,
            s.craftFromBarracks[_heroId].unitTypeId
        );
        delete s.craftFromBarracks[_heroId];
    }

    function craftFromWorkshop(
        uint256 _heroId,
        uint256 _unitTypeId,
        uint256[] calldata _landIds
    ) external onlyHeroOwner(_heroId) onlyLandOccupierArray(_heroId, _landIds) {
        IMagiaUnits unitsContract = IMagiaUnits(s.unitsAddress);
        require(
            unitsContract.getCraftedFrom(_unitTypeId) == 5,
            "UnitsFacet: wrong id"
        );
        if (_landIds.length == 1) {
            uint256 buildingId = IMagiaLands(s.landsAddress).getBuilding(
                _landIds[0]
            );
            uint256 buildingType = IMagiaBuildings(s.buildingsAddress)
                .getBuildingType(buildingId);
            require(buildingType == 5, "UnitsFacet: no workshop");
        } else {
            for (uint256 i; i < _landIds.length; i++) {
                uint256 buildingId = IMagiaLands(s.landsAddress).getBuilding(
                    _landIds[i]
                );
                uint256 buildingType = IMagiaBuildings(s.buildingsAddress)
                    .getBuildingType(buildingId);
                require(buildingType == 5, "UnitsFacet: no workshop");
            }
        }
        uint256[3] memory cost = unitsContract.getCost(_unitTypeId);
        uint256 craftTime = unitsContract.getCraftTime(_unitTypeId);
        IERC20(s.goldAddress).burnFrom(msg.sender, cost[0]);
        IERC20(s.lumberAddress).burnFrom(msg.sender, cost[1]);
        IERC20(s.manaAddress).burnFrom(msg.sender, cost[2]);
        if (craftTime == 0) {
            unitsContract.mint(msg.sender, _unitTypeId);
        } else {
            uint256 readyTimestamp;
            if (_landIds.length == 1) {
                readyTimestamp = block.timestamp + craftTime;
            } else {
                uint256 discountedCraftTime = craftTime -
                    ((craftTime * (_landIds.length * 10)) / 100);
                readyTimestamp = block.timestamp + discountedCraftTime;
            }
            CraftUnit memory newUnit = CraftUnit(_unitTypeId, readyTimestamp);
            s.craftFromWorkshop[_heroId] = newUnit;
        }
    }

    function claimFromWorkshop(uint256 _heroId)
        external
        onlyHeroOwner(_heroId)
    {
        require(
            block.timestamp >= s.craftFromWorkshop[_heroId].readyTimestamp,
            "UnitsFacet: not ready yet"
        );
        IMagiaUnits(s.unitsAddress).mint(
            msg.sender,
            s.craftFromWorkshop[_heroId].unitTypeId
        );
        delete s.craftFromWorkshop[_heroId];
    }

    function craftFromMageTower(
        uint256 _heroId,
        uint256 _unitTypeId,
        uint256[] calldata _landIds
    ) external onlyHeroOwner(_heroId) onlyLandOccupierArray(_heroId, _landIds) {
        IMagiaUnits unitsContract = IMagiaUnits(s.unitsAddress);
        require(
            unitsContract.getCraftedFrom(_unitTypeId) == 6,
            "UnitsFacet: wrong id"
        );
        if (_landIds.length == 1) {
            uint256 buildingId = IMagiaLands(s.landsAddress).getBuilding(
                _landIds[0]
            );
            uint256 buildingType = IMagiaBuildings(s.buildingsAddress)
                .getBuildingType(buildingId);
            require(buildingType == 6, "UnitsFacet: no magetower");
        } else {
            for (uint256 i; i < _landIds.length; i++) {
                uint256 buildingId = IMagiaLands(s.landsAddress).getBuilding(
                    _landIds[i]
                );
                uint256 buildingType = IMagiaBuildings(s.buildingsAddress)
                    .getBuildingType(buildingId);
                require(buildingType == 6, "UnitsFacet: no magetower");
            }
        }
        uint256[3] memory cost = unitsContract.getCost(_unitTypeId);
        uint256 craftTime = unitsContract.getCraftTime(_unitTypeId);
        IERC20(s.goldAddress).burnFrom(msg.sender, cost[0]);
        IERC20(s.lumberAddress).burnFrom(msg.sender, cost[1]);
        IERC20(s.manaAddress).burnFrom(msg.sender, cost[2]);
        if (craftTime == 0) {
            unitsContract.mint(msg.sender, _unitTypeId);
        } else {
            uint256 readyTimestamp;
            if (_landIds.length == 1) {
                readyTimestamp = block.timestamp + craftTime;
            } else {
                uint256 discountedCraftTime = craftTime -
                    ((craftTime * (_landIds.length * 10)) / 100);
                readyTimestamp = block.timestamp + discountedCraftTime;
            }
            CraftUnit memory newUnit = CraftUnit(_unitTypeId, readyTimestamp);
            s.craftFromMageTower[_heroId] = newUnit;
        }
    }

    function claimFromMageTower(uint256 _heroId)
        external
        onlyHeroOwner(_heroId)
    {
        require(
            block.timestamp >= s.craftFromMageTower[_heroId].readyTimestamp,
            "UnitsFacet: not ready yet"
        );
        IMagiaUnits(s.unitsAddress).mint(
            msg.sender,
            s.craftFromMageTower[_heroId].unitTypeId
        );
        delete s.craftFromMageTower[_heroId];
    }

    function deployUnit(
        uint256 _heroId,
        uint256 _unitTokenId,
        uint256 _occupiedLandId,
        uint256 _landId
    )
        external
        onlyHeroOwner(_heroId)
        onlyLandOccupier(_heroId, _occupiedLandId)
        checkShield(_heroId)
    {
        IMagiaLands landsContract = IMagiaLands(s.landsAddress);
        IERC721(s.unitsAddress).safeTransferFrom(
            msg.sender,
            address(this),
            _unitTokenId
        );
        landsContract.checkCoords(_occupiedLandId, _landId, 1);
        require(
            landsContract.getUnit(_landId) == 0,
            "UnitsFacet: tile not empty"
        );
        landsContract.setUnit(_landId, _unitTokenId);
        landsContract.setHero(_landId, _heroId);

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(20, _heroId);

        emit DeployUnit(_heroId, _occupiedLandId, _landId, _unitTokenId);
    }

    function displaceUnit(
        uint256 _heroId,
        uint256 _unitTokenId,
        uint256 _landId
    ) external onlyHeroOwner(_heroId) onlyLandOccupier(_heroId, _landId) {
        IMagiaLands landsContract = IMagiaLands(s.landsAddress);
        IERC721(s.unitsAddress).safeTransferFrom(
            address(this),
            msg.sender,
            _unitTokenId
        );
        uint256 unit = landsContract.getUnit(_landId);
        require(unit == _unitTokenId, "UnitsFacet: wrong unitId");
        landsContract.setUnit(_landId, 0);
        uint256 buildingId = landsContract.getBuilding(_landId);
        if (buildingId == 0) {
            landsContract.setHero(_landId, 0);
        }

        emit DisplaceUnit(_heroId, _landId, _unitTokenId);
    }

    function getCraftFromBarracks(uint256 _heroId)
        external
        view
        returns (CraftUnit memory)
    {
        return s.craftFromBarracks[_heroId];
    }

    function getCraftFromWorkshop(uint256 _heroId)
        external
        view
        returns (CraftUnit memory)
    {
        return s.craftFromWorkshop[_heroId];
    }

    function getCraftFromMageTower(uint256 _heroId)
        external
        view
        returns (CraftUnit memory)
    {
        return s.craftFromMageTower[_heroId];
    }
}
