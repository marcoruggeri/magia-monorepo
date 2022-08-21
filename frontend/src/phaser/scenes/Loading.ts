import 'phaser'

export default class Loading extends Phaser.Scene {
  constructor() {
    super('loading')
  }

  preload() {}

  create() {
    this.add.text(100, 100, 'loading game assets...')
  }

  update() {}
}
