// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {AppStorage, Modifiers} from "../libraries/AppStorage.sol";
import "../libraries/LibGame.sol";
import "../interfaces/IMagiaHeroes.sol";
import "../interfaces/IMagiaLands.sol";
import "../interfaces/IMagiaUnits.sol";

contract ActionsFacet is Modifiers {
    event MoveUnit(
        uint256 indexed _heroId,
        uint256 indexed _fromLandId,
        uint256 indexed _toLandId,
        uint256 _unitTokenId
    );
    event Attack(
        uint256 indexed _heroId,
        uint256 indexed _fromLandId,
        uint256 indexed _toLandId,
        uint256 _unitTokenId
    );
    event StartShield(
        uint256 indexed _heroId,
        uint256[] _unitTokenIds,
        uint256 endTimestamp
    );

    event StopShield(uint256 indexed _heroId, uint256[] _unitTokenIds);

    event ResetShield(
        uint256 indexed _heroId,
        uint256[] _unitTokenIds,
        uint256 endTimestamp
    );

    function moveUnit(
        uint256 _heroId,
        uint256 _unitTokenId,
        uint256 _fromLandId,
        uint256 _toLandId
    )
        external
        onlyHeroOwner(_heroId)
        onlyLandOccupier(_heroId, _fromLandId)
        checkShield(_heroId)
    {
        IMagiaLands landsContract = IMagiaLands(s.landsAddress);
        landsContract.checkCoords(_fromLandId, _toLandId, 1);
        require(
            landsContract.getUnit(_toLandId) == 0 ||
                landsContract.getHero(_toLandId) == _heroId,
            "ActionsFacet: tile not empty"
        );
        require(
            landsContract.checkUnit(_unitTokenId, _fromLandId),
            "ActionsFacet: fail check"
        );
        landsContract.setUnit(_fromLandId, 0);
        landsContract.setUnit(_toLandId, _unitTokenId);
        landsContract.setHero(_toLandId, _heroId);
        uint256 buildingId = landsContract.getBuilding(_fromLandId);
        if (buildingId == 0) {
            landsContract.setHero(_fromLandId, 0);
        }
        IMagiaHeroes(s.heroesAddress).decreaseEnergy(10, _heroId);

        emit MoveUnit(_heroId, _fromLandId, _toLandId, _unitTokenId);
    }

    function attack(
        uint256 _heroId,
        uint256 _unitTokenId,
        uint256 _fromLandId,
        uint256 _toLandId
    )
        external
        onlyHeroOwner(_heroId)
        onlyLandOccupier(_heroId, _fromLandId)
        checkShield(_heroId)
    {
        IMagiaLands landsContract = IMagiaLands(s.landsAddress);
        IMagiaUnits unitsContract = IMagiaUnits(s.unitsAddress);
        uint256 range = unitsContract.getRange(_unitTokenId);
        require(range == 1, "ActionsFacet: no ranged");
        landsContract.checkCoords(_fromLandId, _toLandId, range);
        require(
            landsContract.getUnit(_toLandId) != 0,
            "ActionsFacet: tile empty"
        );
        require(
            landsContract.checkUnit(_unitTokenId, _fromLandId),
            "ActionsFacet: fail check"
        );

        uint256 enemyUnitId = landsContract.getUnit(_toLandId);
        require(
            block.timestamp > s.unitsShieldEndTimestamp[enemyUnitId],
            "ActionsFacet: shield active"
        );

        LibGame.handleAttackDamage(
            _heroId,
            _fromLandId,
            _toLandId,
            _unitTokenId,
            enemyUnitId,
            range
        );

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(20, _heroId);

        emit Attack(_heroId, _fromLandId, _toLandId, _unitTokenId);
    }

    function attackRanged(
        uint256 _heroId,
        uint256 _unitTokenId,
        uint256 _fromLandId,
        uint256 _toLandId
    )
        external
        onlyHeroOwner(_heroId)
        onlyLandOccupier(_heroId, _fromLandId)
        checkShield(_heroId)
    {
        IMagiaLands landsContract = IMagiaLands(s.landsAddress);
        IMagiaUnits unitsContract = IMagiaUnits(s.unitsAddress);
        uint256 range = unitsContract.getRange(_unitTokenId);
        require(range != 0, "ActionsFacet: only ranged");
        landsContract.checkCoords(
            _fromLandId,
            _toLandId,
            unitsContract.getRange(_unitTokenId)
        );
        require(
            landsContract.getUnit(_toLandId) != 0,
            "ActionsFacet: tile empty"
        );
        require(
            landsContract.checkUnit(_unitTokenId, _fromLandId),
            "ActionsFacet: fail check"
        );

        uint256 enemyUnitId = landsContract.getUnit(_toLandId);
        require(
            block.timestamp > s.unitsShieldEndTimestamp[enemyUnitId],
            "ActionsFacet: shield active"
        );

        LibGame.handleAttackDamage(
            _heroId,
            _fromLandId,
            _toLandId,
            _unitTokenId,
            enemyUnitId,
            range
        );

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(range * 15, _heroId);

        emit Attack(_heroId, _fromLandId, _toLandId, _unitTokenId);
    }

    function startShield(
        uint256 _heroId,
        uint256[] calldata _unitTokenIds,
        uint256[] calldata _landIds,
        uint256 _hours
    ) external onlyHeroOwner(_heroId) {
        require(
            _unitTokenIds.length == _landIds.length,
            "ActionsFacet: array mismatch"
        );
        require(
            block.timestamp > s.shieldEndTimestamp[_heroId],
            "ActionsFacet: shield already active"
        );
        require(_hours <= 24, "ActionsFacet: duration too long");
        require(_hours >= 1, "ActionsFacet: duration too short");
        uint256 endTimeStamp = block.timestamp + (_hours * 3600);
        s.shieldEndTimestamp[_heroId] = endTimeStamp;

        for (uint256 i; i < _unitTokenIds.length; i++) {
            require(
                IMagiaLands(s.landsAddress).checkUnit(
                    _unitTokenIds[i],
                    _landIds[i]
                ),
                "ActionsFacet: fail check"
            );
            s.unitsShieldEndTimestamp[_unitTokenIds[i]] = endTimeStamp;
        }

        s.shieldedUnits[_heroId] = _unitTokenIds;

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(
            100 + (_unitTokenIds.length * 7) * _hours,
            _heroId
        );

        emit StartShield(_heroId, _unitTokenIds, endTimeStamp);
    }

    function cancelShield(uint256 _heroId) external onlyHeroOwner(_heroId) {
        require(
            block.timestamp < s.shieldEndTimestamp[_heroId],
            "ActionsFacet: shield not active"
        );
        for (uint256 i; i < s.shieldedUnits[_heroId].length; i++) {
            s.unitsShieldEndTimestamp[s.shieldedUnits[_heroId][i]] = 0;
        }

        emit StopShield(_heroId, s.shieldedUnits[_heroId]);

        delete s.shieldEndTimestamp[_heroId];
        delete s.shieldedUnits[_heroId];
    }

    function resetShield(uint256 _heroId, uint256 _hours)
        external
        onlyHeroOwner(_heroId)
    {
        require(
            block.timestamp < s.shieldEndTimestamp[_heroId],
            "ActionsFacet: shield not active"
        );
        uint256 endTimeStamp = block.timestamp + (_hours * 3600);
        for (uint256 i; i < s.shieldedUnits[_heroId].length; i++) {
            s.unitsShieldEndTimestamp[
                s.shieldedUnits[_heroId][i]
            ] = endTimeStamp;
        }

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(
            100 + (s.shieldedUnits[_heroId].length * 7) * _hours,
            _heroId
        );

        emit ResetShield(_heroId, s.shieldedUnits[_heroId], endTimeStamp);
    }

    function getShieldEndTimestamp(uint256 _heroId)
        external
        view
        returns (uint256)
    {
        return s.shieldEndTimestamp[_heroId];
    }

    function getBatchShieldEndTimestamp(uint256[] calldata _heroIds)
        external
        view
        returns (uint256[200] memory batch_)
    {
        for (uint256 i = 0; i < _heroIds.length; i++) {
            batch_[i] = s.shieldEndTimestamp[_heroIds[i]];
        }
    }

    function getUnitShieldEndTimestamp(uint256 _unitTokenId)
        external
        view
        returns (uint256)
    {
        return s.unitsShieldEndTimestamp[_unitTokenId];
    }

    function getBatchUnitShieldEndTimestamp(uint256[] calldata _unitTokenIds)
        external
        view
        returns (uint256[500] memory batch_)
    {
        for (uint256 i = 0; i < _unitTokenIds.length; i++) {
            batch_[i] = s.unitsShieldEndTimestamp[_unitTokenIds[i]];
        }
    }
}
