// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {LibDiamond} from "./LibDiamond.sol";
import "../interfaces/IERC721.sol";
import "../interfaces/IMagiaLands.sol";

struct CraftBuilding {
    uint256 buildingId;
    uint256 readyTimestamp;
}

struct CraftUnit {
    uint256 unitTypeId;
    uint256 readyTimestamp;
}

struct CraftSpell {
    uint256 spellId;
    uint256 readyTimestamp;
}

struct RequestConfig {
    uint64 subId;
    uint32 callbackGasLimit;
    uint16 requestConfirmations;
    uint32 numWords;
    bytes32 keyHash;
}

struct AppStorage {
    mapping(uint256 => bool) registered;
    // landId => timestamp
    mapping(uint256 => uint256) lastGoldClaimed;
    mapping(uint256 => uint256) lastLumberClaimed;
    mapping(uint256 => uint256) lastManaClaimed;
    //VRF
    address vrfCoordinator;
    address linkAddress;
    RequestConfig requestConfig;
    // heroId => vrf/reg data
    mapping(uint256 => uint256) vrfRequestIdToHeroId;
    mapping(uint256 => bool) registrationStarted;
    // addresses
    address goldAddress;
    address lumberAddress;
    address manaAddress;
    address heroesAddress;
    address buildingsAddress;
    address landsAddress;
    address unitsAddress;
    address spellsAddress;
    address questsAddress;
    // craft queues
    // heroId => craft queue
    mapping(uint256 => CraftBuilding) craftBuildings;
    mapping(uint256 => CraftUnit) craftFromBarracks;
    mapping(uint256 => CraftSpell) craftSpells;
    mapping(uint256 => CraftUnit) craftFromWorkshop;
    mapping(uint256 => CraftUnit) craftFromMageTower;
    // heroId => shield ends timestamp
    mapping(uint256 => uint256) shieldEndTimestamp;
    // heroId => shielded units
    mapping(uint256 => uint256[]) shieldedUnits;
    // unitTokenId => shields ends timestamp
    mapping(uint256 => uint256) unitsShieldEndTimestamp;
    // heroId => questId
    mapping(uint256 => uint256) activeQuest;
}

library LibAppStorage {
    function diamondStorage() internal pure returns (AppStorage storage ds) {
        assembly {
            ds.slot := 0
        }
    }
}

contract Modifiers {
    AppStorage internal s;

    modifier onlyOwner() {
        LibDiamond.enforceIsContractOwner();
        _;
    }

    modifier onlyHeroOwner(uint256 _heroId) {
        require(
            msg.sender == IERC721(s.heroesAddress).ownerOf(_heroId),
            "AppStorage: Not owner"
        );
        _;
    }

    modifier onlyLandOccupier(uint256 _heroId, uint256 _landId) {
        require(
            _heroId == IMagiaLands(s.landsAddress).getHero(_landId),
            "AppStorage: Not occupier"
        );
        _;
    }

    modifier onlyLandOccupierArray(
        uint256 _heroId,
        uint256[] calldata _landIds
    ) {
        for (uint256 i = 0; i < _landIds.length; i++) {
            require(
                _heroId == IMagiaLands(s.landsAddress).getHero(_landIds[i]),
                "AppStorage: Not occupier"
            );
        }
        _;
    }

    modifier checkShield(uint256 _heroId) {
        require(
            s.shieldEndTimestamp[_heroId] < block.timestamp,
            "AppStorage: can't do actions with shield active"
        );
        _;
    }
}
