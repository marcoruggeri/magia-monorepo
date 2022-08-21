import { action, computed, makeObservable, observable } from 'mobx'
import { Hero } from '../models/Hero'
import { Villain } from '../models/Villain'
import { IChainHero } from '../types/chain/hero'
import { AppStore } from './app'

export class HeroStore {
  byId = observable.map<number, Hero>()
  // villainsById = observable.map<number, Villain>()

  constructor(private store: AppStore) {
    makeObservable(this)
  }

  // @computed get villains() {
  //   return [...this.villainsById.values()]
  // }

  // @computed get villainsRanked() {
  //   return this.villains.sort((a, b) => b.exp - a.exp)
  // }
  @computed get heroes() {
    return [...this.byId.values()]
  }
  @computed get heroesRanked() {
    return this.heroes.sort((a, b) => b.totalExp - a.totalExp)
  }

  @computed get heroRank() {
    return (
      this.heroesRanked.findIndex((h) => h.id === this.store.player.heroId) + 1
    )
  }

  @action loadHeroesInOrder = (input: IChainHero[]) => {
    input.forEach((h, idx) => {
      this.byId.set(idx, new Hero(this.store, h, idx))
    })
  }

  // @action setShieldExpiry = (heroId: number, timestamp: number) => {
  //   const villain = this.villainsById.get(heroId)
  //   if (!villain) {
  //     return
  //   }

  //   villain.setShieldExpiry(timestamp)
  //   this.villainsById.set(heroId, villain)
  // }

  // @action stopShield = (heroId: number) => {
  //   const villain = this.villainsById.get(heroId)
  //   if (!villain) {
  //     return
  //   }
  //   villain.stopShield()
  //   this.villainsById.set(heroId, villain)
  // }
}
