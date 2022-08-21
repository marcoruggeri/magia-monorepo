import {
  action,
  autorun,
  computed,
  has,
  makeObservable,
  observable,
  reaction,
} from 'mobx'
import { Building, Tileset } from '../../enums'
import {
  ISO_COL_WIDTH,
  ISO_ROW_HEIGHT,
  TILE_HEIGHT,
  TILE_WIDTH,
} from '../lib/constants'
import { generatePennantId } from '../lib/utils/generatePennantId'
import { gridCoordsToPixelCoords } from '../lib/utils/gridCoordsToPixelCoords'
import { AppStore } from '../stores/app'
import { IChainLand, ChainLand } from '../types/chain/land'
import { CoordQuad } from '../types/game/coordQuad'
import { HUDState } from '../types/ui/HUDState'
import { drawGridLines, highlightTile } from '../util/drawGridLines'

export class Tile {
  @observable building!: Building
  @observable coords!: CoordQuad
  @computed get id() {
    return this.landId
  }

  // resources
  @observable gold!: number
  @observable lumber!: number
  @observable mana!: number

  // owner
  @observable heroId!: number
  // units
  @observable unitTokenId!: number

  // assets
  landImage?: Phaser.GameObjects.Image
  pennantImage?: Phaser.GameObjects.Image
  unitImage?: Phaser.GameObjects.Image
  shieldImage?: Phaser.GameObjects.Image
  hoverZone?: Phaser.GameObjects.Polygon

  // state
  @observable selected = false
  selectionLines: Phaser.GameObjects.Line[] = []

  // unitHealth!: number

  constructor(
    private store: AppStore,
    input: IChainLand,
    public landId: number
  ) {
    makeObservable(this)

    this.initClassProps(input)
    this.initPhaserImages()
    this.paintTextures()

    reaction(
      () => [this.unitSpriteId, this.pennantSpriteId, this.landSpriteId],
      () => {
        this.paintTextures()
      }
    )

    reaction(
      () => [this.hasShield, this.isShieldCandidate],
      () => {
        this.paintShield()
      }
    )
  }

  @action loadNewData = (input: IChainLand) => {
    this.initClassProps(input)

    this.paintTextures()
  }

  // parrse chain data and init the class props
  @action initClassProps = (input: IChainLand) => {
    const tile = this.parseInput(input)
    this.building = tile.building

    const gridX = tile.coordinateX
    const gridY = tile.coordinateY

    const [pixelX, pixelY] = gridCoordsToPixelCoords(gridX, gridY)

    this.coords = {
      gridX,
      gridY,
      pixelX,
      pixelY,
    }

    this.gold = tile.gold
    this.lumber = tile.lumber
    this.mana = tile.mana
    this.heroId = tile.heroId
    this.unitTokenId = tile.unitTokenId
  }

  // takes chain data, unwraps vals an assigns them to named props
  @action parseInput = (input: IChainLand) => {
    return new ChainLand(input)
  }

  handleUnitHover = () => {
    if (this.store.ui.HUDState === HUDState.ATTACK) {
      this.store.land.setPotentialTargetId(this.landId)
    }
  }

  handleUnitDeHover = () => {
    this.store.land.clearPotentialTargetId()
  }

  setTargettable = () => {
    if (!this.landImage) {
      return
    }
    this.landImage.setInteractive(
      this.store.scenes.map!.input.makePixelPerfect()
    )
    // this.landImage.setFillStyle(0xffffff, 0.6)
    // this.landImage.setDepth(4)
    // listen to unit hovers for when we are attacking
    this.landImage.on(Phaser.Input.Events.POINTER_OVER, this.handleUnitHover)
    this.landImage.on(Phaser.Input.Events.POINTER_OUT, this.handleUnitDeHover)
  }

  removeTargettable = () => {
    if (!this.landImage) {
      return
    }
    this.landImage.input.enabled = false
    // this.landImage.setFillStyle()
    // this.landImage.setDepth(0)

    // remove the handlers
    this.landImage.off(Phaser.Input.Events.POINTER_OVER, this.handleUnitHover)
    this.landImage.off(Phaser.Input.Events.POINTER_OUT, this.handleUnitDeHover)
    // remove the selected target
    this.handleUnitDeHover()
  }

