import { BigNumberish, ethers } from 'ethers'

export const unwrap = {
  bigNumber: (val: BigNumberish) => parseInt(ethers.utils.formatUnits(val, 0)),
}
