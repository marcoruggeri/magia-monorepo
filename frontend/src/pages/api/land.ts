// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAbi, landsAbi } from '../../abi'
import contracts from '../../contracts.json'
import { ChainLand, IChainLand } from '../../types/chain/land'

type Data = any

let landsData: ChainLand[]
const provider = new ethers.providers.JsonRpcProvider(
  'https://optimism.gnosischain.com'
)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const lands = new ethers.Contract(contracts['lands'], landsAbi.abi, provider)
  if (!landsData) {
    const result = (await lands.getMap()) as IChainLand[]
    if (result) {
      landsData = result.map((input) => new ChainLand(input))
    }
  }
  return res.status(200).json({ landsData, success: true })
}
