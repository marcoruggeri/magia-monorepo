import { Resource } from '../../../enums'
import { PhaserButton } from './PhaserButton'

export enum ActionMenuMode {
  BUTTONS,
  ATTACK,
  MOVE,
}

export interface IActionMenuOptions {
  x: number
  y: number
  move?: boolean
  attack?: boolean
  deployUnit?: boolean
  equipBuilding?: boolean
  // a tile might have a resource but no unit to claim it
  hasClaimable?: Resource
  showClaimButon?: Resource
}

export interface IClaimableResourceUpdate {
  x: number
  y: number
  resource: Resource
  value: number
}

export class ActionMenu {
  menuContainer: Phaser.GameObjects.Container
  buttonContainer: Phaser.GameObjects.Container

  // icons
  // mapIcon: Phaser.GameObjects.Image
  modeIconsContainer: Phaser.GameObjects.Container
  modeIconFrame: Phaser.GameObjects.Image
  modeIcons: {
    [ActionMenuMode.BUTTONS]: Phaser.GameObjects.Image
    [ActionMenuMode.ATTACK]: Phaser.GameObjects.Image
    [ActionMenuMode.MOVE]: Phaser.GameObjects.Image
  }

  resourceIconFrame: Phaser.GameObjects.Image
  resourceIcons: {
    [Resource.GOLD]: Phaser.GameObjects.Image
    [Resource.MANA]: Phaser.GameObjects.Image
    [Resource.LUMBER]: Phaser.GameObjects.Image
  }

  // label
  resourceCount: Phaser.GameObjects.Text

  // used to pair updates
  x: number = 0
  y: number = 0

  visibleButtons: string[] = []
  buttons: Record<string, PhaserButton>

  constructor(
    protected scene: Phaser.Scene,
    public emitter: (event: string, args?: any) => void
  ) {
    // outer container
    this.menuContainer = scene.add.container().setDepth(10)

    // mode icons
    this.modeIconsContainer = this.scene.add.container()
    this.menuContainer.add(this.modeIconsContainer)

    this.modeIconFrame = scene.add.image(0, 0, 'menuModeFrame')
    // calculate the offset to position the frame
    const modeOffsetX = (this.modeIconFrame.width / 2) * -1
    const modeOffsetY = this.modeIconFrame.height * 1.2 * -1
    this.modeIconsContainer.setPosition(modeOffsetX, modeOffsetY)
    this.modeIconsContainer.add(this.modeIconFrame)

    // resource icons
    this.modeIcons = {
      [ActionMenuMode.BUTTONS]: this.initModeIcon('place'),
      [ActionMenuMode.ATTACK]: this.initModeIcon('attack'),
      [ActionMenuMode.MOVE]: this.initModeIcon('move'),
    }

    // resource icon frame
    this.resourceIconFrame = scene.add.image(0, 0, 'tileMarker')
    this.setResourceFrameSlim()
    this.menuContainer.add(this.resourceIconFrame)
    const resourceIconOffsetX = (this.resourceIconFrame.width / 2) * -1
    const resourceIconOffsetY = this.resourceIconFrame.height * 1.2 * -1
    this.resourceIconFrame.setPosition(resourceIconOffsetX, resourceIconOffsetY)
    this.resourceIconFrame.visible = false

    // resource icons
    this.resourceIcons = {
      [Resource.GOLD]: this.initResourceIcon('gold'),
      [Resource.MANA]: this.initResourceIcon('mana'),
      [Resource.LUMBER]: this.initResourceIcon('lumber'),
    }

    // resourceCount
    this.resourceCount = scene.add
      .text(0, 0, '')
      .setFont("600 18px 'Open Sans'")
      .setOrigin(0, 0.5)
    const textOffsetX = -32
    const textOffsetY = this.resourceIconFrame.height * 1.2 * -1
    this.resourceCount.setPosition(textOffsetX, textOffsetY)
    this.resourceCount.visible = false
    this.menuContainer.add(this.resourceCount)

    this.buttonContainer = scene.add.container()
    this.buttonContainer.setPosition(modeOffsetX, -300)
    this.menuContainer.add(this.buttonContainer)

    this.buttons = {
      deploy: new PhaserButton(scene, this, 'Deploy Unit'),
      attack: new PhaserButton(scene, this, 'Attack'),
      move: new PhaserButton(scene, this, 'Move'),
      equip: new PhaserButton(scene, this, 'Equip Building'),
      mana: new PhaserButton(scene, this, 'Claim Mana'),
      gold: new PhaserButton(scene, this, 'Claim Gold'),
      lumber: new PhaserButton(scene, this, 'Claim Lumber'),
    }

    this.hide()
  }

