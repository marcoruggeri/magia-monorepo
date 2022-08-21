import { action } from 'mobx'
import { Resource, Spell } from '../../enums'
import { AppAPI } from '../api'
import { Tile } from '../models/Tile'
import { AppStore } from '../stores/app'
import { Dialog, ModalDialog } from '../types/ui/Dialogs'
import { HUDState } from '../types/ui/HUDState'
import { AppController } from './app'

export class MagicController {
  constructor(
    private controller: AppController,
    private store: AppStore,
    private api: AppAPI
  ) {}

  startCast = (spell: Spell) => {
    switch (spell) {
      case Spell.CURSE:
      case Spell.FIREBALL:
      case Spell.GROWTH:
      case Spell.ARMOR:
      case Spell.PLAGUE:
        this.startCastAttack(spell)
        break
      case Spell.SUMMON_ANGEL:
      case Spell.SUMMON_BLACK_KNIGHTS:
      case Spell.SUMMON_FIRE_ELEMENTAL:
      case Spell.SUMMON_WATER_ELEMENTAL:
      case Spell.SUMMON_EARTH_ELEMENTAL:
        this.startCastSummon(spell)
        break
      case Spell.TELEPORT:
        this.startCastTeleport(spell)
        break
      case Spell.CONVERT:
        this.startCastConvert(spell)
        break
      case Spell.PYROBLAST:
        this.startCastPyroblast(spell)
        break
      case Spell.TRANSMUTE:
        this.startCastTransmute(spell)
        break
      default:
        break
    }
  }

  @action startCastTransmute = (spell: Spell) => {
    this.store.ui.setCastableSpell(spell)
    this.store.ui.showModal(ModalDialog.TRANSMUTE)
  }

  @action castTransmute = async (resource: Resource, energyAmount: number) => {
    this.store.ui.closeModal()
    await this.api.spells.castTransmute(resource, energyAmount)
  }

  @action startCastTeleport = (spell: Spell) => {
    this.store.ui.setHUDState(HUDState.CAST_TELEPORT_FROM)
    this.store.ui.allowHUDCleanup()
    this.store.ui.setCastableSpell(spell)
    this.controller.map.clearSelectedTile()
  }

  @action castConvert = async (x: number, y: number) => {
    // grab the potential tiles that we can attack
    const adjacent = this.store.land.tileCanBeAttacked

    // save the selection for later
    this.store.land.stashSelected()

    // find the tile we selected
    // go from adjacent so we know its a valid move
    const land = adjacent.find(
      (t) => t.coords.gridX == x && t.coords.gridY == y
    )

    if (!land || !land.unitTokenId || !this.store.ui.castableSpell) {
      this.store.ui.revertHUDState()
      return
    }

    // revert the map state while the tx runs so we don't go straight into a 2nd attack
    this.store.ui.revertHUDState()
    // this.store.ui.setHUDState(HUDState.MAP)

    // find an adjacent tile we can send as the occupied land
    const occupiedLand = this.store.land
      .getAdjacentTiles(land)
      .find((t) => t.isOwnTile)

    if (!occupiedLand) {
      return
    }

    await this.api.spells.castConvert(
      this.store.ui.castableSpell,
      occupiedLand.id,
      land.id
    )

    this.controller.map.maybeReselectTile()
  }

  @action startCastConvert = (spell: Spell) => {
    this.store.ui.setHUDState(HUDState.CAST_CONVERT)
    this.store.ui.allowHUDCleanup()
    this.store.ui.setCastableSpell(spell)
    // select possible tiles
    const adjacent = this.store.land.tileCanBeAttacked
    adjacent.forEach((t) => {
      t.select()
      t.setTargettable()
    })
    this.store.ui.queueHUDCleanupTask(() => {
      // deselect tiles first so we can re-assign the selected tile if everything goes well
      adjacent.forEach((t) => {
        t.deselect()
        t.removeTargettable()
      })
    })
  }

  @action startCastPyroblast = (spell: Spell) => {
    this.store.ui.setHUDState(HUDState.CAST_PYROBLAST_START)
    this.store.ui.allowHUDCleanup()
    this.store.ui.setCastableSpell(spell)
  }

  @action castPyroblast = () => {
    this.store.ui.revertHUDState()
    if (!this.store.ui.castableSpell) {
      return
    }
    const ids = this.store.ui.areaSelection.map((t) => t.id)
    this.api.spells.castPyroblast(this.store.ui.castableSpell, ids)
  }

