const { ethers } = require('ethers')
const landAbi = require('../src/abi/MagiaLands.json')
const util = require('util')
const contracts = require('../src/contracts.json')

const provider = new ethers.providers.JsonRpcProvider(
  'https://polygon-mumbai.g.alchemy.com/v2/SeyWmSZubocxNcqaWaiR--xe00RiT1ig'
)

const lands = new ethers.Contract(contracts.lands, landAbi.abi, provider)

const getMap = async () => {
  const mapData = await lands.getMap()
  const mapObjects = mapData.map((o) => ({ ...o }))
  console.log(JSON.stringify(mapObjects))
}

const main = () => {
  getMap()
}

main()
