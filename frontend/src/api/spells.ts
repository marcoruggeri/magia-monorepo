import { AppAPI } from '.'
import { Resource, Spell } from '../../enums'
import { Tile } from '../models/Tile'
import { AppStore } from '../stores/app'
import { MagiaAPI } from './MagiaApi'
import contracts from '../contracts.json'

export class SpellsApi extends MagiaAPI {
  async craft(spellId: number, amount: number = 1) {
    const diamond = this.store.contract.useSigned('diamond')

    const result = await diamond.craftSpell(this.store.player.hero?.id, spellId)

    await Promise.all([
      this.api.inventory.getSpells(),
      this.api.resource.getAll(),
    ])

    return result
  }

  getSpellFunc = (spell: Spell) => {
    const { diamond } = this.contracts

    const spellFuncs: { [key in Spell]: any } = {
      [Spell.NONE]: () => false,
      [Spell.HEALING]: diamond.healing,
      [Spell.CURSE]: diamond.reduceArmor,
      [Spell.FIREBALL]: diamond.fireball,
      [Spell.GROWTH]: diamond.giantStrength,
      [Spell.ARMOR]: diamond.iceArmor,
      [Spell.SUMMON_ANGEL]: diamond.summonAngels,
      [Spell.SUMMON_BLACK_KNIGHTS]: diamond.summonBlackKnights,
      [Spell.SUMMON_FIRE_ELEMENTAL]: diamond.summonFireElemental,
      [Spell.SUMMON_WATER_ELEMENTAL]: diamond.summonWaterElemental,
      [Spell.SUMMON_EARTH_ELEMENTAL]: diamond.summonEarthElemental,
      [Spell.CONVERT]: diamond.convert,
      [Spell.TELEPORT]: diamond.teleport,
      [Spell.PYROBLAST]: diamond.pyroblast,
      [Spell.PLAGUE]: diamond.plague,
      [Spell.TRANSMUTE]: diamond.transmute,
    }

    return spellFuncs[spell]
  }

  castSummon = async (spell: Spell, occupiedLandId: number, landId: number) => {
    if (!this.store.ui.castableSpell) {
      return
    }
    const func = this.getSpellFunc(spell)
    const { err } = await func(
      this.store.player.hero!.id,
      occupiedLandId,
      landId
    )

    if (!err) {
      this.api.land.getOne(landId)
      this.api.inventory.getSpells()
    }
  }

  castAttack = async (spell: Spell, land: Tile) => {
    if (!this.store.ui.castableSpell) {
      return
    }
    const func = this.getSpellFunc(spell)
    const { err } = await func(
      this.store.player.hero!.id,
      land.landId,
      land.unitTokenId
    )

    if (!err) {
      this.api.land.getOne(land.landId)
      this.api.inventory.getSpells()
    }
  }

  castPyroblast = async (spell: Spell, landIds: number[]) => {
    if (!this.store.ui.castableSpell) {
      return
    }
    const func = this.getSpellFunc(spell)
    const { err } = await func(this.store.player.hero!.id, landIds)

    if (!err) {
      this.api.land.fetchMany(landIds)
      this.api.inventory.getSpells()
    }
  }

  castConvert = async (
    spell: Spell,
    occupiedLandId: number,
    landId: number
  ) => {
    if (!this.store.ui.castableSpell) {
      return
    }
    const func = this.getSpellFunc(spell)
    const { err } = await func(
      this.store.player.hero!.id,
      occupiedLandId,
      landId
    )

    if (!err) {
      this.api.land.getOne(landId)
      this.api.inventory.getSpells()
    }
  }

  castTeleport = async (fromLand: Tile, toLand: Tile) => {
    if (!this.store.ui.castableSpell) {
      return
    }
    const func = this.getSpellFunc(this.store.ui.castableSpell)
    const { err } = await func(
      this.store.player.hero!.id,
      fromLand.unitTokenId,
      fromLand.id,
      toLand.id
    )

    if (!err) {
      this.api.land.fetchMany([fromLand.id, toLand.id])
      this.api.inventory.getSpells()
    }
  }

  castTransmute = async (resourceType: Resource, energyAmount: number) => {
    if (!this.store.ui.castableSpell) {
      return
    }
    const res = Resource[resourceType].toLowerCase() as keyof typeof contracts
    const address = contracts[res]

    const func = this.getSpellFunc(this.store.ui.castableSpell)
    const { err } = await func(
      this.store.player.hero!.id,
      energyAmount,
      address
    )

    if (!err) {
      await Promise.all([
        this.api.inventory.getSpells(),
        this.api.resource.getAll(),
        this.api.hero.getEnergy(),
      ])
    }
  }
}
