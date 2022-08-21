import { observer, useLocalObservable } from 'mobx-react-lite'
import { FC, useState } from 'react'
import { MagicType } from '../../../enums'
import { MagicStatsTuple } from '../../../magiaTypes'
import { useMagicStatsStore } from '../../hooks/useMagicStatsStore'
import { Hero, MagicStatsStore } from '../../models/Hero'
import { ButtonRegular, ButtonTransparent } from '../ui/Button'
import { useAppContext } from '../../providers/AppContext'
import { $enum } from 'ts-enum-util'
import { Dialog } from '../../types/ui/Dialogs'
import { NumberInputWithQtyAdjust } from '../common/MagicPoints'

interface Props {
  hero?: Hero
  pointsToSpend: number
  rng?: boolean
  handleSubmit: (points: MagicStatsTuple) => void
}
export const HeroStats: FC<Props> = observer(
  ({ hero, pointsToSpend, handleSubmit }) => {
    const { store } = useAppContext()

    const stats = useLocalObservable(
      () => new MagicStatsStore(store.player.hero)
    )

    const remain = pointsToSpend - stats.totalPoints
    const canIncrease = remain > 0

    const update = (magic: MagicType, val: number) =>
      stats.magicStats.set(magic, val)

    return (
      <div>
        <p>{remain} to allocate</p>
        {$enum(MagicType).map((t, key) => {
          return (
            <NumberInputWithQtyAdjust
              update={(val: number) => update(t, val)}
              min={0}
              max={3}
              value={stats.magicStats.get(t) || 0}
            />
          )
        })}

        <ButtonRegular onClick={() => handleSubmit(stats.tuple)}>
          Go
        </ButtonRegular>
        <ButtonTransparent
          onClick={() => store.ui.closeDialog(Dialog.HERO_LEVEL)}
        >
          Cancel
        </ButtonTransparent>
      </div>
    )
  }
)
