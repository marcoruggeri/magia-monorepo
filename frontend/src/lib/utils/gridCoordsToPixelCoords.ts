import {
  ISO_ROW_HEIGHT,
  ISO_X_OFFSET,
  ISO_Y_OFFSET,
  TILE_HEIGHT,
  TILE_WIDTH,
} from '../constants'

// translates an x,y (e.g. [1,4]) to pixels (e.g. [128, 384])
export const gridCoordsToPixelCoords = (x: number, y: number) => {
  const origin2dX = x * TILE_WIDTH
  const origin2dY = y * TILE_HEIGHT

  const originIsoX = origin2dX / 2 + y * -1 * ISO_ROW_HEIGHT + ISO_X_OFFSET
  const originIsoY = origin2dY / 4 + (x / 2) * ISO_ROW_HEIGHT + ISO_Y_OFFSET

  return [originIsoX, originIsoY]
}
