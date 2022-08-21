// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

interface IMagiaLands {
    struct Land {
        uint256 heroId;
        uint256 coordinateX;
        uint256 coordinateY;
        uint256[] units;
        uint256 gold;
        uint256 lumber;
        uint256 mana;
        uint256 building;
    }

    function mintLands(Land calldata _land) external;

    function totalSupply() external view returns (uint256);

    function setUnit(uint256 _landId, uint256 _unitId) external;

    function setBuilding(uint256 _landId, uint256 _buildingId) external;

    function setHero(uint256 _landId, uint256 _heroId) external;

    function claimGold(uint256 _landId, uint256 _amount) external;

    function claimLumber(uint256 _landId, uint256 _amount) external;

    function claimMana(uint256 _landId, uint256 _amount) external;

    function getLandById(uint256 _landId) external view returns (Land memory);

    function getHero(uint256 _landId) external view returns (uint256);

    function getUnit(uint256 _landId) external view returns (uint256);

    function getBuilding(uint256 _landId) external view returns (uint256);

    function getLandGold(uint256 _landId) external view returns (uint256);

    function getLandLumber(uint256 _landId) external view returns (uint256);

    function getLandMana(uint256 _landId) external view returns (uint256);

    function checkUnit(uint256 _unitId, uint256 _landId)
        external
        view
        returns (bool res_);

    function checkCoords(
        uint256 _fromLandId,
        uint256 _toLandId,
        uint256 _range
    ) external view;
}
