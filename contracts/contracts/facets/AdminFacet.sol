// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {AppStorage, Modifiers} from "../libraries/AppStorage.sol";
import "../interfaces/IMagiaUnits.sol";
import "../interfaces/IMagiaLands.sol";
import "../interfaces/IMagiaGold.sol";
import "../interfaces/IMagiaLumber.sol";
import "../interfaces/IMagiaMana.sol";
import "../interfaces/IMagiaHeroes.sol";

contract AdminFacet is Modifiers {
    function setAddresses(
        address _goldAddress,
        address _lumberAddress,
        address _manaAddress,
        address _buildingsAddress,
        address _landsAddress,
        address _unitsAddress,
        address _heroesAddress,
        address _spellsAddress,
        address _questsAddress
    ) external onlyOwner {
        s.goldAddress = _goldAddress;
        s.lumberAddress = _lumberAddress;
        s.manaAddress = _manaAddress;
        s.buildingsAddress = _buildingsAddress;
        s.landsAddress = _landsAddress;
        s.landsAddress = _landsAddress;
        s.unitsAddress = _unitsAddress;
        s.heroesAddress = _heroesAddress;
        s.spellsAddress = _spellsAddress;
        s.questsAddress = _questsAddress;
    }

    function spawnMobs(
        uint256[] calldata _landIds,
        uint256[] calldata _unitTypeIds
    ) external onlyOwner {
        require(
            _landIds.length == _unitTypeIds.length,
            "AdminFacet: mismatch array"
        );
        for (uint256 i = 0; i < _landIds.length; i++) {
            uint256 tokenId = IMagiaUnits(s.unitsAddress).totalSupply() + 1;
            IMagiaUnits(s.unitsAddress).mint(address(this), _unitTypeIds[i]);
            require(
                IMagiaLands(s.landsAddress).getUnit(_landIds[i]) == 0,
                "AdminFacet: tile not empty"
            );
            IMagiaLands(s.landsAddress).setUnit(_landIds[i], tokenId);
        }
    }

    function fixUnit(uint256 _landId, uint256 _unitTokenId) external onlyOwner {
        IMagiaLands(s.landsAddress).setUnit(_landId, _unitTokenId);
    }

    function fixHero(uint256 _landId, uint256 _heroTokenId) external onlyOwner {
        IMagiaLands(s.landsAddress).setHero(_landId, _heroTokenId);
    }

    function mintResources(address _account) external onlyOwner {
        IMagiaGold(s.goldAddress).mint(_account, 100000 ether);
        IMagiaLumber(s.lumberAddress).mint(_account, 100000 ether);
        IMagiaMana(s.manaAddress).mint(_account, 100000 ether);
    }

    function grantExp(uint256 _exp, uint256 _heroTokenId) external onlyOwner {
        IMagiaHeroes(s.heroesAddress).increaseExp(_exp, _heroTokenId);
    }

    function grantEnergy(uint256 _energy, uint256 _heroTokenId)
        external
        onlyOwner
    {
        IMagiaHeroes(s.heroesAddress).increaseEnergy(_energy, _heroTokenId);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
