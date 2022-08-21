import { action, computed, makeObservable, observable } from 'mobx'
import { AppAPI } from '../api'
import { ICameraRect } from '../components/ui/HUD'
import { Tile } from '../models/Tile'
import { AppStore } from '../stores/app'
import { ChainLand, IChainLand } from '../types/chain/land'
import { HUDState } from '../types/ui/HUDState'
import { AppController } from './app'
import { mapRectToMiniMap } from '../lib/utils/mapRectToMiniMap'
import { ActionMenuMode, IActionMenuOptions } from '../phaser/lib/ActionMenu'
import { Resource } from '../../enums'
import { unwrap } from '../util/unwrap'

export class MapController {
  constructor(
    private controller: AppController,
    private store: AppStore,
    private api: AppAPI
  ) {
    makeObservable(this)
  }

  drawMap = async (scene: Phaser.Scene) => {
    this.store.scenes.map = scene

    // remove the loading scene
    this.store.game?.scene.remove('loading')
  }

  handleTileClick(x: number, y: number) {
    switch (this.store.ui.HUDState) {
      case HUDState.MOVE_UNIT:
        this.moveToTile(x, y)
        break

      case HUDState.ATTACK:
        this.attack(x, y)
        break

      case HUDState.DEPLOY_UNIT:
        this.deployUnit(x, y)
        break

      case HUDState.CAST_ATTACK:
        this.controller.magic.castAttack(x, y)
        break

      case HUDState.CAST_TELEPORT_FROM:
        this.controller.magic.castTeleportFrom(x, y)
        break

      case HUDState.CAST_TELEPORT_TO:
        this.controller.magic.castTeleportTo(x, y)
        break
      case HUDState.CAST_PYROBLAST_START:
        this.controller.magic.confirmCastPyroblast(x, y)
        break

      case HUDState.CAST_SUMMON:
        this.controller.magic.castSummon(x, y)
        break

      case HUDState.CAST_CONVERT:
        this.controller.magic.castConvert(x, y)
        break

      case HUDState.PICK_UNITS_TO_SHIELD:
        this.addToShield(x, y)
        break

      case HUDState.MAP:
      default:
        this.selectTile(x, y)
    }
  }

  selectTile(x: number, y: number) {
    const { land, ui } = this.store

    const tile = land.getTile(x, y)
    // was this tile already selected?
    if (tile && land.selected === tile) {
      // yes -- deselect it
      tile.toggleSelection()
      land.clearSelection()
      this.hideTileActions()
    } else if (tile) {
      // no -- select it

      if (land.selected) {
        // maybe deselect an old selection
        land.selected.deselect()
      }
      land.setSelected(tile)
      this.showPhaserTileActions(tile)
      ui.showSelectedLandInfo()
      tile.toggleSelection()
    }
  }

  @action
  maybeReselectTile() {
    const originalTile = this.store.land.stashed
    if (originalTile) {
      this.reselectTile(originalTile.coords.gridX, originalTile?.coords.gridY)
    }
  }

  reselectTile(x: number, y: number) {
    const { land, ui } = this.store

    const tile = land.getTile(x, y)
    if (tile) {
      land.setSelected(tile)
      this.showPhaserTileActions(tile)
      ui.showSelectedLandInfo()
      tile.select()
    }
  }

  @action clearSelectedTile = this.store.land.clearSelection

  panToTile = (tile: Tile, speed: number = 1000) => {
    this.store.game?.events.emit(
      'PAN_TO',
      tile.coords.pixelX,
      tile.coords.pixelY,
      speed
    )

    setTimeout(() => {
      this.selectTile(tile.coords.gridX, tile.coords.gridY)
    }, speed * 0.75)
  }

  // check for claimable resources
  // -- only on own tiles for now
  // -- might do debug = all tiles
  refreshTileClaimable = async (tile: Tile) => {
    const { diamond } = this.store.contract

    // ----------- Gold
    if (tile.hasOwnGoldmine) {
      const { res } = await diamond.getClaimableGold(tile.landId)
      if (!isNaN(res)) {
        this.updatePhaserTileResource(
          tile,
          Resource.GOLD,
          unwrap.bigNumber(res)
        )
      }

      // ----------- Lumber
    } else if (tile.hasOwnLumbermill) {
      const { res } = await diamond.getClaimableLumber(tile.landId)
      if (!isNaN(res)) {
        this.updatePhaserTileResource(
          tile,
          Resource.LUMBER,
          unwrap.bigNumber(res)
        )
      }

      // ----------- Mana
    } else if (tile.hasOwnManaShrine) {
      const { res } = await diamond.getClaimableMana(tile.landId)
      if (!isNaN(res)) {
        this.updatePhaserTileResource(
          tile,
          Resource.MANA,
          unwrap.bigNumber(res)
        )
      }
    }
  }

