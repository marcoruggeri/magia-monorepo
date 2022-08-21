// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {AppStorage, Modifiers} from "../libraries/AppStorage.sol";
import "../interfaces/IMagiaLands.sol";
import "../interfaces/IMagiaUnits.sol";
import "../interfaces/IERC20.sol";

contract ResourcesFacet is Modifiers {
    event ClaimGold(
        uint256 indexed _heroId,
        uint256 indexed _landId,
        uint256 _amount
    );
    event ClaimLumber(
        uint256 indexed _heroId,
        uint256 indexed _landId,
        uint256 _amount
    );
    event ClaimMana(
        uint256 indexed _heroId,
        uint256 indexed _landId,
        uint256 _amount
    );

    function claimGold(uint256 _heroId, uint256 _landId)
        external
        onlyHeroOwner(_heroId)
        onlyLandOccupier(_heroId, _landId)
        checkShield(_heroId)
    {
        IMagiaLands landsContract = IMagiaLands(s.landsAddress);
        uint256 unitTokenId = landsContract.getUnit(_landId);
        require(unitTokenId != 0, "ResourcesFacet: no unit");
        uint256 buildingId = landsContract.getBuilding(_landId);
        require(buildingId == 1, "ResourcesFacet: no goldMine");
        uint256 goldClaimed = (block.timestamp - s.lastGoldClaimed[_landId]) /
            100;
        uint256 goldLand = landsContract.getLandGold(_landId);
        require(goldClaimed >= 50, "ResourcesFacet: min claim 50 gold");
        if (goldClaimed > 2000) goldClaimed = 2000;
        if (goldClaimed > goldLand) {
            goldClaimed = goldLand;
        }
        IERC20(s.goldAddress).mint(msg.sender, goldClaimed * 1e18);
        s.lastGoldClaimed[_landId] = block.timestamp;
        landsContract.claimGold(_landId, goldClaimed);

        emit ClaimGold(_heroId, _landId, goldClaimed * 1e18);
    }

    function claimLumber(uint256 _heroId, uint256 _landId)
        external
        onlyHeroOwner(_heroId)
        onlyLandOccupier(_heroId, _landId)
        checkShield(_heroId)
    {
        IMagiaLands landsContract = IMagiaLands(s.landsAddress);
        uint256 unitTokenId = landsContract.getUnit(_landId);
        require(unitTokenId != 0, "ResourcesFacet: no unit");
        uint256 buildingId = landsContract.getBuilding(_landId);
        require(buildingId == 2, "ResourcesFacet: no lumberMill");
        uint256 lumberClaimed = (block.timestamp -
            s.lastLumberClaimed[_landId]) / 75;
        uint256 lumberLand = landsContract.getLandLumber(_landId);
        require(lumberClaimed >= 50, "ResourcesFacet: min claim 50 lumber");
        if (lumberClaimed > lumberLand) {
            lumberClaimed = lumberLand;
        }
        if (lumberClaimed > 2500) lumberClaimed = 2500;
        IERC20(s.lumberAddress).mint(msg.sender, lumberClaimed * 1e18);
        s.lastLumberClaimed[_landId] = block.timestamp;
        landsContract.claimLumber(_landId, lumberClaimed);

        emit ClaimLumber(_heroId, _landId, lumberClaimed * 1e18);
    }

    function claimMana(uint256 _heroId, uint256 _landId)
        external
        onlyHeroOwner(_heroId)
        onlyLandOccupier(_heroId, _landId)
        checkShield(_heroId)
    {
        IMagiaLands landsContract = IMagiaLands(s.landsAddress);
        uint256 unitTokenId = landsContract.getUnit(_landId);
        require(unitTokenId != 0, "ResourcesFacet: no unit");
        uint256 buildingId = landsContract.getBuilding(_landId);
        require(buildingId == 3, "ResourcesFacet: no shrine");
        uint256 manaClaimed = (block.timestamp - s.lastManaClaimed[_landId]) /
            150;
        uint256 manaLand = landsContract.getLandMana(_landId);
        require(manaClaimed >= 50, "ResourcesFacet: min claim 50 mana");
        if (manaClaimed > 1250) manaClaimed = 1250;
        if (manaClaimed > manaLand) {
            manaClaimed = manaLand;
        }
        IERC20(s.manaAddress).mint(msg.sender, manaClaimed * 1e18);
        s.lastManaClaimed[_landId] = block.timestamp;
        landsContract.claimMana(_landId, manaClaimed);

        emit ClaimMana(_heroId, _landId, manaClaimed * 1e18);
    }

    function getClaimableGold(uint256 _landId) external view returns (uint256) {
        uint256 goldClaimed = (block.timestamp - s.lastGoldClaimed[_landId]) /
            100;
        uint256 goldLand = IMagiaLands(s.landsAddress).getLandGold(_landId);
        if (goldClaimed > 2000) goldClaimed = 2000;
        if (goldClaimed > goldLand) {
            goldClaimed = goldLand;
        }
        return goldClaimed;
    }

    function getClaimableLumber(uint256 _landId)
        external
        view
        returns (uint256)
    {
        uint256 lumberClaimed = (block.timestamp -
            s.lastLumberClaimed[_landId]) / 75;
        uint256 lumberLand = IMagiaLands(s.landsAddress).getLandLumber(_landId);
        if (lumberClaimed > 2500) lumberClaimed = 2500;
        if (lumberClaimed > lumberLand) {
            lumberClaimed = lumberLand;
        }
        return lumberClaimed;
    }

    function getClaimableMana(uint256 _landId) external view returns (uint256) {
        uint256 manaClaimed = (block.timestamp - s.lastManaClaimed[_landId]) /
            150;
        uint256 manaLand = IMagiaLands(s.landsAddress).getLandMana(_landId);
        if (manaClaimed > 1250) manaClaimed = 1250;
        if (manaClaimed > manaLand) {
            manaClaimed = manaLand;
        }
        return manaClaimed;
    }

    function getLastClaimedGold(uint256 _landId)
        external
        view
        returns (uint256)
    {
        return s.lastGoldClaimed[_landId];
    }

    function getLastClaimedLumber(uint256 _landId)
        external
        view
        returns (uint256)
    {
        return s.lastLumberClaimed[_landId];
    }

    function getLastClaimedMana(uint256 _landId)
        external
        view
        returns (uint256)
    {
        return s.lastManaClaimed[_landId];
    }
}
