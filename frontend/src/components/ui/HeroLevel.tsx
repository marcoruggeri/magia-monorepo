import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'
import { $enum } from 'ts-enum-util'
import { Spell } from '../../../enums'
import { MagicStatsTuple } from '../../../magiaTypes'
import { useAppContext } from '../../providers/AppContext'
import { Dialog } from '../../types/ui/Dialogs'
import { HeroStats } from '../account/HeroStats'
import { MagicPoints } from '../common/MagicPoints'
import { ButtonRegular, ButtonTransparent } from './Button'
import { ModalFlexHeight } from './ModalFlexHeight'
import { SpellImage } from './SpellImage'

export const HeroLevel = observer(() => {
  const { store, controller, api } = useAppContext()

  const [points, setPoints] = useState<MagicStatsTuple>([0, 0, 0, 0, 0])
  const handlePointChange = (p: MagicStatsTuple) => {
    setPoints(p)
  }
  const basePoints = store.player.hero!.magic.tuple
  const totalPoints = basePoints?.map((b, idx) => b + points[idx])

  const max = 5
  const handleSubmit = async () => {
    store.ui.closeDialog(Dialog.HERO_LEVEL)
    await api.hero.levelUp(points)
  }
  return (
    <ModalFlexHeight
      open={true}
      onClose={() => store.ui.closeDialog(Dialog.HERO_LEVEL)}
      className="pb-4"
    >
      <div className="">
        <div className="px-5 pb-10">
          <p className="heading-level-2 mb-8 text-center">Level Up</p>
          <MagicPoints
            total={max}
            onChange={handlePointChange}
            points={points}
            basePoints={basePoints}
          />
        </div>
        <div className="mx-auto grid max-w-[580px] grid-cols-5 justify-items-center gap-4">
          {$enum(Spell).map((spell, _, __, idx) => {
            if (spell === Spell.NONE) {
              return <></>
            }

            const tier = Math.ceil(idx / 5)
            const minimum = tier * 5 + (tier == 3 ? 5 : 0)
            const magic = (idx - 1) % 5
            const isActive = totalPoints[magic] >= minimum

            return (
              <div className={`w-[50px] ${isActive ? '' : 'opacity-30'}`}>
                <SpellImage sprite={spell} width={50} height={50} />
              </div>
            )
          })}
        </div>
        <div className="mt-8 flex justify-center space-x-2">
          <ButtonRegular onClick={handleSubmit}>Confirm</ButtonRegular>
          <ButtonTransparent
            onClick={() => store.ui.closeDialog(Dialog.HERO_LEVEL)}
          >
            Cancel
          </ButtonTransparent>
        </div>
      </div>
    </ModalFlexHeight>
  )
})
