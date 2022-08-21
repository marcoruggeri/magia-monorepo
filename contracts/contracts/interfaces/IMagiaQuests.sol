// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

interface IMagiaQuests {
    struct Quest {
        uint256[] mobsReqs; // each index equals unitsTypeId
        uint256 expReward;
        uint256 goldReward;
        uint256 lumberReward;
        uint256 manaReward;
    }

    function mint(address _account, Quest calldata _quest) external;

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function killUnit(uint256 _questId, uint256 _unitTypeId) external;

    function checkQuest(uint256 _questId) external view;

    function getQuest(uint256 _questId) external view returns (Quest memory);
}
