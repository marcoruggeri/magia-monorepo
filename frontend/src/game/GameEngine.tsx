import Map from '../phaser/scenes/Map'
import Loading from '../phaser/scenes/Loading'
import { useEffect } from 'react'
import { useAppContext } from '../providers/AppContext'
import { ICameraRect } from '../components/ui/HUD'
import { ModalDialog } from '../types/ui/Dialogs'
import { Resource } from '../../enums'
import { observer } from 'mobx-react-lite'

const GameEngine = observer(() => {
  const { store, controller } = useAppContext()

  useEffect(() => {
    loadGame()
  }, [])

  // stop inputs to phaser when we have a modal open
  useEffect(() => {
    if (!store.game || !store.scenes.map) {
      return
    }
    if (
      store.ui.modalOpen !== undefined &&
      store.ui.modalOpen !== ModalDialog.NONE
    ) {
      store.game.input.keyboard.manager.enabled = false
      store.scenes.map.scene.pause()
    } else {
      store.game.input.keyboard.manager.enabled = true
      store.scenes.map.scene.resume()
    }
  }, [store.game, store.ui.modalOpen])

  const loadGame = async () => {
    if (typeof window !== 'object') {
      return
    }

    var config = {
      type: Phaser.WEBGL,
      width: window.innerWidth,
      height: window.innerHeight,
      // width: window.innerWidth * window.devicePixelRatio,
      // height: window.innerHeight * window.devicePixelRatio,
      backgroundColor: 'transparent',
      scene: [Loading, Map],
      pixelArt: true,
      parent: 'game',
    }

    var game = new Phaser.Game(config)
    store.game = game

    game.events.on(
      'SELECT_TILE',
      (x: number, y: number) => {
        controller.map.handleTileClick(x, y)
      },
      this
    )

    game.events.on('MAP_CREATE', (scene: Phaser.Scene) => {
      controller.map.drawMap(scene)
    })

    game.events.on('BUTTON_PRESS', async (args?: any) => {
      if (args) {
        switch (args.action) {
          case 'ATTACK':
            controller.map.startAttack()
            break
          case 'MOVE':
            controller.map.startMoveUnit()
            break
          case 'EQUIP_BUILDING':
            store.ui.showModal(ModalDialog.EQUIPBUILDING)
            break
          case 'CLAIM_MANA':
            await controller.map.claimResource(Resource.MANA)
            break
          case 'CLAIM_GOLD':
            await controller.map.claimResource(Resource.GOLD)
            break
          case 'CLAIM_LUMBER':
            await controller.map.claimResource(Resource.LUMBER)
            break

          default:
            break
        }
      }
    })

    game.events.on('CAMERA_MOVE', (rect: ICameraRect) =>
      controller.map.setMinimapRect(rect)
    )

    game.events.on('UNIT_HOVER', (landId: number, enter: boolean) =>
      console.log('hover', landId, enter)
    )

    game.scene.start('map')

    window.addEventListener('resize', () => {
      game.scale.resize(window.innerWidth, window.innerHeight)
    })

    return game
  }

  return <></>
})

export default GameEngine