  // send a claimable resource value to phaser to show in an action menu
  updatePhaserTileResource = (
    tile: Tile,
    resource: Resource,
    value: number
  ) => {
    this.store.game?.events.emit('UPDATE_CLAIMABLE_RESOURCE', {
      x: tile.coords.pixelX,
      y: tile.coords.pixelY,
      resource,
      value,
    })
  }

  claimResource = async (resource: Resource) => {
    // remember our tile
    const reselectLand = this.store.land.stashSelected()
    // make the claim
    await this.api.resource.claim(resource)
    // refresh the tile if we're still viewing it
    if (reselectLand()) {
      await this.refreshTileClaimable(this.store.land.stashed!)
    }
  }

  showPhaserTileActions = (tile: Tile) => {
    // start the process to fetch claimable data
    this.refreshTileClaimable(tile)

    const opts: IActionMenuOptions = {
      x: tile.coords.pixelX,
      y: tile.coords.pixelY,
    }

    // equip building
    if (!tile.hasBuilding && tile.hasOwnUnit) {
      opts.equipBuilding = true
    }

    // move and attack
    if (tile.hasOwnUnit) {
      opts.move = true
      opts.attack = true
    }

    // resources
    // we are fetching the claimable amount, these flags are just precursors
    if (tile.hasOwnGoldmine) {
      opts.hasClaimable = Resource.GOLD
    }
    if (tile.hasOwnManaShrine) {
      opts.hasClaimable = Resource.MANA
    }
    if (tile.hasOwnLumbermill) {
      opts.hasClaimable = Resource.LUMBER
    }
    if (tile.canClaimGold) {
      opts.showClaimButon = Resource.GOLD
    }
    if (tile.canClaimMana) {
      opts.showClaimButon = Resource.MANA
    }
    if (tile.canClaimLumber) {
      opts.showClaimButon = Resource.LUMBER
    }

    // deploy unit
    const deployable = this.store.land.deployableLand.some(
      (t) => t.landId === tile.landId
    )
    if (deployable) {
      opts.deployUnit = true
    }

    this.store.game?.events.emit('SHOW_TILE_ACTIONS', opts)
  }

  hideTileActions = () => {
    this.store.game?.events.emit('HIDE_TILE_ACTIONS')
  }

  panToLandId = (id: number) => {
    const tile = this.store.land.getLandById(id)
    if (!tile) {
      return
    }
    this.panToTile(tile)
  }

  @action panToNextOwnLand = () => {
    const tile = this.store.land.nextOwnLand
    if (tile) {
      this.panToTile(tile, 400)
    }
  }
  @action panToPrevOwnLand = () => {
    const tile = this.store.land.prevOwnLand
    if (tile) {
      this.panToTile(tile, 400)
    }
  }
  // -----------------------------------

  @action startDeployUnit = () => {
    this.store.ui.setHUDState(HUDState.DEPLOY_UNIT)
    const adjacent = this.store.land.deployableLand
    adjacent.forEach((t) => t.select())
  }

  @action deployUnit = async (x: number, y: number) => {
    this.store.ui.setHUDState(HUDState.MAP)

    const adjacent = this.store.land.deployableLand
    // deselect all expect whatever was previously selected
    adjacent.forEach((t) => {
      if (t !== this.store.land.selected) {
        t.deselect()
      }
    })

    // did we click inside the adjacents?
    const targetLand = adjacent.find(
      (t) => t.coords.gridX == x && t.coords.gridY == y
    )

    if (!targetLand || !this.store.ui.deployableUnitId) {
      return
    }

    const { contract } = this.store

    // are we approved?
    if (!(await contract.approve('units'))) {
      return
    }

    // find an adjacent tile we can send as the occupied land
    const occupiedLand = this.store.land
      .getAdjacentTiles(targetLand!)
      .find((t) => t.isOwnTile)

    if (!occupiedLand) {
      // this should never happen but it means we managed to pick a tile that wasn't next to one that we own
      return
    }
    await this.api.unit.deployUnit(
      this.store.ui.deployableUnitId,
      targetLand!.landId,
      occupiedLand.landId
    )
    await this.api.inventory.getUnits()
    await this.api.hero.getEnergy()
  }
  // -----------------------------------
  @action startShieldUnits = () => {
    this.clearSelectedTile()
    this.store.ui.setHUDState(HUDState.PICK_UNITS_TO_SHIELD)
    const valid = this.store.land.ownUnits
    valid.forEach((t) => t.select())
  }

  @action addToShield(x: number, y: number) {
    const land = this.store.land.getTile(x, y)
    if (!land || !land.unit || !land.isOwnTile) {
      return
    }
    this.store.ui.toggleUnitToShild(land.unit)
  }

