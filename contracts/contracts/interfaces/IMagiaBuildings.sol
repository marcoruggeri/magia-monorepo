// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

interface IMagiaBuildings {
    function mint(address _account, uint256 _buildingId) external;

    function getCost(uint256 _buildingId)
        external
        view
        returns (uint256[3] memory);

    function getCraftTime(uint256 _buildingId) external view returns (uint256);

    function getLevel(uint256 _buildingId) external view returns (uint256);

    function getBuildingType(uint256 _buildingId)
        external
        view
        returns (uint256);
}
