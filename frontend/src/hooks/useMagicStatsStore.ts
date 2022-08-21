import { MagicStatsStore } from '../models/Hero'

export const useMagicStatsStore = () => {
  const store = new MagicStatsStore()

  return store
}
