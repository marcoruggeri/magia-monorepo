// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {AppStorage, Modifiers, CraftSpell} from "../libraries/AppStorage.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/IMagiaHeroes.sol";
import "../interfaces/IMagiaLands.sol";
import "../interfaces/IMagiaSpells.sol";
import "../interfaces/IMagiaUnits.sol";

contract SpellsFacet3 is Modifiers {
    event Convert(
        uint256 indexed _heroId,
        uint256 indexed _occupiedLandId,
        uint256 indexed _landId
    );

    event Plague(
        uint256 indexed _heroId,
        uint256 indexed _landId,
        uint256 indexed _unitTokenId
    );

    event Pyroblast(uint256 indexed _heroId, uint256[4] _landIds);

    event Teleport(
        uint256 indexed _heroId,
        uint256 indexed _fromLandId,
        uint256 indexed _toLandId,
        uint256 _unitTokenId
    );

    event Transmute(
        uint256 indexed _heroId,
        uint256 _energyAmount,
        address _resource
    );

    function convert(
        uint256 _heroId,
        uint256 _occupiedLandId,
        uint256 _landId
    )
        external
        onlyHeroOwner(_heroId)
        onlyLandOccupier(_heroId, _occupiedLandId)
        checkShield(_heroId)
    {
        IMagiaLands landsContract = IMagiaLands(s.landsAddress);

        uint256[5] memory heroMagic = IMagiaHeroes(s.heroesAddress)
            .getMagicStats(_heroId);
        uint256[5] memory magicReqs = IMagiaSpells(s.spellsAddress)
            .getMagicReqs(11);
        require(heroMagic[0] >= magicReqs[0], "SpellsFacet: fail white req");
        require(heroMagic[1] >= magicReqs[1], "SpellsFacet: fail black req");
        require(heroMagic[2] >= magicReqs[2], "SpellsFacet: fail fire req");
        require(heroMagic[3] >= magicReqs[3], "SpellsFacet: fail water req");
        require(heroMagic[4] >= magicReqs[4], "SpellsFacet: fail hearth req");

        landsContract.checkCoords(_occupiedLandId, _landId, 1);

        uint256 unitTokenId = landsContract.getUnit(_landId);

        require(
            block.timestamp > s.unitsShieldEndTimestamp[unitTokenId],
            "SpellsFacet: shield active"
        );

        require(
            IMagiaUnits(s.unitsAddress).getAttack(unitTokenId) +
                IMagiaUnits(s.unitsAddress).getDefense(unitTokenId) <=
                2000,
            "UnitsFacet: attack + defense > 2000"
        );

        landsContract.setHero(_landId, _heroId);

        IMagiaSpells(s.spellsAddress).burn(msg.sender, 11, 1);

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(150, _heroId);

        emit Convert(_heroId, _occupiedLandId, _landId);
    }

    function plague(
        uint256 _heroId,
        uint256 _landId,
        uint256 _unitTokenId
    ) external onlyHeroOwner(_heroId) checkShield(_heroId) {
        require(
            IMagiaLands(s.landsAddress).checkUnit(_unitTokenId, _landId),
            "SpellsFacet: fail check"
        );
        uint256[5] memory heroMagic = IMagiaHeroes(s.heroesAddress)
            .getMagicStats(_heroId);
        uint256[5] memory magicReqs = IMagiaSpells(s.spellsAddress)
            .getMagicReqs(12);
        require(heroMagic[0] >= magicReqs[0], "SpellsFacet: fail white req");
        require(heroMagic[1] >= magicReqs[1], "SpellsFacet: fail black req");
        require(heroMagic[2] >= magicReqs[2], "SpellsFacet: fail fire req");
        require(heroMagic[3] >= magicReqs[3], "SpellsFacet: fail water req");
        require(heroMagic[4] >= magicReqs[4], "SpellsFacet: fail hearth req");
        require(
            block.timestamp > s.unitsShieldEndTimestamp[_unitTokenId],
            "SpellsFacet: shield active"
        );
        uint256 defense = IMagiaUnits(s.unitsAddress).getDefense(_unitTokenId);

        IMagiaUnits(s.unitsAddress).decreaseDefense(_unitTokenId, defense);
        IMagiaSpells(s.spellsAddress).burn(msg.sender, 12, 1);

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(150, _heroId);

        emit Plague(_heroId, _landId, _unitTokenId);
    }

    function pyroblast(uint256 _heroId, uint256[4] calldata _landIds)
        external
        onlyHeroOwner(_heroId)
        checkShield(_heroId)
    {
        uint256[5] memory heroMagic = IMagiaHeroes(s.heroesAddress)
            .getMagicStats(_heroId);
        uint256[5] memory magicReqs = IMagiaSpells(s.spellsAddress)
            .getMagicReqs(13);
        require(heroMagic[0] >= magicReqs[0], "SpellsFacet: fail white req");
        require(heroMagic[1] >= magicReqs[1], "SpellsFacet: fail black req");
        require(heroMagic[2] >= magicReqs[2], "SpellsFacet: fail fire req");
        require(heroMagic[3] >= magicReqs[3], "SpellsFacet: fail water req");
        require(heroMagic[4] >= magicReqs[4], "SpellsFacet: fail hearth req");

        IMagiaLands landsContract = IMagiaLands(s.landsAddress);

        // todo make sure it's enough
        landsContract.checkCoords(_landIds[0], _landIds[1], 1);
        landsContract.checkCoords(_landIds[1], _landIds[2], 1);
        landsContract.checkCoords(_landIds[2], _landIds[3], 1);

        uint256[4] memory unitTokenIds;

        unitTokenIds[0] = IMagiaLands(s.landsAddress).getUnit(_landIds[0]);
        unitTokenIds[1] = IMagiaLands(s.landsAddress).getUnit(_landIds[1]);
        unitTokenIds[2] = IMagiaLands(s.landsAddress).getUnit(_landIds[2]);
        unitTokenIds[3] = IMagiaLands(s.landsAddress).getUnit(_landIds[3]);

        if (
            block.timestamp > s.unitsShieldEndTimestamp[unitTokenIds[0]] &&
            unitTokenIds[0] != 0
        ) {
            _pyroblastDamage(unitTokenIds[0], _landIds[0], _heroId);
        }

        if (
            block.timestamp > s.unitsShieldEndTimestamp[unitTokenIds[1]] &&
            unitTokenIds[1] != 0
        ) {
            _pyroblastDamage(unitTokenIds[1], _landIds[1], _heroId);
        }

        if (
            block.timestamp > s.unitsShieldEndTimestamp[unitTokenIds[2]] &&
            unitTokenIds[2] != 0
        ) {
            _pyroblastDamage(unitTokenIds[2], _landIds[2], _heroId);
        }

        if (
            block.timestamp > s.unitsShieldEndTimestamp[unitTokenIds[3]] &&
            unitTokenIds[3] != 0
        ) {
            _pyroblastDamage(unitTokenIds[3], _landIds[3], _heroId);
        }

        IMagiaSpells(s.spellsAddress).burn(msg.sender, 13, 1);

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(150, _heroId);

        emit Pyroblast(_heroId, _landIds);
    }

    function teleport(
        uint256 _heroId,
        uint256 _unitTokenId,
        uint256 _fromLandId,
        uint256 _toLandId
    )
        external
        onlyHeroOwner(_heroId)
        checkShield(_heroId)
        onlyLandOccupier(_heroId, _fromLandId)
    {
        IMagiaLands landsContract = IMagiaLands(s.landsAddress);
        landsContract.checkCoords(_fromLandId, _toLandId, 10);
        require(
            landsContract.getUnit(_toLandId) == 0 ||
                landsContract.getHero(_toLandId) == _heroId,
            "SpellsFacet: tile not empty"
        );
        require(
            landsContract.checkUnit(_unitTokenId, _fromLandId),
            "SpellsFacet: fail check"
        );
        uint256[5] memory heroMagic = IMagiaHeroes(s.heroesAddress)
            .getMagicStats(_heroId);
        uint256[5] memory magicReqs = IMagiaSpells(s.spellsAddress)
            .getMagicReqs(14);
        require(heroMagic[0] >= magicReqs[0], "SpellsFacet: fail white req");
        require(heroMagic[1] >= magicReqs[1], "SpellsFacet: fail black req");
        require(heroMagic[2] >= magicReqs[2], "SpellsFacet: fail fire req");
        require(heroMagic[3] >= magicReqs[3], "SpellsFacet: fail water req");
        require(heroMagic[4] >= magicReqs[4], "SpellsFacet: fail hearth req");

        landsContract.setUnit(_fromLandId, 0);
        landsContract.setUnit(_toLandId, _unitTokenId);
        landsContract.setHero(_toLandId, _heroId);
        uint256 buildingId = landsContract.getBuilding(_fromLandId);
        if (buildingId == 0) {
            landsContract.setHero(_fromLandId, 0);
        }

        IMagiaSpells(s.spellsAddress).burn(msg.sender, 14, 1);

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(150, _heroId);

        emit Teleport(_heroId, _fromLandId, _toLandId, _unitTokenId);
    }

    function transmute(
        uint256 _heroId,
        uint256 _energyAmount,
        address _resource
    ) external onlyHeroOwner(_heroId) checkShield(_heroId) {
        uint256[5] memory heroMagic = IMagiaHeroes(s.heroesAddress)
            .getMagicStats(_heroId);
        uint256[5] memory magicReqs = IMagiaSpells(s.spellsAddress)
            .getMagicReqs(15);
        require(heroMagic[0] >= magicReqs[0], "SpellsFacet: fail white req");
        require(heroMagic[1] >= magicReqs[1], "SpellsFacet: fail black req");
        require(heroMagic[2] >= magicReqs[2], "SpellsFacet: fail fire req");
        require(heroMagic[3] >= magicReqs[3], "SpellsFacet: fail water req");
        require(heroMagic[4] >= magicReqs[4], "SpellsFacet: fail hearth req");

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(
            _energyAmount + 150,
            _heroId
        );

        IMagiaSpells(s.spellsAddress).burn(msg.sender, 15, 1);

        IERC20(_resource).mint(msg.sender, (_energyAmount / 2) * 1e18);

        emit Transmute(_heroId, _energyAmount, _resource);
    }

    function _pyroblastDamage(
        uint256 _unitTokenId,
        uint256 _landId,
        uint256 _heroId
    ) internal {
        uint256 health = IMagiaUnits(s.unitsAddress).getHealth(_unitTokenId);

        if (health <= 400) {
            // dies
            IMagiaLands(s.landsAddress).setUnit(_landId, 0);
            IMagiaLands(s.landsAddress).setHero(_landId, 0);

            IMagiaUnits(s.unitsAddress).transferFrom(
                address(this),
                0x000000000000000000000000000000000000dEaD,
                _unitTokenId
            );
            // grant exp
            uint256 attackUnit = IMagiaUnits(s.unitsAddress).getAttack(
                _unitTokenId
            );
            uint256 defenseUnit = IMagiaUnits(s.unitsAddress).getDefense(
                _unitTokenId
            );
            IMagiaHeroes(s.heroesAddress).increaseExp(
                (attackUnit + defenseUnit) / 10,
                _heroId
            );
        } else {
            IMagiaUnits(s.unitsAddress).decreaseHealth(_unitTokenId, 400);
        }
    }
}
