export const txID = (): string => {
  return Math.random().toString(36).slice(2)
}
