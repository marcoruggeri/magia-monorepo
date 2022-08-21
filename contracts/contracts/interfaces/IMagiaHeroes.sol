// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

interface IMagiaHeroes {
    function increaseEnergy(uint256 _amount, uint256 _heroId) external;

    function decreaseEnergy(uint256 _amount, uint256 _heroId) external;

    function increaseExp(uint256 _amount, uint256 _heroId) external;

    function getMagicStats(uint256 _heroId)
        external
        view
        returns (uint256[5] memory magicStats_);
}