  initPhaserImages = () => {
    const map = this.store.scenes.map!

    this.pennantImage = map.add.image(
      this.coords.pixelX - TILE_WIDTH / 4,
      this.coords.pixelY + TILE_HEIGHT / 16,
      'tiles', // pennants doesnt have a blank 0 right now
      0
    )

    this.landImage = map.add.image(
      this.coords.pixelX - TILE_WIDTH / 4,
      this.coords.pixelY + TILE_HEIGHT / 16,
      'tiles',
      0
    )

    this.unitImage = map.add.image(
      this.coords.pixelX - TILE_WIDTH / 4,
      this.coords.pixelY + TILE_HEIGHT / 16,
      'units',
      0
    )

    this.shieldImage = map.add.image(
      this.coords.pixelX - TILE_WIDTH / 4,
      this.coords.pixelY + TILE_HEIGHT / 16,
      'shield',
      0
    )

    const isoWidth = ISO_COL_WIDTH / 2
    const isoHeight = ISO_ROW_HEIGHT
    this.hoverZone = map.add.polygon(
      this.coords.pixelX + isoWidth * 0.5,
      this.coords.pixelY + isoHeight * 0.25,
      [
        0,
        0,
        isoWidth,
        0.5 * isoHeight,
        0,
        isoHeight,
        -1 * isoWidth,
        0.5 * isoHeight,
      ]
      // 0xffffff
    )
  }

  @computed get hero() {
    return this.heroId ? this.store.hero.byId.get(this.heroId) : undefined
  }

  @computed get hasPennant() {
    // TODO: not sure why unit id 0 is set on all tiles after move_unit
    return this.heroId || (this.unit && this.unit.id > 0)
  }

  @computed get hasGoldToCollect() {
    return !!(this.isOwnTile && this.gold > 0)
  }

  @computed get hasManaToCollect() {
    return !!(this.isOwnTile && this.mana > 0)
  }

  @computed get hasLumberToCollect() {
    return !!(this.isOwnTile && this.lumber > 0)
  }

  // needs your own mine and a unit to collect with
  @computed get canClaimGold() {
    return !!(this.hasGoldmine && this.hasOwnUnit)
  }
  @computed get canClaimMana() {
    return !!(this.hasManaShrine && this.hasOwnUnit)
  }
  @computed get canClaimLumber() {
    return !!(this.hasLumbermill && this.hasOwnUnit)
  }

  @computed get hasOwnUnit() {
    return !!(this.isOwnTile && this.unit)
  }

  @computed get hasBarracks() {
    return !!(this.isOwnTile && this.building == Building.BARRACKS)
  }

  @computed get hasWorkshop() {
    return !!(this.isOwnTile && this.building == Building.WORKSHOP)
  }

  @computed get hasMagetower() {
    return !!(this.isOwnTile && this.building == Building.MAGE_TOWER)
  }

  @computed get hasBuilding() {
    return !!(this.isOwnTile && this.building != Building.NONE)
  }

  @computed get hasGoldmine() {
    return !!(this.building == Building.GOLDMINE)
  }

  @computed get hasOwnGoldmine() {
    return !!(this.isOwnTile && this.hasGoldmine)
  }

  @computed get hasLumbermill() {
    return !!(this.building == Building.LUMBERMILL)
  }

  @computed get hasOwnLumbermill() {
    return !!(this.isOwnTile && this.hasLumbermill)
  }

  @computed get hasManaShrine() {
    return !!(this.building == Building.MANASHRINE)
  }

  @computed get hasOwnManaShrine() {
    return !!(this.isOwnTile && this.hasManaShrine)
  }

  @computed get hasShield() {
    return !!(this.unit && this.unit.shieldActive)
  }

  // has this tile been highlighted for the next shield start?
  @computed get isShieldCandidate() {
    return !!(this.unit && this.store.ui.unitsToShield.includes(this.unit))
  }

  // does this tile belong to the user?
  @computed get isOwnTile() {
    return !!(this.heroId && this.heroId === this.store.player.hero?.id)
  }

  @computed get unit() {
    return this.unitTokenId !== 0
      ? this.store.unit.byId.get(this.unitTokenId)
      : undefined
  }

  canBuild(building: Building) {
    // must be a tile you have a unit on that has nothing built already
    if (this.hasBuilding || !this.hasOwnUnit) {
      return false
    }

    // if its a gold tile we must be asking about a goldmine, otherwise early return a false
    if (this.hasGoldToCollect) {
      return building === Building.GOLDMINE
    }

    if (this.hasManaToCollect) {
      return building === Building.MANASHRINE
    }

    if (this.hasLumberToCollect) {
      return building === Building.LUMBERMILL
    }

    // otherwise we must be on grass
    if (
      building === Building.BARRACKS ||
      building === Building.MAGE_TOWER ||
      building === Building.WORKSHOP
    ) {
      return true
    }

    // if we made it here we must be checking e.g. a goldmine vs grass
    return false
  }

