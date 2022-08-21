import { ICameraRect } from '../../components/ui/HUD'

const modX = 65
const modY = 44
const modWidth = 62
const modHeight = 48

const offsetX = 6400
const offsetY = 400

export const mapRectToMiniMap = (rect: ICameraRect) => {
  const x = (rect.x + offsetX) / modX
  const y = (rect.y + offsetY) / modY
  const width = rect.width / modWidth
  const height = rect.height / modHeight
  return { x, y, width, height }
}

export const miniMapRectToMap = (rect: ICameraRect) => {
  // includes super rough approximation where
  // we offset by half the screen w + h
  const width = rect.width * modWidth
  const height = rect.height * modHeight
  const x = rect.x * modX - offsetX - width / 2.5
  const y = rect.y * modY - offsetY - height / 2.5
  return { x, y, width, height }
}
