export const shortenAddress = (address: string, length: number = 6) => {
  return address?.substring(0, length) + '...' + address?.substring(42 - length)
}