  // -------------land sprite # ----------------

  // priority list to translate tile props -> sprite
  @computed get landSpriteId() {
    // ---------------------------------
    if (this.building == Building.GOLDMINE) {
      if (this.unitTokenId) {
        return Tileset.GOLDMINE_OCCUPIED
      }
      return Tileset.GOLDMINE
      // ---------------------------------
    } else if (this.building == Building.LUMBERMILL) {
      if (this.unitTokenId) {
        return Tileset.LUMBERMILL_OCCUPIED
      }
      return Tileset.LUMBERMILL
      // ---------------------------------
    } else if (this.building == Building.MANASHRINE) {
      return Tileset.MANASHRINE
      // ---------------------------------
    } else if (this.building == Building.BARRACKS) {
      if (this.unitTokenId) {
        return Tileset.BARRACKS_OCCUPIED
      }
      return Tileset.BARRACKS
      // ---------------------------------
    } else if (this.building == Building.WORKSHOP) {
      // if (this.unitTokenId) {
      //   return Tileset.WORKSHOP_OCCUPIED
      // }
      return Tileset.WORKSHOP
      // ---------------------------------
    } else if (this.building == Building.MAGE_TOWER) {
      // if (this.unitTokenId) {
      //   return Tileset.MAGE_TOWER_OCCUPIED
      // }
      return Tileset.MAGE_TOWER
      // ---------------------------------
    } else if (this.gold) {
      return Tileset.GOLD
      // ---------------------------------
    } else if (this.lumber > 0) {
      // ---------------------------------
      if (this.unitTokenId) {
        return Tileset.FOREST_OCCUPIED
      }
      return Tileset.LUMBER
    } else if (this.mana > 0) {
      // ---------------------------------
      return Tileset.MANA
    } else {
      // ------
      return Tileset.GRASS
    }
  }
  // -------------pennant sprite # ----------------
  @computed get pennantSpriteId() {
    if (!this.hasPennant) {
      return 0
    }

    if (!this.heroId) {
      // mob
      return 239
    }

    return this.heroId
    // return generatePennantId(this.heroId.toString())
  }

  @computed get highlightedPennantSpriteId() {
    if (!this.hasPennant) {
      return 0
    }

    if (!this.heroId) {
      // mob
      return 240
    }

    return this.pennantSpriteId + 119
  }

  // -------------unit sprite # ----------------
  @computed get unitSpriteId() {
    if (!this.unit) {
      return 0
    }
    // console.log('drawing', this)

    let modifier = 0

    if (this.landSpriteId == Tileset.LUMBER) {
      modifier = 16
    } else if (this.landSpriteId == Tileset.GOLDMINE_OCCUPIED) {
      modifier = 32
    } else if (this.landSpriteId == Tileset.LUMBERMILL_OCCUPIED) {
      modifier = 48
    } else if (
      this.landSpriteId == Tileset.BARRACKS_OCCUPIED ||
      this.landSpriteId == Tileset.WORKSHOP ||
      this.landSpriteId == Tileset.MAGE_TOWER
    ) {
      modifier = 64
    }

    return this.unit.unitType + modifier
  }

  // -------------textures ----------------
  showHighlightedTextures() {
    this.landImage?.setTexture('tiles', this.landSpriteId + 14)
    this.pennantImage?.setTexture('pennants', this.highlightedPennantSpriteId)
    this.unitImage?.setTexture('units', this.unitSpriteId)
  }

  showNormalTextures() {
    this.landImage?.setTexture('tiles', this.landSpriteId)
    this.pennantImage?.setTexture('pennants', this.pennantSpriteId)
    this.unitImage?.setTexture('units', this.unitSpriteId)
  }

  paintTextures = () => {
    this.selected ? this.showHighlightedTextures() : this.showNormalTextures()
  }

  paintShield = () => {
    if (this.hasShield || this.isShieldCandidate) {
      this.showShield()
    } else {
      this.hideShield()
    }
  }

  showShield = () => {
    this.shieldImage?.setTexture('shield', 1)
    if (this.isShieldCandidate) {
      this.shieldImage?.setAlpha(0.7)
    } else {
      this.shieldImage?.setAlpha(1)
    }
  }

  hideShield = () => {
    this.shieldImage?.setTexture('shield', 0)
  }

  // -------------selection ----------------
  @action
  toggleSelection = () => {
    this.selected ? this.deselect() : this.select()
  }

  @action
  select = () => {
    this.selected = true
    this.paintTextures()
  }

  @action
  deselect = () => {
    this.selected = false
    this.paintTextures()
  }

  // ------------- ----------------
}