  initResourceIcon(resource: string) {
    const icon = this.scene.add.image(0, 0, resource)
    icon.setOrigin(0, 0.5)
    this.menuContainer.add(icon)
    // use the frame offset not the icon
    const resourceIconOffsetX = (this.resourceIconFrame.width / 2) * -1
    const resourceIconOffsetY = this.resourceIconFrame.height * 1.2 * -1
    icon.setPosition(resourceIconOffsetX, resourceIconOffsetY)
    icon.visible = false
    return icon
  }

  initModeIcon(mode: string) {
    const icon = this.scene.add.image(0, 0, mode)
    icon.setOrigin(0.5, 0.5)
    this.modeIconsContainer.add(icon)

    const { x, y } = this.modeIconFrame.getCenter()
    icon.setPosition(x, y)
    icon.setAlpha(0)
    return icon
  }

  setResourceFrameWide(width: number) {
    // width can be up to 4 characters
    // 0.79 = 1 char
    // 0.86 = 2 char
    // 0.93 = 3 char
    // 1 = 4 char
    const scale = 0.72 + width * 0.07

    const textX = -26 - 2 * length
    this.resourceCount.setX(textX)

    const iconX = -51 - 2 * length
    // this.resourceIconFrame.setOrigin(0.33, 0.5)
    this.resourceIconFrame.setScale(scale, 1)
    Object.values(this.resourceIcons).forEach((i) =>
      i.setPosition(iconX, this.resourceIconFrame.height * 1.2 * -1)
    )
  }

  setResourceFrameSlim() {
    if (this.resourceIcons) {
      Object.values(this.resourceIcons).forEach((i) =>
        i.setPosition(
          (this.resourceIconFrame.width / 2) * -1,
          this.resourceIconFrame.height * 1.2 * -1
        )
      )
    }
    this.resourceIconFrame.setOrigin(0.33, 0.5)
    this.resourceIconFrame.setScale(0.66, 1)
  }

  updateClaimableResource(opts: IClaimableResourceUpdate) {
    console.log('got update', opts)

    // is this update for the tile we're displaying on?
    if (opts.x !== this.x || opts.y !== this.y || opts.value === undefined) {
      return
    }
    const label = opts.value.toString()
    this.setResourceFrameWide(label.length)
    this.resourceCount.text = label
    this.resourceCount.visible = true

    // min val required for a claim
    if (opts.value < 50) {
      // hide a claim button if we had one
      this.visibleButtons = [
        ...this.visibleButtons.filter(
          (b) => b != 'gold' && b != 'mana' && b != 'lumber'
        ),
      ]
    } else {
      if (opts.resource === Resource.GOLD) {
        this.visibleButtons.push('gold')
      }
      if (opts.resource === Resource.MANA) {
        this.visibleButtons.push('mana')
      }
      if (opts.resource === Resource.LUMBER) {
        this.visibleButtons.push('lumber')
      }
    }

    this.drawButtons()
  }

