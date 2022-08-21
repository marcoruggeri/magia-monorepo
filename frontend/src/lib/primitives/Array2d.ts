import { ObservableMap } from 'mobx'

interface HasId {
  id: number
}

export class Array2d<T extends HasId> {
  // TODO: speed test map vs [][]
  data: T[][] = []
  byId = new ObservableMap<number, T>()

  set(i: number, j: number, item: T) {
    if (!this.data[i]) {
      this.data[i] = []
    }

    this.data[i][j] = item
    this.byId.set(item.id, item)
  }

  get(i: number, j: number) {
    return this.data[i] ? this.data[i][j] : false
  }

  getById(id: number) {
    return this.byId.get(id)
  }

  values() {
    return this.data.flat()
  }
}
