// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {AppStorage, Modifiers} from "../libraries/AppStorage.sol";

import "../interfaces/IERC20.sol";
import "../interfaces/IMagiaQuests.sol";
import "../interfaces/IMagiaHeroes.sol";

contract QuestsFacet is Modifiers {
    function buyQuest(uint256 _randomness) external {
        IERC20(s.goldAddress).burnFrom(msg.sender, 200 ether);
        uint256[] memory expandedValues = new uint256[](11);
        uint256 tot;
        for (uint256 i = 0; i < 11; i++) {
            uint256 value = (uint256(keccak256(abi.encode(_randomness, i))) %
                10) + 1;
            expandedValues[i] = value;
            tot += value;
        }
        uint256 expCoefficient = (uint256(
            keccak256(abi.encode(_randomness, 100))
        ) % 10) + 1;
        uint256 goldCoefficient = (uint256(
            keccak256(abi.encode(_randomness, 101))
        ) % 10) + 1;
        uint256 lumberCoefficient = (uint256(
            keccak256(abi.encode(_randomness, 102))
        ) % 10) + 1;
        uint256 manaCoefficient = (uint256(
            keccak256(abi.encode(_randomness, 103))
        ) % 10) + 1;
        IMagiaQuests.Quest memory newQuest = IMagiaQuests.Quest({
            mobsReqs: expandedValues,
            expReward: tot * expCoefficient,
            goldReward: tot * goldCoefficient,
            lumberReward: tot * lumberCoefficient,
            manaReward: tot * manaCoefficient
        });
        IMagiaQuests(s.questsAddress).mint(msg.sender, newQuest);
    }

    function startQuest(uint256 _heroId, uint256 _questId)
        external
        onlyHeroOwner(_heroId)
    {
        require(
            s.activeQuest[_heroId] == 0,
            "QuestsFacet: quest already started"
        );
        IMagiaQuests(s.questsAddress).transferFrom(
            msg.sender,
            address(this),
            _questId
        );
        s.activeQuest[_heroId] = _questId;
    }

    function cancelQuest(uint256 _heroId) external onlyHeroOwner(_heroId) {
        delete s.activeQuest[_heroId];
    }

    function claimQuest(uint256 _heroId) external onlyHeroOwner(_heroId) {
        require(s.activeQuest[_heroId] != 0, "QuestsFacet: no quest started");
        IMagiaQuests(s.questsAddress).checkQuest(s.activeQuest[_heroId]);
        // grant exp and resources
        IMagiaQuests.Quest memory questData = IMagiaQuests(s.questsAddress)
            .getQuest(s.activeQuest[_heroId]);
        IMagiaHeroes(s.heroesAddress).increaseExp(_heroId, questData.expReward);
        IERC20(s.goldAddress).mint(msg.sender, questData.goldReward * 1e18);
        IERC20(s.goldAddress).mint(msg.sender, questData.lumberReward * 1e18);
        IERC20(s.goldAddress).mint(msg.sender, questData.manaReward * 1e18);
        delete s.activeQuest[_heroId];
    }
}