  hideResourceIndicator() {
    Object.values(this.resourceIcons).forEach((i) => (i.visible = false))
    this.resourceIconFrame.visible = false
    this.resourceCount.text = ''
    this.resourceCount.visible = false
    this.setResourceFrameSlim()
    this.modeIconFrame.visible = true
  }

  hideModeIcons() {
    Object.values(this.modeIcons).forEach((i) => i.setAlpha(0))
    this.modeIconsContainer.visible = false
  }

  showModeIcon(mode: ActionMenuMode) {
    if (mode === ActionMenuMode.BUTTONS) {
      this.setModeHeightUp()
    } else {
      this.setModeHeightDown()
    }

    this.modeIconsContainer.visible = true
    // this.scene.tweens.add({
    //   targets: this.modeIcons[mode],
    //   alpha: 1,
    //   duration: 500,
    // })
    this.modeIcons[mode].setAlpha(1)
  }

  setModeHeightUp() {
    const modeOffsetY = this.modeIconFrame.height * 1.2 * -1
    this.modeIconsContainer.setY(modeOffsetY)
    this.modeIconsContainer.setScale(1, 1)
  }
  setModeHeightDown() {
    const modeOffsetY = this.modeIconFrame.height * 1.2 * -1
    this.modeIconsContainer.setY(modeOffsetY + 50)
    this.modeIconsContainer.setScale(0.66, 0.66)
  }

  showResourceIndicator(resource: Resource) {
    this.modeIconFrame.visible = false
    this.resourceIconFrame.visible = true
    this.resourceIcons[resource].visible = true
  }

  hideButtons() {
    Object.values(this.buttons).forEach((btn) => btn.hide())
  }

  show(opts: IActionMenuOptions) {
    this.hide()
    this.hideResourceIndicator()
    this.menuContainer.setPosition(opts.x, opts.y)
    this.menuContainer.visible = true

    this.visibleButtons = []
    if (opts.attack) {
      this.visibleButtons.push('attack')
    }
    if (opts.move) {
      this.visibleButtons.push('move')
    }
    if (opts.equipBuilding) {
      this.visibleButtons.push('equip')
    }

    // -------- can we claim?
    // if (opts.showClaimButon === Resource.GOLD) {
    //   this.visibleButtons.push('gold')
    // }
    // if (opts.showClaimButon === Resource.MANA) {
    //   this.visibleButtons.push('mana')
    // }
    // if (opts.showClaimButon === Resource.LUMBER) {
    //   this.visibleButtons.push('lumber')
    // }

    // -------- show amount to claim?
    if (opts.hasClaimable === Resource.GOLD) {
      this.showResourceIndicator(Resource.GOLD)
    }
    if (opts.hasClaimable === Resource.MANA) {
      this.showResourceIndicator(Resource.MANA)
    }
    if (opts.hasClaimable === Resource.LUMBER) {
      this.showResourceIndicator(Resource.LUMBER)
    }

    this.x = opts.x
    this.y = opts.y

    // deploy disabled for now
    // if (opts.deployUnit) {
    //   buttonsToShow.push('deploy')
    // }

    this.drawButtons()

    this.setMode(ActionMenuMode.BUTTONS)
  }

  drawButtons() {
    this.hideButtons()

    // adjust the container height to fit just the number of buttons that we need
    const buttonContainerOffsetY = this.visibleButtons.length * -58 - 64
    this.buttonContainer.setPosition(
      this.buttonContainer.x,
      buttonContainerOffsetY
    )

    this.visibleButtons.forEach((label, idx) => {
      const btn = this.buttons[label]
      btn?.show(idx)
    })
  }

  hide() {
    this.menuContainer.visible = false
    this.hideButtons()
  }

  setMode(mode: ActionMenuMode) {
    this.hideModeIcons()
    this.showModeIcon(mode)

    switch (mode) {
      case ActionMenuMode.ATTACK:
      case ActionMenuMode.MOVE:
        this.hideButtons()
        this.hideResourceIndicator()
        break

      default:
        break
    }
  }
}
