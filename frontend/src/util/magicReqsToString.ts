import { MAGIC_ORDER } from '../lib/constants'
import { unwrap } from './unwrap'

export const parseMagicReqs = (reqs: number[]) => {
  return MAGIC_ORDER.map((m, idx) => ({ type: m, req: reqs[idx] }))
}

export const magicReqsToString = (reqs: number[]) => {
  const idx = MAGIC_ORDER.findIndex((m, idx) => unwrap.bigNumber(reqs[idx]) > 0)
  return `${MAGIC_ORDER[idx]} ${unwrap.bigNumber(reqs[idx])}`
}
