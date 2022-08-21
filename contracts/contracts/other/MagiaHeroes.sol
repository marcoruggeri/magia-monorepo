// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MagiaHeroes is ERC721EnumerableUpgradeable, OwnableUpgradeable {
    event ClaimEnergy(uint256 _heroId, uint256 _energyClaimed);

    struct Hero {
        uint256 white;
        uint256 black;
        uint256 fire;
        uint256 water;
        uint256 earth;
        uint256 exp;
        uint256 level;
        uint256 energy;
        string name;
    }

    // tokenId => Hero
    mapping(uint256 => Hero) public heroes;
    mapping(uint256 => uint256) lastEnergyClaimed;

    mapping(address => uint256) public whitelist;

    address public gameDiamond;

    function initialize(address _gameDiamond) public initializer {
        __ERC721_init("MagiaHeroes", "MH");
        __Ownable_init();
        gameDiamond = _gameDiamond;
    }

    function setWhitelist(
        address[] calldata _addresses,
        uint256[] calldata _approved
    ) external onlyOwner {
        require(
            _addresses.length == _approved.length,
            "array length doesn't match"
        );
        for (uint256 i; i < _addresses.length; i++) {
            whitelist[_addresses[i]] = _approved[i];
        }
    }

    function mintHero(Hero calldata _hero) external returns (uint256) {
        // require(whitelist[msg.sender] > 0, "not whitelisted or already minted");
        // whitelist[msg.sender]--;
        uint256 statsSum = _hero.white +
            _hero.black +
            _hero.fire +
            _hero.water +
            _hero.earth;
        require(statsSum == 20, "MagiaHeroes: Wrong sum");
        require(_hero.exp == 0, "MagiaHeroes: Wrong exp");
        require(_hero.level == 1, "MagiaHeroes: Wrong lvl");
        require(_hero.energy == 750, "MagiaHeroes: Wrong enr");

        uint256 tokenId = totalSupply() + 1;

        heroes[tokenId] = _hero;
        lastEnergyClaimed[tokenId] = block.timestamp;

        _safeMint(_msgSender(), tokenId);

        return tokenId;
    }

    function claimEnergy(uint256 _heroId) external {
        require(msg.sender == ownerOf(_heroId), "MagiaHeroes: Not owner");
        uint256 energyClaimed = (block.timestamp - lastEnergyClaimed[_heroId]) /
            50;
        require(energyClaimed > 50, "MagiaHeroes: below minClaim");
        if (energyClaimed > 3500) energyClaimed = 3500;
        heroes[_heroId].energy += energyClaimed;
        lastEnergyClaimed[_heroId] = block.timestamp;

        emit ClaimEnergy(_heroId, energyClaimed);
    }

    function levelUp(uint256 _heroId, uint256[5] calldata _magic) external {
        require(msg.sender == ownerOf(_heroId), "MagiaHeroes: Not owner");
        require(
            heroes[_heroId].exp >= heroes[_heroId].level * 1000,
            "MagiaHeroes: Not enough exp"
        );
        uint256 magicSum = _magic[0] +
            _magic[1] +
            _magic[2] +
            _magic[3] +
            _magic[4];
        require(magicSum == 5, "MagiaHeroes: Wrong sum");
        heroes[_heroId].white += _magic[0];
        heroes[_heroId].black += _magic[1];
        heroes[_heroId].fire += _magic[2];
        heroes[_heroId].water += _magic[3];
        heroes[_heroId].earth += _magic[4];
        heroes[_heroId].exp -= heroes[_heroId].level * 1000;
        heroes[_heroId].level++;
    }

    function increaseEnergy(uint256 _amount, uint256 _heroId) external {
        require(msg.sender == gameDiamond, "MagiaHeroes: only gameDiamond");
        heroes[_heroId].energy += _amount;
    }

    function decreaseEnergy(uint256 _amount, uint256 _heroId) external {
        require(msg.sender == gameDiamond, "MagiaHeroes: only gameDiamond");
        heroes[_heroId].energy -= _amount;
    }

    function increaseExp(uint256 _amount, uint256 _heroId) external {
        require(msg.sender == gameDiamond, "MagiaHeroes: only gameDiamond");
        heroes[_heroId].exp += _amount;
    }

    function getClaimableEnergy(uint256 _heroId)
        external
        view
        returns (uint256)
    {
        uint256 energyClaimed = (block.timestamp - lastEnergyClaimed[_heroId]) /
            50;
        if (energyClaimed > 3500) energyClaimed = 3500;
        return energyClaimed;
    }

    function getEnergy(uint256 _heroId) external view returns (uint256) {
        return heroes[_heroId].energy;
    }

    function getExp(uint256 _heroId) external view returns (uint256) {
        return heroes[_heroId].exp;
    }

    function getMagicStats(uint256 _heroId)
        external
        view
        returns (uint256[5] memory magicStats_)
    {
        magicStats_[0] = heroes[_heroId].white;
        magicStats_[1] = heroes[_heroId].black;
        magicStats_[2] = heroes[_heroId].fire;
        magicStats_[3] = heroes[_heroId].water;
        magicStats_[4] = heroes[_heroId].earth;
    }

    function getBatchExp(uint256[] calldata _heroIds)
        external
        view
        returns (uint256[200] memory exp_)
    {
        for (uint256 i = 0; i < _heroIds.length; i++) {
            exp_[i] = heroes[_heroIds[i]].exp;
        }
    }

    function getBatchName(uint256[] calldata _heroIds)
        external
        view
        returns (string[200] memory names_)
    {
        for (uint256 i = 0; i < _heroIds.length; i++) {
            names_[i] = heroes[_heroIds[i]].name;
        }
    }

    function getBatchHero() external view returns (Hero[] memory) {
        Hero[] memory heroes_ = new Hero[](totalSupply());
        for (uint256 i = 0; i < totalSupply(); i++) {
            heroes_[i] = heroes[i];
        }
        return heroes_;
    }
}