  @action confirmCastPyroblast = (x: number, y: number) => {
    // grab a square from the tile selected
    // TODO: improve this to reverse around edge tiles
    const target = this.store.land.getTile(x, y)
    if (!target) {
      this.store.ui.revertHUDState()
      return
    }
    const ids = [target.id, target.id + 1, target.id + 100, target.id + 101]
    const tiles = ids
      .map((id) => this.store.land.getLandById(id))
      .filter((t) => t) as Tile[]

    // highlight the targetting area
    tiles.forEach((t) => t!.select())
    // deselect when done
    this.store.ui.queueHUDCleanupTask(() => {
      tiles.forEach((t) => t.deselect())
    })

    this.store.ui.setAreaSelection(tiles)
    this.store.ui.setHUDState(HUDState.CAST_PYROBLAST_CONFIRM)
  }

  @action castTeleportFrom = (x: number, y: number) => {
    const land = this.store.land.getTile(x, y)
    if (!land || !land.hasOwnUnit || !this.store.ui.castableSpell) {
      this.store.ui.setHUDState(HUDState.MAP)
      return
    }

    this.store.ui.setTeleportFrom(land)
    this.store.ui.queueHUDCleanupTask(this.store.ui.clearTeleportFrom)

    this.store.ui.setHUDState(HUDState.CAST_TELEPORT_TO)

    // select land
    const adjacent = this.store.land
      .getAdjacentTiles(land, 10)
      .filter((l) => !l.unit)
    adjacent.forEach((l) => l.select())

    // add cleanup task
    this.store.ui.queueHUDCleanupTask(() => {
      this.store.land.getAdjacentTiles(land, 10).forEach((l) => l.deselect())
    })
  }

  @action castTeleportTo = (x: number, y: number) => {
    const fromLand = this.store.ui.teleportFrom
    if (!fromLand) {
      this.store.ui.revertHUDState()
      return
    }
    // deselect land
    this.store.land.getAdjacentTiles(fromLand, 10).forEach((l) => l.deselect())

    const toLand = this.store.land.getTile(x, y)
    if (!toLand || !!toLand.unit || !this.store.ui.castableSpell) {
      this.store.ui.revertHUDState()
      return
    }

    this.store.ui.revertHUDState()
    this.api.spells.castTeleport(fromLand, toLand)
  }

  @action startCastAttack = (spell: Spell) => {
    this.store.ui.setHUDState(HUDState.CAST_ATTACK)
    this.store.ui.allowHUDCleanup()
    this.store.ui.setCastableSpell(spell)
    this.controller.map.clearSelectedTile()
  }

  @action startCastSummon = (spell: Spell) => {
    this.store.ui.setHUDState(HUDState.CAST_SUMMON)
    const adjacent = this.store.land.deployableLand
    adjacent.forEach((t) => t.select())
    this.store.ui.setCastableSpell(spell)
    this.controller.map.clearSelectedTile()
    this.store.ui.queueHUDCleanupTask(() => {
      this.store.ui.clearCastableSpell()
      adjacent.forEach((t) => t.deselect())
    })
  }

  @action castSummon = async (x: number, y: number) => {
    const land = this.store.land.getTile(x, y)
    if (!land || land.unitTokenId || !this.store.ui.castableSpell) {
      this.store.ui.setHUDState(HUDState.MAP)
      return
    }

    // find an adjacent tile we can send as the occupied land
    const occupiedLand = this.store.land
      .getAdjacentTiles(land!)
      .find((t) => t.isOwnTile)

    const adjacent = this.store.land.deployableLand

    // deselect tiles first so we can re-assign the selected tile if everything goes well
    adjacent.forEach((t) => {
      t.deselect()
    })

    if (!occupiedLand) {
      this.store.ui.setHUDState(HUDState.MAP)
      return
    }

    this.controller.map.selectTile(x, y)
    this.store.ui.setHUDState(HUDState.MAP)
    await this.api.spells.castSummon(
      this.store.ui.castableSpell,
      occupiedLand.id,
      land.id
    )
  }
  @action castAttack = async (x: number, y: number) => {
    const land = this.store.land.getTile(x, y)

    if (
      !land ||
      !land.unitTokenId ||
      !this.store.ui.castableSpell ||
      land.hasShield
    ) {
      this.store.ui.setHUDState(HUDState.MAP)
      return
    }
    this.controller.map.selectTile(x, y)
    this.store.ui.setHUDState(HUDState.MAP)
    await this.api.spells.castAttack(this.store.ui.castableSpell, land)
  }
}
