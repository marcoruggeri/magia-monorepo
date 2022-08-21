import 'phaser'
import { ICameraRect } from '../../components/ui/HUD'

import { pixelCoordsToGridCoords } from '../../lib/utils/pixelCoordsToGridCoords'
import {
  ActionMenu,
  ActionMenuMode,
  IActionMenuOptions,
  IClaimableResourceUpdate,
} from '../lib/ActionMenu'

let zoomLevel = 1

export default class Map extends Phaser.Scene {
  constructor() {
    super('map')
  }

  key = 'map'
  active = false
  tiles = {}
  minimap?: Phaser.Cameras.Scene2D.Camera

  preload() {
    this.load.spritesheet('tiles', 'tiles/magia-lands.png', {
      frameWidth: 128,
      frameHeight: 128,
    })
    this.load.spritesheet('units', 'tiles/magia-units.png', {
      frameWidth: 128,
      frameHeight: 128,
    })
    this.load.spritesheet('pennants', 'tiles/magia-pennants.png', {
      frameWidth: 128,
      frameHeight: 128,
    })
    this.load.spritesheet('shield', 'tiles/magia-shield.png', {
      frameWidth: 128,
      frameHeight: 128,
    })

    this.load.image('stars', 'assets/backgrounds/space.png')

    this.load.image('buttonMock', 'assets/ui/buttons/button-mock.png')
    this.load.image('buttonAttack', 'assets/ui/buttons/attack.png')
    this.load.image('buttonMove', 'assets/ui/buttons/move.png')
    this.load.image('buttonEquip', 'assets/ui/buttons/equip.png')
    this.load.svg('gpsMarker', 'assets/ui/gps-marker.svg')
    this.load.svg('menuModeFrame', 'assets/ui/menu-mode-frame.svg')
    this.load.svg('tileMarker', 'assets/ui/tile-marker-rect.svg')
    this.load.svg('gold', 'assets/icons/gold.svg')
    this.load.svg('mana', 'assets/icons/mana.svg')
    this.load.svg('lumber', 'assets/icons/lumber.svg')
    this.load.svg('place', 'assets/icons/place-icon.svg')
    this.load.svg('attack', 'assets/icons/sword.svg')
    this.load.svg('move', 'assets/icons/move.svg')
    // this.scene.remove('loading')
  }

  create() {
    this.add.tileSprite(-500, 3000, 16000, 9000, 'stars')
    // this.add.tileSprite(-1000, 1000, 8000, 4000, 'water')
    this.game.events.emit('MAP_CREATE', this)

    this.cameras.main.setSize(window.innerWidth, window.innerHeight)
    // this.cameras.main.setBounds(-4000, -1000, 7000, 4000)
    this.cameras.main.setBounds(-7500, -600, 15000, 8000)

    this.cameras.main.setZoom(0.5)
    this.cameras.main.setScroll(-1000, 50)

    this.input.on(Phaser.Input.Events.POINTER_UP, this.handleClick)

    const emitter = (event: string, args?: any) =>
      this.game.events.emit(event, args)
    this.actionMenu = new ActionMenu(this, emitter)

    var scene = this

    this.minimap = this.cameras
      .add(30, window.innerHeight - 280, 240, 240)
      .setZoom(0.02)
      .setScroll(0, 2000)
      .setName('mini')

    window.addEventListener('resize', () => {
      this.minimap?.setPosition(30, window.innerHeight - 280)
    })

    // this.add.image(0, 0, 'magia');
    this.input.on(
      'wheel',
      (
        pointer: any,
        gameObjects: any,
        deltaX: any,
        deltaY: any,
        deltaZ: any
      ) => {
        const delta = (deltaY / 500) * -1

        zoomLevel += delta
        if (zoomLevel < 0.5) {
          zoomLevel = 0.5
        }
        if (zoomLevel > 4) {
          zoomLevel = 4
        }
        scene.cameras.main.zoomTo(zoomLevel, 100)
        this.shareCameraRect()
      }
    )
    var cam = this.cameras.main
    this.input.on('pointermove', (p: any) => {
      if (!p.isDown) {
        return
      }

      cam.scrollX -= (p.x - p.prevPosition.x) / cam.zoom
      cam.scrollY -= (p.y - p.prevPosition.y) / cam.zoom
      this.shareCameraRect()
    })

    // panner
    this.game.events.on(
      'PAN_TO',
      (x: number, y: number, speed: number = 1000) => {
        cam.pan(x, y, speed)
        cam.zoomTo(2, speed)
        var intCount = 0
        const panInterval = setInterval(() => {
          this.shareCameraRect()
          intCount++
          if (intCount > 25) {
            clearInterval(panInterval)
          }
        }, 50)
      }
    )

    // actions menu
    this.game.events.on(
      'SHOW_TILE_ACTIONS',
      (opts: IActionMenuOptions) => {
        this.showActionMenu(opts)
      },
      this
    )

    this.game.events.on(
      'HIDE_TILE_ACTIONS',
      () => {
        this.hideActionMenu()
      },
      this
    )

    // update actions menu with claimable resource
    this.game.events.on(
      'UPDATE_CLAIMABLE_RESOURCE',
      (opts: IClaimableResourceUpdate) => {
        this.actionMenu?.updateClaimableResource(opts)
      },
      this
    )

    // change actions menu mode
    this.game.events.on(
      'SET_TILE_ACTIONS_MODE',
      (mode: ActionMenuMode) => {
        this.actionMenu?.setMode(mode)
      },
      this
    )

    // mini map movement
    this.game.events.on(
      'MINIMAP_MOVE',
      (rect: ICameraRect) => {
        this.cameras.main.setScroll(rect.x, rect.y)
        setTimeout(() => {
          this.shareCameraRect()
        }, 50)
      },
      this
    )
  }

  shareCameraRect = () => {
    const wv = this.cameras.main.worldView
    this.game.events.emit('CAMERA_MOVE', wv)
  }

  handleClick = (pointer: Phaser.Input.Pointer) => {
    const selectTile = (x: number, y: number) => {
      this.game.events.emit('SELECT_TILE', x, y)
    }

    const { upX, upY, downX, downY } = pointer
    const { worldX, worldY } = pointer

    // are we clicking or dragging?
    const deltaX = Math.abs(downX - upX)
    const deltaY = Math.abs(downY - upY)
    if (deltaX < 3 && deltaY < 3) {
      const [x, y] = pixelCoordsToGridCoords(worldX, worldY)
      selectTile(x, y)
    }
  }

  actionMenu?: ActionMenu

  showActionMenu(opts: IActionMenuOptions) {
    if (!this.actionMenu) {
      return
    }
    this.actionMenu.show(opts)
  }

  hideActionMenu() {
    if (!this.actionMenu) {
      return
    }
    this.actionMenu.hide()
  }

  update() {}
}
