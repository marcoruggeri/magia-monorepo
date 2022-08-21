import { Coord } from '../../magiaTypes'

const tileWidth = 128
const tileHeight = 128

const isoWidth = tileWidth / 2
const isoHeight = tileHeight / 2

const isoXOffset = isoWidth / 2 // correct to align tiles
const isoYOffset = 0 // correct to align tiles

const coordMap: Record<string, Coord> = {}
const tileMap: Record<string, Phaser.GameObjects.Image> = {}

// coords are always {
//   x: (n / 64) + 32
//   y: (n / 32) + 160
// }
export const logCoordMap = () => {
  console.log(coordMap)
}

// stores a tile by its coords
export const stashTile = (coords: Coord, tile: Phaser.GameObjects.Image) => {
  tileMap[JSON.stringify(coords)] = tile
}

// fetches a tile from the stash
export const getTile = (coords: Coord) => {
  return tileMap[JSON.stringify(coords)]
}

// takes an iso coord and attempts to lookup the 2d coords
export const findCoords = ({ x, y }: Coord) => {
  // e.g. 55 should be 32
  //

  return IsoToG2d({ x, y })

  const modX = x % 32
  const roundedX = x - modX
  // const keyX = roundedX + 32;

  const modY = y % 64
  const roundedY = y - modY

  const lookup = { x: roundedX + 32, y: roundedY }
  const res = coordMap[JSON.stringify(lookup)]
  if (res) {
    return res
    // console.log({ lookup, res });
  } else {
    const lookup2 = { x: roundedX - 32, y: roundedY }
    const res2 = coordMap[JSON.stringify(lookup2)]
    // console.log({ lookup2, res2 });
    if (res2) {
      return res2
    }
  }

  return false
}

// converst 2d coords into worldCoords in an iso layout
export const g2dToIso = ({ x, y }: Coord) => {
  const origin2dX = x * tileWidth
  const origin2dY = y * tileHeight
  const originIsoX = origin2dX / 2 + y * -1 * isoHeight + isoXOffset
  const originIsoY = origin2dY / 4 + (x / 2) * isoHeight + isoYOffset

  // just log a section for performance
  // if (x > 1 && x < 5 && y > 2 && y < 4) {
  //   console.log('draw', { x: originIsoX, y: originIsoY });
  // }

  const iso = { x: originIsoX, y: originIsoY }

  coordMap[JSON.stringify(iso)] = { x, y }

  return iso
}

export const IsoToG2d = ({ x: originIsoX, y: originIsoY }: Coord) => {
  // const origin2dY = y * tileHeight;
  // const originIsoX = origin2dX / 2 + y * -1 * isoHeight + isoXOffset;
  // const originIsoX - isoXOffset = origin2dX / 2 + y * -1 * isoHeight ;
  // const (originIsoX - isoXOffset) / isoHeight = origin2dX / 2 + y * -1;
  // const ((originIsoX - isoXOffset) / isoHeight) / -1 = origin2dX / 2 + y;
  // const (((originIsoX - isoXOffset) / isoHeight) / -1) * 1/origin2dX = (origin2dX / 2 + y) * 1/origin2dX;
  // const y = 0;
  // const originIsoY = origin2dY / 4 + (x / 2) * isoHeight + isoYOffset;
  // const originIsoY - isoYOffset = origin2dY / 4 + (x / 2) * isoHeight ;
  // const (originIsoY - isoYOffset) / isoHeight = origin2dY / 4 + (x / 2);
  // const ((originIsoY - isoYOffset) / isoHeight) * 1/ origin2dY = origin2dY / 4 + (x / 2) * 1/origin2dY;
  // think this went wrong removing the 1/origin2dY
  // const ((originIsoY - isoYOffset) / isoHeight) / origin2dY =   4 + (x / 2) ;
  // const (((originIsoY - isoYOffset) / isoHeight) / origin2dY) - 4 =   (x / 2) ;
  // const ((((originIsoY - isoYOffset) / isoHeight) / origin2dY) - 4)*2 =   x ;
  // const ((((originIsoY - isoYOffset) / isoHeight) / y * tileHeight) - 4)*2 =   x ;
  // const x = ((originIsoY - isoYOffset) / isoHeight / origin2dY - 4) * 2;
  // gave up on this for now and decided to store vals in a hash instead

  const decimalX = (originIsoX + 2 * originIsoY - 32) / 128
  const decimalY = (originIsoX - 2 * originIsoY - 32) / -128

  // round to nearest
  const x = roundToWholeNumber(decimalX)
  const y = Math.floor(decimalY)

  return { x, y }
}

