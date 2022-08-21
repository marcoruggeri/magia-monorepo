export const enumLabels = (obj: any): string[] => {
  return Object.values(obj).filter((l) => typeof l === 'string') as string[]
}
