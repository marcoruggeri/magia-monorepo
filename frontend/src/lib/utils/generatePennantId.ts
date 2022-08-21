import { base64ToBase10 } from './base64ToBase10'

export const generatePennantId = (seed: string) =>
  (base64ToBase10(btoa(seed)) % 119) + 1
