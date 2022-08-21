// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAbi } from '../../abi'
import contracts from '../../contracts.json'
import { AbiItem } from 'web3-utils'

type Data = any

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { key } = req.body

  // return res.status(200).json({ req:  })
  const alchemyProvider = new ethers.providers.JsonRpcProvider(
    'https://polygon-mumbai.g.alchemy.com/v2/ct8fPH-_vgcHsMYghjfA2F6fFpFYJvQ_'
  )

  const mtcTodayProvider = new ethers.providers.JsonRpcProvider(
    'https://rpc-mumbai.matic.today/'
  )

  const infuraProvider = new ethers.providers.InfuraProvider('maticmum', {
    projectId: 'aed74f58106b4804a15c54323608d888',
    projectSecret: 'ccfd493cfdd942cc97411492b5de2533',
  })

  // const web3 = new Web3(
  //   new Web3.providers.HttpProvider(
  //     `https://polygon-mumbai.infura.io/v3/aed74f58106b4804a15c54323608d888`
  //   )
  // )
  // Creating a signing account from a private key
  // const signer = web3.eth.accounts.privateKeyToAccount(key)
  // web3.eth.accounts.wallet.add(signer)

  // console.log({ address: signer.address })
  // console.log({ key, address: signer.address })

  // const contract = new web3.eth.Contract(
  //   getAbi('heroes').abi as AbiItem[],
  //   // Replace this with the address of your deployed contract
  //   // contracts['heroes']
  //   '0x13B2aebF81A966f58160c4E1cFEc02ae46d16c6A'
  // )

  // const tx = contract.methods.claimEnergy(50)
  // const receipt = await tx
  //   .send({
  //     from: signer.address,
  //     gas: await tx.estimateGas(),
  //   })
  //   .once('transactionHash', (txhash: any) => {
  //     console.log(`Mining transaction ...`)
  //     console.log(`${txhash}`)
  //   })
  // The transaction is now on chain!
  // console.log(`Mined in block ${receipt.blockNumber}`)
  const wallet = new ethers.Wallet(key as string, infuraProvider)
  // const wallet = new ethers.Wallet(key as string, infuraProvider)

  const contract = new ethers.Contract(
    contracts['diamond'],
    getAbi('diamond').abi,
    wallet
  )

  // const gasPrice = await fetchGasPrice()

  // const result = await contract.claimEnergy(50, gasPrice)
  // const result = await contract.claimEnergy(50)
  // const result = await tx.wait()

  const realmDiamond = '0xFf797B21E102997BD2d67e558eF95cbF3f124b9F'
  const pk =
    '0x063c9006cf21949321030156e418e0cf05d8cb94935674d3d61d748cf4008842'
  // const wallet = new ethers.Wallet(pk, alchemyProvider)
  // const wallet = new ethers.Wallet(pk, infuraProvider)

  // const contract = new ethers.Contract(realmDiamond, abi, wallet)

  const fetchGasPrice = async () => {
    const res = await fetch('https://gasstation-mumbai.matic.today/v2')
    const data = await res.json()

    return {
      gasPrice: ethers.utils.parseUnits(
        (parseInt(data.fast.maxFee) + 50).toString(),
        'gwei'
      ),
    }
  }

  // const moveUnit = async () => {
  const gasPrice = await fetchGasPrice()
  // const tx = await contract.moveUnit(48, 982, 1031, 1032, gasPrice)
  const tx = await contract.moveUnit(48, 982, 1032, 1031, gasPrice)
  // console.log(tx)
  // await tx.wait()
  // }

  // moveUnit()

  // return res.status(200).json({ receipt, tx })
  return res.status(200).json({ tx, gasPrice, address: wallet.address })
}
