export const pixelCoordsToGridCoords = (x: number, y: number) => {
  const decimalX = (x + 2 * y - 32) / 128
  const decimalY = (x - 2 * y - 32) / -128

  return [roundToWholeNumber(decimalX), Math.floor(decimalY)]
}

const roundToWholeNumber = (n: number) => {
  const remainder = n - Math.floor(n)
  return remainder < 0.5 ? Math.floor(n) : Math.ceil(n)
}
