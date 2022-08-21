import { ActionMenu } from './ActionMenu'

export class PhaserButton {
  // this button's own container
  wrapper: Phaser.GameObjects.Container
  background: Phaser.GameObjects.Image
  text?: Phaser.GameObjects.Text
  event: string

  constructor(
    private scene: Phaser.Scene,
    public menu: ActionMenu,
    public label: string
  ) {
    this.wrapper = scene.add.container().setPosition(0, 0)
    this.event = label.toUpperCase().replace(' ', '_')
    this.background = scene.add
      .image(0, 0, 'buttonMock')
      .setOrigin(0.5, 0.5)
      .setInteractive({ cursor: 'pointer' })

    const customButtons = ['Attack', 'Move', 'Equip Building']
    if (customButtons.includes(label)) {
      // maybe use a custom image for the button
      switch (label) {
        case 'Attack':
          this.background.setTexture('buttonAttack')
          break
        case 'Move':
          this.background.setTexture('buttonMove')
          break
        case 'Equip Building':
          this.background.setTexture('buttonEquip')
          break

        default:
          break
      }
    } else {
      this.background.on(Phaser.Input.Events.POINTER_OVER, () => {
        this.background.flipY = true
      })
      this.background.on(Phaser.Input.Events.POINTER_OUT, () => {
        this.background.flipY = false
      })
      this.text = scene.add.text(0, 0, label).setDepth(2).setOrigin(0.5, 0.5)
    }
    this.background.on(
      Phaser.Input.Events.POINTER_UP,
      (_: any, __: any, ___: any, event: Phaser.Types.Input.EventData) => {
        event.stopPropagation()

        this.menu.emitter('BUTTON_PRESS', { action: this.event })
      }
    )
    this.wrapper.add(this.background)
    if (this.text) {
      this.wrapper.add(this.text)
    }
    this.menu.buttonContainer.add(this.wrapper)
  }

  show(idx: number) {
    this.wrapper.setPosition(0, idx * 48 + idx * 5)

    this.wrapper.visible = true
  }
  hide() {
    this.wrapper.visible = false
  }
}
