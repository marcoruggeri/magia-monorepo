// the original 2d grid dimensions
export const TILE_WIDTH = 128
export const TILE_HEIGHT = 128

// iso rows overlap by 1/2 a tile
export const ISO_COL_WIDTH = TILE_WIDTH
export const ISO_ROW_HEIGHT = TILE_HEIGHT / 2

export const ISO_X_OFFSET = ISO_COL_WIDTH / 4
export const ISO_Y_OFFSET = 0

// the order of magic when given as an array of numbers
export const MAGIC_ORDER = ['white', 'black', 'fire', 'water', 'earth']

export const WHITELIST_ENABLED = true
// export const WHITELIST_ENABLED = false
