// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

interface IMagiaUnits {
    struct Unit {
        uint256 attack;
        uint256 defense;
        uint256 range;
        uint256 health;
        uint256 unitType; // 1 swordsmen, 2 bowmen...
        string name;
    }

    function mint(address _account, uint256 _unitId) external;

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function ownerOf(uint256 tokenId) external view returns (address);

    function decreaseHealth(uint256 _tokenId, uint256 _amount) external;

    function increaseHealth(uint256 _tokenId, uint256 _amount) external;

    function increaseDefense(uint256 _tokenId, uint256 _amount) external;

    function decreaseDefense(uint256 _tokenId, uint256 _amount) external;

    function increaseAttack(uint256 _tokenId, uint256 _amount) external;

    function getCraftedFrom(uint256 _unitId) external view returns (uint256);

    function getCost(uint256 _unitId) external view returns (uint256[3] memory);

    function getCraftTime(uint256 _unitId) external view returns (uint256);

    function getUnit(uint256 _tokenId) external view returns (Unit memory);

    function getUnitTypeId(uint256 _tokenId) external view returns (uint256);

    function getAttack(uint256 _tokenId) external view returns (uint256);

    function getDefense(uint256 _tokenId) external view returns (uint256);

    function getHealth(uint256 _tokenId) external view returns (uint256);

    function getRange(uint256 _tokenId) external view returns (uint256);

    function totalSupply() external view returns (uint256);
}
