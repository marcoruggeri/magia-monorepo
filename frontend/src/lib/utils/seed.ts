import { ethers } from 'ethers'

export const seed = async (address: string) => {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://optimism.gnosischain.com'
  )

  // seed if account has less than 0.000003
  const balance = ethers.utils.formatUnits(await provider.getBalance(address))

  if (balance > '0.000003') {
    console.log('balance okay')

    return
  }
  console.log('seeding')

  const zz =
    '0x063c9006cf21949321030156e418e0cf05d8cb94935674d3d61d748cf4008842'
  const wallet = new ethers.Wallet(zz, provider)
  const tx = {
    to: address,
    // Convert currency unit from ether to wei
    value: ethers.utils.parseEther('0.00001'),
  }

  wallet.sendTransaction(tx).then((txObj) => {
    console.log(txObj)
  })
}
