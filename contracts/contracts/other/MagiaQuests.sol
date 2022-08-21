// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../interfaces/IERC20.sol";

import "hardhat/console.sol";

contract MagiaQuests is ERC721EnumerableUpgradeable, OwnableUpgradeable {
    struct Quest {
        uint256[] mobsReqs; // each index equals unitsTypeId
        uint256 expReward;
        uint256 goldReward;
        uint256 lumberReward;
        uint256 manaReward;
    }

    address public gameDiamond;
    address public gold;
    address public lumber;
    address public mana;

    // questId => Unit
    mapping(uint256 => Quest) public quests;

    function initialize(
        address _gameDiamond,
        address _gold,
        address _lumber,
        address _mana
    ) public initializer {
        __ERC721_init("MagiaQuests", "MQT");
        __Ownable_init();
        gameDiamond = _gameDiamond;
        gold = _gold;
        lumber = _lumber;
        mana = _mana;
    }

    function mint(address _account, Quest calldata _quest) external {
        require(msg.sender == gameDiamond, "MagiaQuests: restricted");
        uint256 tokenId = totalSupply() + 1;
        quests[tokenId] = _quest;
        _mint(_account, tokenId);
    }

    function killUnit(uint256 _questId, uint256 _unitTypeId) external {
        require(msg.sender == gameDiamond, "MagiaQuests: restricted");
        if (quests[_questId].mobsReqs[_unitTypeId] > 0) {
            quests[_questId].mobsReqs[_unitTypeId]--;
        }
    }

    function checkQuest(uint256 _questId) external view {
        for (uint256 i; i < 11; i++) {
            require(
                quests[_questId].mobsReqs[i] == 0,
                "MagiaQuests: quest not completed"
            );
        }
    }

    function getQuest(uint256 _questId) external view returns (Quest memory) {
        return quests[_questId];
    }
}
