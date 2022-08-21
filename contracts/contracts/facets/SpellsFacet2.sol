// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {AppStorage, Modifiers, CraftSpell} from "../libraries/AppStorage.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/IMagiaHeroes.sol";
import "../interfaces/IMagiaLands.sol";
import "../interfaces/IMagiaSpells.sol";
import "../interfaces/IMagiaUnits.sol";

contract SpellsFacet2 is Modifiers {
    event SummonAngels(
        uint256 indexed _heroId,
        uint256 indexed _occupiedLandId,
        uint256 indexed _landId
    );

    event SummonBlackKnights(
        uint256 indexed _heroId,
        uint256 indexed _occupiedLandId,
        uint256 indexed _landId
    );

    event SummonFireElemental(
        uint256 indexed _heroId,
        uint256 indexed _occupiedLandId,
        uint256 indexed _landId
    );

    event SummonWaterElemental(
        uint256 indexed _heroId,
        uint256 indexed _occupiedLandId,
        uint256 indexed _landId
    );

    event SummonEarthElemental(
        uint256 indexed _heroId,
        uint256 indexed _occupiedLandId,
        uint256 indexed _landId
    );

    function summonAngels(
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
            .getMagicReqs(6);
        require(heroMagic[0] >= magicReqs[0], "SpellsFacet: fail white req");
        require(heroMagic[1] >= magicReqs[1], "SpellsFacet: fail black req");
        require(heroMagic[2] >= magicReqs[2], "SpellsFacet: fail fire req");
        require(heroMagic[3] >= magicReqs[3], "SpellsFacet: fail water req");
        require(heroMagic[4] >= magicReqs[4], "SpellsFacet: fail hearth req");

        require(
            landsContract.getUnit(_landId) == 0,
            "UnitsFacet: tile not empty"
        );

        landsContract.checkCoords(_occupiedLandId, _landId, 1);

        IMagiaUnits(s.unitsAddress).mint(address(this), 12);

        uint256 tokenId = IMagiaUnits(s.unitsAddress).totalSupply();

        landsContract.setUnit(_landId, tokenId);
        landsContract.setHero(_landId, _heroId);

        IMagiaSpells(s.spellsAddress).burn(msg.sender, 6, 1);

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(100, _heroId);

        emit SummonAngels(_heroId, _occupiedLandId, _landId);
    }

    function summonBlackKnights(
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
            .getMagicReqs(7);
        require(heroMagic[0] >= magicReqs[0], "SpellsFacet: fail white req");
        require(heroMagic[1] >= magicReqs[1], "SpellsFacet: fail black req");
        require(heroMagic[2] >= magicReqs[2], "SpellsFacet: fail fire req");
        require(heroMagic[3] >= magicReqs[3], "SpellsFacet: fail water req");
        require(heroMagic[4] >= magicReqs[4], "SpellsFacet: fail hearth req");

        require(
            landsContract.getUnit(_landId) == 0,
            "UnitsFacet: tile not empty"
        );

        landsContract.checkCoords(_occupiedLandId, _landId, 1);

        IMagiaUnits(s.unitsAddress).mint(address(this), 13);

        uint256 tokenId = IMagiaUnits(s.unitsAddress).totalSupply();

        landsContract.setUnit(_landId, tokenId);
        landsContract.setHero(_landId, _heroId);

        IMagiaSpells(s.spellsAddress).burn(msg.sender, 7, 1);

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(100, _heroId);

        emit SummonBlackKnights(_heroId, _occupiedLandId, _landId);
    }

    function summonFireElemental(
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
            .getMagicReqs(8);
        require(heroMagic[0] >= magicReqs[0], "SpellsFacet: fail white req");
        require(heroMagic[1] >= magicReqs[1], "SpellsFacet: fail black req");
        require(heroMagic[2] >= magicReqs[2], "SpellsFacet: fail fire req");
        require(heroMagic[3] >= magicReqs[3], "SpellsFacet: fail water req");
        require(heroMagic[4] >= magicReqs[4], "SpellsFacet: fail hearth req");

        require(
            landsContract.getUnit(_landId) == 0,
            "UnitsFacet: tile not empty"
        );

        landsContract.checkCoords(_occupiedLandId, _landId, 1);

        IMagiaUnits(s.unitsAddress).mint(address(this), 14);

        uint256 tokenId = IMagiaUnits(s.unitsAddress).totalSupply();

        landsContract.setUnit(_landId, tokenId);
        landsContract.setHero(_landId, _heroId);

        IMagiaSpells(s.spellsAddress).burn(msg.sender, 8, 1);

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(100, _heroId);

        emit SummonFireElemental(_heroId, _occupiedLandId, _landId);
    }

    function summonWaterElemental(
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
            .getMagicReqs(9);
        require(heroMagic[0] >= magicReqs[0], "SpellsFacet: fail white req");
        require(heroMagic[1] >= magicReqs[1], "SpellsFacet: fail black req");
        require(heroMagic[2] >= magicReqs[2], "SpellsFacet: fail fire req");
        require(heroMagic[3] >= magicReqs[3], "SpellsFacet: fail water req");
        require(heroMagic[4] >= magicReqs[4], "SpellsFacet: fail hearth req");

        require(
            landsContract.getUnit(_landId) == 0,
            "UnitsFacet: tile not empty"
        );

        landsContract.checkCoords(_occupiedLandId, _landId, 1);

        IMagiaUnits(s.unitsAddress).mint(address(this), 15);

        uint256 tokenId = IMagiaUnits(s.unitsAddress).totalSupply();

        landsContract.setUnit(_landId, tokenId);
        landsContract.setHero(_landId, _heroId);

        IMagiaSpells(s.spellsAddress).burn(msg.sender, 9, 1);

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(100, _heroId);

        emit SummonWaterElemental(_heroId, _occupiedLandId, _landId);
    }

    function summonEarthElemental(
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
            .getMagicReqs(10);
        require(heroMagic[0] >= magicReqs[0], "SpellsFacet: fail white req");
        require(heroMagic[1] >= magicReqs[1], "SpellsFacet: fail black req");
        require(heroMagic[2] >= magicReqs[2], "SpellsFacet: fail fire req");
        require(heroMagic[3] >= magicReqs[3], "SpellsFacet: fail water req");
        require(heroMagic[4] >= magicReqs[4], "SpellsFacet: fail hearth req");

        require(
            landsContract.getUnit(_landId) == 0,
            "UnitsFacet: tile not empty"
        );

        landsContract.checkCoords(_occupiedLandId, _landId, 1);

        IMagiaUnits(s.unitsAddress).mint(address(this), 16);

        uint256 tokenId = IMagiaUnits(s.unitsAddress).totalSupply();

        landsContract.setUnit(_landId, tokenId);
        landsContract.setHero(_landId, _heroId);

        IMagiaSpells(s.spellsAddress).burn(msg.sender, 10, 1);

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(100, _heroId);

        emit SummonEarthElemental(_heroId, _occupiedLandId, _landId);
    }
}
