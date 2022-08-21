// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {LibAppStorage, AppStorage} from "../libraries/AppStorage.sol";
import "../interfaces/IMagiaLands.sol";
import "../interfaces/IMagiaUnits.sol";
import "../interfaces/IMagiaHeroes.sol";
import "../interfaces/IMagiaQuests.sol";

import "hardhat/console.sol";

library LibGame {
    function handleAttackDamage(
        uint256 _heroId,
        uint256 _fromLandId,
        uint256 _toLandId,
        uint256 _unitTokenId,
        uint256 enemyUnitId,
        uint256 _range
    ) internal {
        AppStorage storage s = LibAppStorage.diamondStorage();
        uint256 attackAttacker = IMagiaUnits(s.unitsAddress).getAttack(
            _unitTokenId
        );
        uint256 attackDefender = IMagiaUnits(s.unitsAddress).getAttack(
            enemyUnitId
        );
        uint256 defenseAttacker = IMagiaUnits(s.unitsAddress).getDefense(
            _unitTokenId
        );
        uint256 defenseDefender = IMagiaUnits(s.unitsAddress).getDefense(
            enemyUnitId
        );
        if (attackAttacker > defenseDefender) {
            if (
                attackAttacker - defenseDefender >=
                IMagiaUnits(s.unitsAddress).getHealth(enemyUnitId)
            ) {
                // defender die
                IMagiaLands(s.landsAddress).setUnit(_toLandId, 0);
                IMagiaLands(s.landsAddress).setHero(_toLandId, 0);

                IMagiaUnits(s.unitsAddress).transferFrom(
                    address(this),
                    0x000000000000000000000000000000000000dEaD,
                    enemyUnitId
                );

                // grant exp
                IMagiaHeroes(s.heroesAddress).increaseExp(
                    (attackDefender + defenseDefender) / 10,
                    _heroId
                );

                // handle quest
                if (s.activeQuest[_heroId] != 0) {
                    uint256 killedTypeId = IMagiaUnits(s.unitsAddress)
                        .getUnitTypeId(enemyUnitId);
                    IMagiaQuests(s.questsAddress).killUnit(
                        s.activeQuest[_heroId],
                        killedTypeId
                    );
                }
            } else {
                // handle damage
                IMagiaUnits(s.unitsAddress).decreaseHealth(
                    enemyUnitId,
                    attackAttacker - defenseDefender
                );
            }
        }
        if (_range == 1) {
            if (attackDefender > defenseAttacker) {
                if (
                    attackDefender - defenseAttacker >=
                    IMagiaUnits(s.unitsAddress).getHealth(_unitTokenId)
                ) {
                    // attacker die
                    IMagiaLands(s.landsAddress).setUnit(_fromLandId, 0);
                    IMagiaLands(s.landsAddress).setHero(_fromLandId, 0);

                    IMagiaUnits(s.unitsAddress).transferFrom(
                        address(this),
                        0x000000000000000000000000000000000000dEaD,
                        _unitTokenId
                    );
                    uint256 enemyHeroId = IMagiaLands(s.landsAddress).getHero(
                        _toLandId
                    );
                    // grant exp
                    IMagiaHeroes(s.heroesAddress).increaseExp(
                        (attackAttacker + defenseAttacker) / 10,
                        enemyHeroId
                    );

                    // handle quest
                    if (s.activeQuest[enemyHeroId] != 0) {
                        uint256 killedTypeId = IMagiaUnits(s.unitsAddress)
                            .getUnitTypeId(_unitTokenId);
                        IMagiaQuests(s.questsAddress).killUnit(
                            s.activeQuest[enemyHeroId],
                            killedTypeId
                        );
                    }
                } else {
                    // handle damage
                    IMagiaUnits(s.unitsAddress).decreaseHealth(
                        _unitTokenId,
                        attackDefender - defenseAttacker
                    );
                }
            }
        }
    }
}
