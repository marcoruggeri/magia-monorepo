// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {AppStorage, Modifiers, CraftSpell} from "../libraries/AppStorage.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/IMagiaHeroes.sol";
import "../interfaces/IMagiaLands.sol";
import "../interfaces/IMagiaSpells.sol";
import "../interfaces/IMagiaUnits.sol";

contract SpellsFacet1 is Modifiers {
    event Healing(
        uint256 indexed _heroId,
        uint256 indexed _landId,
        uint256 indexed _unitTokenId
    );

    event ReduceArmor(
        uint256 indexed _heroId,
        uint256 indexed _landId,
        uint256 indexed _unitTokenId
    );

    event Fireball(
        uint256 indexed _heroId,
        uint256 indexed _landId,
        uint256 indexed _unitTokenId
    );

    event GiantStrength(
        uint256 indexed _heroId,
        uint256 indexed _landId,
        uint256 indexed _unitTokenId
    );

    event IceArmor(
        uint256 indexed _heroId,
        uint256 indexed _landId,
        uint256 indexed _unitTokenId
    );

    function craftSpell(uint256 _heroId, uint256 _spellId)
        external
        onlyHeroOwner(_heroId)
    {
        IMagiaSpells spellsContract = IMagiaSpells(s.spellsAddress);
        uint256[3] memory cost = spellsContract.getCost(_spellId);
        uint256 craftTime = spellsContract.getCraftTime(_spellId);
        bytes memory nameBytes = spellsContract.getNameBytes(_spellId);
        require(nameBytes.length > 0, "GameFacet: not released yet");
        IERC20(s.goldAddress).burnFrom(msg.sender, cost[0]);
        IERC20(s.lumberAddress).burnFrom(msg.sender, cost[1]);
        IERC20(s.manaAddress).burnFrom(msg.sender, cost[2]);
        if (craftTime == 0) {
            spellsContract.mint(msg.sender, _spellId);
        } else {
            uint256 readyTimestamp = block.timestamp + craftTime;
            CraftSpell memory newSpell = CraftSpell(_spellId, readyTimestamp);
            s.craftSpells[_heroId] = newSpell;
        }
    }

    function claimSpell(uint256 _heroId) external onlyHeroOwner(_heroId) {
        require(
            block.timestamp >= s.craftSpells[_heroId].readyTimestamp,
            "SpellsFacet: not ready yet"
        );
        IMagiaSpells(s.spellsAddress).mint(
            msg.sender,
            s.craftSpells[_heroId].spellId
        );
        delete s.craftSpells[_heroId];
    }

    function healing(
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
            .getMagicReqs(1);
        require(heroMagic[0] >= magicReqs[0], "SpellsFacet: fail white req");
        require(heroMagic[1] >= magicReqs[1], "SpellsFacet: fail black req");
        require(heroMagic[2] >= magicReqs[2], "SpellsFacet: fail fire req");
        require(heroMagic[3] >= magicReqs[3], "SpellsFacet: fail water req");
        require(heroMagic[4] >= magicReqs[4], "SpellsFacet: fail hearth req");
        require(
            block.timestamp > s.unitsShieldEndTimestamp[_unitTokenId],
            "SpellsFacet: shield active"
        );
        IMagiaUnits(s.unitsAddress).increaseHealth(_unitTokenId, 600);
        IMagiaSpells(s.spellsAddress).burn(msg.sender, 1, 1);

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(50, _heroId);

        emit Healing(_heroId, _landId, _unitTokenId);
    }

    function reduceArmor(
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
            .getMagicReqs(2);
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
        uint256 reduceDefense = 1000;
        if (defense < 1000) {
            reduceDefense = defense;
        }
        IMagiaUnits(s.unitsAddress).decreaseDefense(
            _unitTokenId,
            reduceDefense
        );
        IMagiaSpells(s.spellsAddress).burn(msg.sender, 2, 1);

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(50, _heroId);

        emit ReduceArmor(_heroId, _landId, _unitTokenId);
    }

    function fireball(
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
            .getMagicReqs(3);
        require(heroMagic[0] >= magicReqs[0], "SpellsFacet: fail white req");
        require(heroMagic[1] >= magicReqs[1], "SpellsFacet: fail black req");
        require(heroMagic[2] >= magicReqs[2], "SpellsFacet: fail fire req");
        require(heroMagic[3] >= magicReqs[3], "SpellsFacet: fail water req");
        require(heroMagic[4] >= magicReqs[4], "SpellsFacet: fail hearth req");
        require(
            block.timestamp > s.unitsShieldEndTimestamp[_unitTokenId],
            "SpellsFacet: shield active"
        );
        uint256 health = IMagiaUnits(s.unitsAddress).getHealth(_unitTokenId);

        if (health <= 500) {
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
            IMagiaUnits(s.unitsAddress).decreaseHealth(_unitTokenId, 500);
        }

        IMagiaSpells(s.spellsAddress).burn(msg.sender, 3, 1);

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(50, _heroId);

        emit Fireball(_heroId, _landId, _unitTokenId);
    }

    function giantStrength(
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
            .getMagicReqs(4);
        require(heroMagic[0] >= magicReqs[0], "SpellsFacet: fail white req");
        require(heroMagic[1] >= magicReqs[1], "SpellsFacet: fail black req");
        require(heroMagic[2] >= magicReqs[2], "SpellsFacet: fail fire req");
        require(heroMagic[3] >= magicReqs[3], "SpellsFacet: fail water req");
        require(heroMagic[4] >= magicReqs[4], "SpellsFacet: fail hearth req");
        require(
            block.timestamp > s.unitsShieldEndTimestamp[_unitTokenId],
            "SpellsFacet: shield active"
        );
        IMagiaUnits(s.unitsAddress).increaseAttack(_unitTokenId, 200);
        IMagiaSpells(s.spellsAddress).burn(msg.sender, 4, 1);

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(50, _heroId);

        emit GiantStrength(_heroId, _landId, _unitTokenId);
    }

    function iceArmor(
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
            .getMagicReqs(5);
        require(heroMagic[0] >= magicReqs[0], "SpellsFacet: fail white req");
        require(heroMagic[1] >= magicReqs[1], "SpellsFacet: fail black req");
        require(heroMagic[2] >= magicReqs[2], "SpellsFacet: fail fire req");
        require(heroMagic[3] >= magicReqs[3], "SpellsFacet: fail water req");
        require(heroMagic[4] >= magicReqs[4], "SpellsFacet: fail hearth req");
        require(
            block.timestamp > s.unitsShieldEndTimestamp[_unitTokenId],
            "SpellsFacet: shield active"
        );

        IMagiaUnits(s.unitsAddress).increaseDefense(_unitTokenId, 200);
        IMagiaSpells(s.spellsAddress).burn(msg.sender, 5, 1);

        IMagiaHeroes(s.heroesAddress).decreaseEnergy(50, _heroId);

        emit IceArmor(_heroId, _landId, _unitTokenId);
    }

    function getCraftSpells(uint256 _heroId)
        external
        view
        returns (CraftSpell memory)
    {
        return s.craftSpells[_heroId];
    }
}
