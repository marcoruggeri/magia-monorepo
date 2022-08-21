import Image from 'next/image'
import { Fragment } from 'react'
import { $enum } from 'ts-enum-util'
import { MagicType, Spell } from '../../../../enums'
import { useAppContext } from '../../../providers/AppContext'
import { getSpellImage } from '../../../util/getSpellImage'
import { magicReqsToString } from '../../../util/magicReqsToString'
import { VerticalScroll } from '../../common/VerticalScroll'
import { SpellImage } from '../../ui/SpellImage'
import { PaneTransition } from '../common/PaneTransition'
import { CraftableItem } from './CraftableItem'

export const Spells = () => {
  const { store, api } = useAppContext()

  const handleCraft = async (id: number) => {
    await api.spells.craft(id)
  }

  return (
    <VerticalScroll>
      <PaneTransition>
        {store.catalog.spells.map((spell, idx) => {
          const tier = Math.ceil((idx + 0.5) / 5)
          const minimum = tier * 5 + (tier == 3 ? 5 : 0)
          const magicIdx = idx % 5
          const magic = $enum(MagicType).getValues()[magicIdx]
          const canCraft = store.player.hero!.getMagic(magic) >= minimum
          console.log(
            store.player.hero!.getMagic(magic),
            magic,
            magicIdx,
            minimum,
            canCraft
          )

          if (!canCraft) {
            return <Fragment key={spell.name}></Fragment>
          }
          return (
            <CraftableItem
              key={spell.name}
              item={{
                name: spell.name,
                goldCost: spell.cost.gold,
                lumberCost: spell.cost.lumber,
                manaCost: spell.cost.mana,
                requirement: magicReqsToString(spell.magicReqs),
                craftTime: spell.craftTime,
                image: (
                  <div className={`px-4 pt-2 `}>
                    <SpellImage
                      sprite={Object.values(Spell)[spell.id]}
                      width={100}
                      height={100}
                    />
                  </div>
                ),
                craftFunction: () => handleCraft(spell.id),
              }}
            />
          )
        })}
      </PaneTransition>
    </VerticalScroll>
  )
}
