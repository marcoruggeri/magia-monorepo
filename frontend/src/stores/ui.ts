import { action, computed, makeObservable, observable } from 'mobx'
import { Spell } from '../../enums'
import { Unit } from '../models/Unit'
import { HUDState } from '../types/ui/HUDState'
import { Dialog, ModalDialog } from '../types/ui/Dialogs'
import { Toast } from '../types/ui/Toast'

import { AppStore } from './app'
import { SidebarId } from '../components/sidebar/SidebarSelector'
import { ICameraRect } from '../components/ui/HUD'
import { Tile } from '../models/Tile'
import { txID } from '../util/txID'

export interface Transaction {
  id: string
  label: string
  hash?: string
}

/**
 * This store contains state about the UI/HUD
 * including:
 * - dialogs
 * - actions in progress
 * */
export class UIStore {
  constructor(private store: AppStore) {
    makeObservable(this)
  }

  @observable dialogs: { modal: ModalDialog; open: Dialog[] } = {
    // only one modal can be open at once
    modal: ModalDialog.NONE,
    // many panels/dialogs can be open at the same time
    open: [],
  }

  @action openDialog = (dialog: Dialog) => {
    this.dialogs = {
      ...this.dialogs,
      open: [...this.dialogs.open, dialog],
    }
  }
  @action closeDialog = (dialog: Dialog) => {
    this.dialogs = {
      ...this.dialogs,
      open: [...this.dialogs.open.filter((d) => d !== dialog)],
    }
  }
  isDialogOpen = (dialog: Dialog) => this.dialogs.open.includes(dialog)
  @observable modalOpen?: ModalDialog
  @observable HUDState: HUDState = HUDState.MAP

  @observable notifications: Toast[] = []
  @action addNotification(message: string, data: any) {
    this.notifications = [
      ...this.notifications,
      {
        message,
        type: 'error',
        data,
      },
    ]
  }

  @observable minimapRect: ICameraRect = {
    x: 0,
    y: 0,
    width: 100,
    height: 66,
  }
  @action updateMinimapRect = (rect: ICameraRect) => (this.minimapRect = rect)

  @observable worldLoaded = false
  @action setWorldLoaded = () => (this.worldLoaded = true)

  @observable toasts: Toast[] = []
  // -----------------------------------

  @observable deployableUnitId?: number

  @action setDeployableUnit = (unit: Unit) => (this.deployableUnitId = unit.id)
  @action clearDeployableUnit = () => (this.deployableUnitId = undefined)
  @computed get deployableUnit() {
    if (!this.deployableUnitId) {
      return false
    }
    return this.store.unit.byId.get(this.deployableUnitId)
  }
  // -----------------------------------

  @observable castableSpell?: Spell
  @action setCastableSpell = (spell: Spell) => (this.castableSpell = spell)
  @action clearCastableSpell = () => (this.castableSpell = undefined)

  // -----------------------------------
  @observable areaSelection: Tile[] = []
  @action setAreaSelection = (tiles: Tile[]) => {
    this.areaSelection = tiles
  }
  // -----------------------------------

  @observable unitsToShield: Unit[] = []
  @action addUnitToShield = (unit: Unit) => {
    this.unitsToShield = [...this.unitsToShield, unit]
  }
  @action removeUnitToShield = (unit: Unit) => {
    this.unitsToShield = [...this.unitsToShield.filter((u) => u.id !== unit.id)]
  }

  @action clearUnitsToShield = () => (this.unitsToShield = [])

  @action toggleUnitToShild = (unit: Unit) => {
    if (this.unitsToShield.includes(unit)) {
      this.removeUnitToShield(unit)
    } else {
      this.addUnitToShield(unit)
    }
  }

  // -----------------------------------
  @observable teleportFrom?: Tile

  @action setTeleportFrom = (tile: Tile) => {
    this.teleportFrom = tile
  }
  @action clearTeleportFrom = () => {
    this.teleportFrom = undefined
  }
  // -----------------------------------
  // @observable transactions: string[] = []
  @observable transactions: Transaction[] = []

  @action addTransaction = (label: string) => {
    const tx = { label, id: txID() }
    this.transactions = [...this.transactions, tx]
    // save the return and call it to remove
    // return () => this.removeTransaction(name)
    return tx
  }

  @action removeTransaction = (tx: Transaction) => {
    this.transactions = this.transactions.filter((t) => t.id !== tx.id)
  }

  @action clearTransactions = () => {
    this.transactions = []
  }
  // -----------------------------------

  @action addToast = (toast: Toast) => (this.toasts = [...this.toasts, toast])

  @action removeToast = (toast: Toast) => {
    this.toasts = this.toasts.filter((t) => t.message !== toast.message)
  }

  @action showModal = (dialog: ModalDialog) => {
    this.modalOpen = dialog
  }

  @action setHUDState = (state: HUDState) => (this.HUDState = state)

  @observable hudCleanupTasks: Array<() => void> = []
  @action queueHUDCleanupTask = (f: () => void) => {
    this.hudCleanupTasks.push(f)
  }
  @action revertHUDState = () => {
    this.hudCleanupTasks.forEach((f) => f())
    this.hudCleanupTasks = []
    this.setHUDState(HUDState.MAP)
  }

  @computed get hasHUDCleanupTasks() {
    return this.hudCleanupTasks.length > 0
  }

  @action allowHUDCleanup = () => {
    // bit hacky, makes the state cancellable
    this.queueHUDCleanupTask(() => false)
  }

  @action closeModal = () => (this.modalOpen = undefined)

  @observable hudSidebarOpen: SidebarId | undefined | 'landInfo'
  @action openHUDSidebar = (id: SidebarId) => {
    this.hudSidebarOpen = id
  }

  @action showSelectedLandInfo = () => {
    this.hudSidebarOpen = 'landInfo'
  }

  @action closeHUDSidebar = () => {
    this.hudSidebarOpen = undefined
  }
}