const roundToWholeNumber = (n: number) => {
  const remainder = n - Math.floor(n)
  console.log({ n, remainder })

  return remainder < 0.5 ? Math.floor(n) : Math.ceil(n)
}

export const drawGridLines = (scene: Phaser.Scene, x: number, y: number) => {
  const origin2dX = x * tileWidth
  const origin2dY = y * tileHeight

  // 2d rows
  scene.add.line(
    origin2dX, // move the origin along x by 1 tilewidth each col
    y * tileHeight, // move the origin down by 1 tileheight each row
    0,
    0,
    tileWidth, // draw along the top edge of a tile, 1 tile width
    0, // stay level, don't draw down the page
    0xffffff
  )

  // 2d cols
  scene.add.line(
    origin2dX, // move the origin along x by 1 tilewidth each col
    y * tileHeight, // move the origin down by 1 tileheight each row
    0,
    0,
    0, // stay vertical, don't descend at an angle
    tileHeight, // tracing the left edge of a tile for 1 tile height
    0xffffff
  )

  // const originIsoX = origin2dX / 2 + y * -1 * isoHeight + isoXOffset;
  // const originIsoY = origin2dY / 4 + (x / 2) * isoHeight + isoYOffset;

  const { x: originIsoX, y: originIsoY } = g2dToIso({ x, y })

  // const { x: rX, y: rY } = IsoToG2d({ x: originIsoX, y: originIsoY });

  // if (x > 3 && x < 10 && y > 2 && y < 5) {
  //   console.log('compare', { x, y, originIsoX, originIsoY, rX, rY });
  // }

  // iso rows
  scene.add.line(
    originIsoX,
    originIsoY,
    // y * isoHeight * -1 + x * isoWidth,
    // y * isoHeight,
    0,
    0,
    isoWidth,
    0.5 * isoHeight,
    0x000000
  ).depth = 1

  // iso cols
  scene.add.line(
    originIsoX,
    originIsoY,
    // y * isoHeight * -1 + x * isoWidth,
    // y * isoHeight,

    0,
    0,
    -1 * isoWidth,
    0.5 * isoHeight,
    0x000000
  ).depth = 1

  // if (x == 2 && y == 3) {
  //   highlightTile(scene, x, y);
  // }
}

// TODO: collect the drawer into a class
// wrap the tile in an object that contains its scene as well for easy access

export const highlightTile = (scene: Phaser.Scene, x: number, y: number) => {
  const { x: originIsoX, y: originIsoY } = g2dToIso({ x, y })

  const lines = []

  const tr = scene.add.line(
    originIsoX,
    originIsoY,
    0,
    0,
    isoWidth,
    0.5 * isoHeight,
    0xff0000
  )
  tr.depth = 2
  lines.push(tr)

  const tl = scene.add.line(
    originIsoX,
    originIsoY,
    // y * isoHeight * -1 + x * isoWidth,
    // y * isoHeight,
    0,
    0,
    -1 * isoWidth,
    0.5 * isoHeight,
    0xff0000
  )
  tl.depth = 1
  lines.push(tl)

  const bl = scene.add.line(
    originIsoX,
    originIsoY,
    -1 * isoWidth,
    0.5 * isoHeight,
    0,
    isoHeight,
    0xff0000
  )
  bl.depth = 2
  lines.push(bl)

  const br = scene.add.line(
    originIsoX,
    originIsoY,

    isoWidth,
    0.5 * isoHeight,
    0,
    isoHeight,
    0xff0000
  )
  br.depth = 2
  lines.push(br)

  const poly = scene.add.polygon(
    originIsoX + isoWidth * 0.5,
    originIsoY + 0.25 * isoHeight,
    [
      0,
      0,
      isoWidth,
      0.5 * isoHeight,
      0,
      isoHeight,
      -1 * isoWidth,
      0.5 * isoHeight,
    ],
    0xffffff
  )

  return lines
}
