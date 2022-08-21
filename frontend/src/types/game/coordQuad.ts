export interface CoordQuad {
  // grid x,y are standard coords like [1,2] [3,7]
  gridX: number
  gridY: number

  // pixel x,y are translated pixel positions for our isometric grid
  pixelX: number
  pixelY: number
}
