import { ButtonPrimary } from '../ui/Button'
import axios from 'axios'
import { useAppContext } from '../../providers/AppContext'
import { ethers } from 'ethers'
import contracts from '../../contracts.json'
import { getAbi } from '../../abi'

export const TestBackEndContract = () => {
  const { store } = useAppContext()

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

  const testRun = async () => {
    // const alchemyProvider = new ethers.providers.JsonRpcProvider(
    //   'https://polygon-mumbai.g.alchemy.com/v2/ct8fPH-_vgcHsMYghjfA2F6fFpFYJvQ_'
    // )

    const contract = new ethers.Contract(
      contracts['diamond'],
      getAbi('diamond').abi,
      store.wallet.wallet
    )
    const gasPrice = await fetchGasPrice()
    // const tx = await contract.moveUnit(48, 982, 1031, 1032, gasPrice)
    const tx = await contract.moveUnit(48, 982, 1032, 1031, gasPrice)
    console.log(tx)

    // const result = await contract.claimEnergy(50)
  }

  return (
    <div>
      <ButtonPrimary
        onClick={async () => {
          // const res = await axios.post('/api/chain', {
          //   key: store.wallet.wallet?.privateKey,
          // })
          // console.log(res)
          testRun()
        }}
      >
        GO
      </ButtonPrimary>
    </div>
  )
}
