import { action, computed, makeObservable, observable } from 'mobx'
import { formatTimeDelta } from '../util/formatTimeDelta'

export class Villain {
  @observable exp: number
  // @observable shieldExpiry: number = 1657957654271
  @observable shieldExpiry: number = 0

  constructor(public id: number, public name: string, exp: number) {
    this.exp = parseInt(exp.toString())
    makeObservable(this)
  }

  @action setShieldExpiry = (time: number) => {
    // console.log('setting', time)

    this.shieldExpiry = time
  }
  @action stopShield = () => (this.shieldExpiry = 0)
  @computed get shieldActive() {
    return this.shieldExpiry > Date.now() / 1000
  }

  @computed get shieldRemaining() {
    return this.shieldActive
      ? formatTimeDelta(this.shieldExpiry - Date.now() / 1000)
      : false
  }
}
