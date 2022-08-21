// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {RequestConfig, Modifiers} from "../libraries/AppStorage.sol";
import "../interfaces/IERC721.sol";
import "../interfaces/IMagiaBuildings.sol";
import "../interfaces/IMagiaLands.sol";
import "../interfaces/IMagiaUnits.sol";
import "../interfaces/IMagiaGold.sol";
import "../interfaces/IMagiaLumber.sol";
import "../interfaces/IMagiaMana.sol";
import "../libraries/LibMeta.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

import "hardhat/console.sol";

contract RegisterFacet is Modifiers {
    event Register(uint256 indexed _heroId, uint256 _landId);

    function testRegister(uint256 _heroId, uint256 _landId)
        external
        onlyHeroOwner(_heroId)
    {
        require(!s.registered[_heroId], "VRFFacet: already registered");
        _testRegister(_heroId, _landId);
    }

    function register(uint256 _heroId) external onlyHeroOwner(_heroId) {
        require(
            !s.registrationStarted[_heroId],
            "VRFFacet: already registering"
        );
        require(!s.registered[_heroId], "VRFFacet: already registered");
        drawRandomNumbers(_heroId);
    }

    function drawRandomNumbers(uint256 _heroId) internal {
        // Will revert if subscription is not set and funded.
        uint256 requestId = VRFCoordinatorV2Interface(s.vrfCoordinator)
            .requestRandomWords(
                s.requestConfig.keyHash,
                s.requestConfig.subId,
                s.requestConfig.requestConfirmations,
                s.requestConfig.callbackGasLimit,
                s.requestConfig.numWords
            );
        s.vrfRequestIdToHeroId[requestId] = _heroId;
        s.registrationStarted[_heroId] = true;
    }

    function rawFulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) external {
        require(
            LibMeta.msgSender() == s.vrfCoordinator,
            "Only VRFCoordinator can fulfill"
        );
        uint256 heroId = s.vrfRequestIdToHeroId[requestId];
        // run logic
        _register(heroId, randomWords);
    }

    function setConfig(RequestConfig calldata _requestConfig)
        external
        onlyOwner
    {
        s.requestConfig = RequestConfig(
            _requestConfig.subId,
            _requestConfig.callbackGasLimit,
            _requestConfig.requestConfirmations,
            _requestConfig.numWords,
            _requestConfig.keyHash
        );
    }

    function subscribe() external onlyOwner {
        address[] memory consumers = new address[](1);
        consumers[0] = address(this);
        s.requestConfig.subId = VRFCoordinatorV2Interface(s.vrfCoordinator)
            .createSubscription();
        VRFCoordinatorV2Interface(s.vrfCoordinator).addConsumer(
            s.requestConfig.subId,
            consumers[0]
        );
    }

    // Assumes this contract owns link
    function topUpSubscription(uint256 amount) external {
        LinkTokenInterface(s.linkAddress).transferAndCall(
            s.vrfCoordinator,
            amount,
            abi.encode(s.requestConfig.subId)
        );
    }

    function setVRFAddresses(address _vrfCoordinator, address _linkAddress)
        external
        onlyOwner
    {
        s.vrfCoordinator = _vrfCoordinator;
        s.linkAddress = _linkAddress;
    }

    // todo fix refactor with landId
    function _register(uint256 _heroId, uint256[] memory _randomness) internal {
        bool registered;
        uint256 _landId;
        for (uint256 i; i < 6; i++) {
            _landId = (_randomness[i] % 9999);
            if (
                IMagiaLands(s.landsAddress).getHero(_landId) == 0 &&
                IMagiaLands(s.landsAddress).getUnit(_landId) == 0
            ) {
                s.registered[_heroId] = true;
                IMagiaLands(s.landsAddress).setHero(_landId, _heroId);

                uint256 tokenId = IMagiaUnits(s.unitsAddress).totalSupply() + 1;

                IMagiaUnits(s.unitsAddress).mint(address(this), 1);
                // airdrop bowmen
                IMagiaUnits(s.unitsAddress).mint(msg.sender, 2);

                // airdrop goldmine/lumbermill/manashrine
                IMagiaBuildings(s.buildingsAddress).mint(msg.sender, 1);
                IMagiaBuildings(s.buildingsAddress).mint(msg.sender, 2);
                IMagiaBuildings(s.buildingsAddress).mint(msg.sender, 3);

                // airdrop resources
                IMagiaGold(s.goldAddress).mint(msg.sender, 1000 ether);
                IMagiaLumber(s.lumberAddress).mint(msg.sender, 1000 ether);
                IMagiaMana(s.manaAddress).mint(msg.sender, 500 ether);

                IMagiaLands(s.landsAddress).setUnit(_landId, tokenId);

                emit Register(_heroId, _landId);
                break;
            }
        }
        if (!registered) {
            s.registrationStarted[_heroId] = false;
        }
    }

    function _testRegister(uint256 _heroId, uint256 _landId) internal {
        require(
            IMagiaLands(s.landsAddress).getHero(_landId) == 0 &&
                IMagiaLands(s.landsAddress).getUnit(_landId) == 0,
            "VRFFacet: wrong landId"
        );
        s.registered[_heroId] = true;
        IMagiaLands(s.landsAddress).setHero(_landId, _heroId);

        uint256 tokenId = IMagiaUnits(s.unitsAddress).totalSupply() + 1;

        IMagiaUnits(s.unitsAddress).mint(address(this), 1);
        // airdrop bowmen
        IMagiaUnits(s.unitsAddress).mint(msg.sender, 2);

        // airdrop goldmine/lumbermill/manashrine
        IMagiaBuildings(s.buildingsAddress).mint(msg.sender, 1);
        IMagiaBuildings(s.buildingsAddress).mint(msg.sender, 2);
        IMagiaBuildings(s.buildingsAddress).mint(msg.sender, 3);

        // airdrop resources
        IMagiaGold(s.goldAddress).mint(msg.sender, 1000 ether);
        IMagiaLumber(s.lumberAddress).mint(msg.sender, 1000 ether);
        IMagiaMana(s.manaAddress).mint(msg.sender, 500 ether);

        IMagiaLands(s.landsAddress).setUnit(_landId, tokenId);

        emit Register(_heroId, _landId);
    }

    function getRegistered(uint256 _heroId) external view returns (bool) {
        return s.registered[_heroId];
    }
}
