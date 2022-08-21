import { action, computed, makeObservable, observable } from 'mobx'
import { Array2d } from '../lib/primitives/Array2d'
import { Tile } from '../models/Tile'
import { ChainLand, IChainLand } from '../types/chain/land'
import { AppStore } from './app'

export class LandStore {
  @observable initialised = false
  @action initDone() {
    this.initialised = true
  }

  @observable
  data = new Array2d<Tile>()

  constructor(private store: AppStore) {
    makeObservable(this)
  }

  // ------------- selected tile ----------------
  @observable selectedLandId?: number
  // for when you're waiting to select some land after something
  @observable suspendedSelectedLandId?: number

  @computed get selected() {
    return this.selectedLandId
      ? this.getLandById(this.selectedLandId)
      : undefined
  }

  @computed get stashed() {
    return this.suspendedSelectedLandId
      ? this.getLandById(this.suspendedSelectedLandId)
      : undefined
  }

  @action setSelected(tile: Tile) {
    this.selectedLandId = tile.landId
    // clear the stash if a new selection is made
    this.suspendedSelectedLandId = undefined
  }

  // stashes the selected tile and returns a func to reselect if no other actions have been stashed
  @action stashSelected() {
    // null op if no land is selected
    if (!this.selectedLandId) {
      return () => false
    }

    // save this land for a closure
    const thisStash = this.getLandById(this.selectedLandId)

    // should never happen but we need to have a valid tile
    if (!thisStash) {
      return () => false
    }

    // save in game store to compare against later
    this.suspendedSelectedLandId = this.selectedLandId
    return () => {
      const selectionHasChanged =
        !!this.suspendedSelectedLandId &&
        this.suspendedSelectedLandId === thisStash.id
      if (selectionHasChanged) {
        // if we didn't stash anything else in the meantime then active this tile
        this.setSelected(thisStash)
      }
      // return a boolean so we know if it has changed
      return selectionHasChanged
    }
  }

  @action clearSelection = () => {
    if (this.selected) {
      this.selected.deselect()
      this.selectedLandId = undefined
    }
  }

  // the stash gets cleared when a new selection is made
  // so if its still there we know a new tile wasn't clicked

  // TODO: this is buggy if you fire off multiple actions
  // we should instead return a function from stashing that contains the info to check if the same tile is still active
  // @computed get selectionHasChanged() {
  //   return this.suspendedSelectedLandId === undefined
  // }

  // ------------- attack target ----------------
  @observable potentialTargetId?: number
  @action setPotentialTargetId = (landId: number) => {
    const targetLand = this.getLandById(landId)
    if (!targetLand || !targetLand.unit || targetLand.isOwnTile) {
      return
    }

    this.potentialTargetId = landId
  }
  @action clearPotentialTargetId = () => (this.potentialTargetId = undefined)
  @computed get potentialTarget() {
    return this.potentialTargetId
      ? this.getLandById(this.potentialTargetId)
      : undefined
  }
  // ------------- load data ----------------
  @action load(data: IChainLand[], start: number) {
    data.forEach((input, idx) => {
      const tile = new Tile(this.store, input, start + idx)

      // stash the unitId so we can fetch that after
      if (tile.unitTokenId > 0) {
        this.store.unit.waitingToFetchIds.push(tile.unitTokenId)
      }

      this.data.set(tile.coords.gridX, tile.coords.gridY, tile)
    })
  }

  getLandById = (id: number) => {
    return this.data.getById(id)
  }

  @action updateSingle = (input: IChainLand, idx: number) => {
    const tile = this.getLandById(idx)
    if (!tile) {
      return
    }

    tile.loadNewData(input)
  }

  getTile(x: number, y: number) {
    return this.data.get(x, y)
  }

  getRandomTile = () => {
    return this.all[Math.floor(Math.random() * this.all.length)]
  }

  @computed get all() {
    return Array.from(this.data.values())
  }

  // @computed get ownLand() {
  //   return this.all.filter((t) => t.heroId === this.store.player.hero?.id)
  // }

  @computed get nextOwnLand() {
    const { ownLand } = this

    const startIdx =
      this.selected?.heroId == this.store.player.hero?.id
        ? ownLand.findIndex((t) => t === this.selected) + 1
        : 0

    const target = startIdx % ownLand.length
    return ownLand[target]
  }

  @computed get prevOwnLand() {
    const reversed = [...this.ownLand].reverse()

    const startIdx =
      this.selected?.heroId == this.store.player.hero?.id
        ? reversed.findIndex((t) => t!.landId === this.selected!.landId) + 1
        : 0

    const target = startIdx % reversed.length
    return reversed[target]
  }

  @computed get selectedOwnedByHero() {
    return (
      this.selected?.heroId &&
      this.selected?.heroId === this.store.player.hero?.id
    )
  }

  // could probably speed this up by calculating the IDs and plucking them individually
  // return all tiles with a +/- x or y
  getAdjacentTiles(tile: Tile, delta: number = 1) {
    return this.store.land.all.filter(
      (t) =>
        t.coords.gridX >= tile.coords.gridX - delta &&
        t.coords.gridX <= tile.coords.gridX + delta &&
        t.coords.gridY >= tile.coords.gridY - delta &&
        t.coords.gridY <= tile.coords.gridY + delta &&
        t != tile
    )
  }

  @computed get ownLand() {
    return this.all.filter((t) => t.heroId === this.store.player.hero?.id)
  }

  // all tiles adjacent to own land without a unit
  @computed get deployableLand() {
    return this.ownLand
      .map((t) => this.getAdjacentTiles(t).filter((t) => !t.unitTokenId))
      .flat()
  }

  @computed get ownUnits() {
    return this.all.filter(
      (t) => t.heroId === this.store.player.hero?.id && !!t.unit
    )
  }

  @computed get tilesCanMoveTo() {
    if (!this.selected) {
      return []
    }

    return this.getAdjacentTiles(this.selected).filter(
      (t) => t.unitTokenId === 0
    )
  }

  @computed get tileCanBeAttacked() {
    if (!this.selected) {
      return []
    }

    const range = this.selected.unit?.range
    if (!range) {
      return []
    }

    return this.getAdjacentTiles(this.selected, range).filter(
      (t) =>
        t.unitTokenId && t.heroId != this.store.player.hero?.id && !t.hasShield
    )
  }
}
