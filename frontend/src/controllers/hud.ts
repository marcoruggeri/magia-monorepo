import { AppAPI } from '../api'
import { AppStore } from '../stores/app'
import { Toast } from '../types/ui/Toast'
import { AppController } from './app'

export class HUDController {
  constructor(
    private controller: AppController,
    private store: AppStore,
    private api: AppAPI
  ) {
    // attach tx watcher for the api
    this.api.setTxWatcher(this.watchTransaction)
  }

  showErrorToast = (message: string, data: any) => {
    // this.store.ui.addToast({ message, data, type: 'error' })
    this.addNotification(message, data)
  }

  clearToast = (toast: Toast) => {
    this.store.ui.removeToast(toast)
  }

  watchTransaction = async (name: string, tx: any) => {
    let err,
      res = undefined

    const pointer = this.store.ui.addTransaction(name)

    try {
      res = await tx.wait()
    } catch (e) {
      err = e
      this.showErrorToast('caught', err)
    }
    this.store.ui.removeTransaction(pointer)
    // tx.then(() => this.removeTransaction(name))
    return [err, res]
  }

  addNotification(message: string, data: any) {
    this.store.ui.addNotification(message, data)
  }
}