  @action cancelShieldUnits = () => {
    this.store.ui.clearUnitsToShield()
    const valid = this.store.land.ownUnits
    valid.forEach((t) => t.deselect())
    this.store.ui.setHUDState(HUDState.MAP)
  }

  @action activateShield = async (duration: number) => {
    // await this after we clear the UI
    const res = this.api.hero.startShield(duration)
    this.cancelShieldUnits()
    return await res
  }

  @action resetShield = async (duration: number) => {
    return await this.api.hero.resetShield(duration)
  }
  // -----------------------------------

  @action startAttack = () => {
    // show moving HUD
    this.store.ui.setHUDState(HUDState.ATTACK)

    // hide phaser buttons
    this.store.game?.events.emit('SET_TILE_ACTIONS_MODE', ActionMenuMode.ATTACK)

    // select possible tiles
    const adjacent = this.store.land.tileCanBeAttacked
    adjacent.forEach((t) => {
      t.select()
      t.setTargettable()
    })
  }

  @action startMoveUnit = () => {
    // remove the actions menu
    this.store.game?.events.emit('SET_TILE_ACTIONS_MODE', ActionMenuMode.MOVE)

    // this.hideTileActions()
    // show moving HUD
    this.store.ui.setHUDState(HUDState.MOVE_UNIT)

    // select possible tiles
    const adjacent = this.store.land.tilesCanMoveTo
    adjacent.forEach((t) => t.select())
  }

  @action attack = async (x: number, y: number) => {
    // grab the potential tiles that we can attack
    const adjacent = this.store.land.tileCanBeAttacked

    // where are we attacking from?
    const fromLand = this.store.land.selected

    // save the selection for later
    this.store.land.stashSelected()

    // find the tile we selected
    // go from adjacent so we know its a valid move
    const toLand = adjacent.find(
      (t) => t.coords.gridX == x && t.coords.gridY == y
    )

    // deselect tiles first so we can re-assign the selected tile if everything goes well
    adjacent.forEach((t) => {
      t.deselect()
      t.removeTargettable()
    })

    // revert the map state while the tx runs so we don't go straight into a 2nd attack
    this.store.ui.setHUDState(HUDState.MAP)

    if (toLand && fromLand) {
      const { gridX: fromX, gridY: fromY } = fromLand.coords
      const { err, res } = await this.api.unit.attackUnit(
        fromLand.landId,
        toLand.landId,
        fromLand.unitTokenId
      )

      if (err) {
        // error in Tx
      } else {
        await Promise.all([
          this.api.land.getOne(toLand.landId),
          this.api.land.getOne(fromLand.landId),
        ])
        // update hero stats
        this.api.hero.getEnergy()
        this.api.hero.getExp()
      }
    } else {
      // TODO: Toast -> unknown tile
    }

    this.maybeReselectTile()
  }

  @action moveToTile = async (x: number, y: number) => {
    const adjacent = this.store.land.tilesCanMoveTo

    const fromLand = this.store.land.selected
    // save the selection for later
    const reselectLand = this.store.land.stashSelected()
    const toLand = adjacent.find(
      (t) => t.coords.gridX == x && t.coords.gridY == y
    )

    // deselect tiles first so we can re-assign the selected tile if everything goes well
    adjacent.forEach((t) => t.deselect())
    this.store.ui.setHUDState(HUDState.MAP)

    if (toLand && fromLand) {
      const { err } = await this.api.unit.moveUnit(
        fromLand.landId,
        toLand.landId,
        fromLand.unitTokenId
      )

      if (err) {
        // error in Tx
      } else {
        await Promise.all([
          this.api.land.getOne(toLand.landId),
          this.api.land.getOne(fromLand.landId),
        ])
        this.api.hero.getEnergy()
      }
    } else {
      // TODO: Toast -> unknown tile
    }
    reselectLand()
  }

  // @observable modX = 65
  // @observable modY = 44
  // @observable modWidth = 62
  // @observable modHeight = 48

  // @action setModX = (val: number) => {
  //   this.modX = val
  // }
  // @action setModY = (val: number) => {
  //   this.modY = val
  // }
  // @action setModWidth = (val: number) => {
  //   this.modWidth = val
  // }
  // @action setModHeight = (val: number) => {
  //   this.modHeight = val
  // }

  setMinimapRect(rect: ICameraRect) {
    // const x = (rect.x + 6400) / this.modX
    // const y = (rect.y + 400) / this.modY
    // const width = rect.width / this.modWidth
    // const height = rect.height / this.modHeight
    this.store.ui.updateMinimapRect({
      ...this.store.ui.minimapRect,
      ...mapRectToMiniMap(rect),
    })
  }
}
