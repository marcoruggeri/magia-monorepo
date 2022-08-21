// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

interface IMagiaSpells {
    function mint(address _account, uint256 _spellId) external;

    function burn(
        address _account,
        uint256 _spellId,
        uint256 _amount
    ) external;

    function getCost(uint256 _spellId)
        external
        view
        returns (uint256[3] memory);

    function getCraftTime(uint256 _spellId) external view returns (uint256);

    function getNameBytes(uint256 _spellId)
        external
        view
        returns (bytes memory);

    function getMagicReqs(uint256 _spellId)
        external
        view
        returns (uint256[5] memory);
}
