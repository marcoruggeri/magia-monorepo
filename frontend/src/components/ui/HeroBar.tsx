import { ethers } from 'ethers'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { FCChildren } from '../../../magiaTypes'
import { useAppContext } from '../../providers/AppContext'
import { Dialog, ModalDialog } from '../../types/ui/Dialogs'
import { ClaimEnergy } from './ClaimEnergy'
import { ButtonClaim, ButtonRegular, ButtonTransparent } from './Button'
import { Switch } from '@headlessui/react'
import { useShieldTimer } from '../../hooks/useShieldTimer'
import { ProgressBar } from './ProgressBar'
import Image from 'next/image'
import { HUDState } from '../../types/ui/HUDState'
import { Shield } from './Shield'
import { FrameCircleThin } from './FrameCircleThin'
import { HeroStats } from '../account/HeroStats'
import { HeroLevel } from './HeroLevel'

export const HeroBar = observer(() => {
  const { api, store, controller } = useAppContext()

  const { hero } = store.player

  useEffect(() => {
    if (hero?.id) {
      const interval = setInterval(async () => {
        await api.hero.fetchClaimableEnergy()
      }, 10000)

      api.hero.fetchClaimableEnergy()

      return () => clearInterval(interval)
    }
  }, [hero])

  if (!hero) {
    return <></>
  }

  const goal = hero.level * 1000

  return (
    <>
      {' '}
      {store.ui.isDialogOpen(Dialog.HERO_LEVEL) ? (
        <HeroLevel />
      ) : !store.ui.isDialogOpen(Dialog.SHIELD_OPTIONS) ? (
        <HeroBarContainer>
          <div className="absolute top-0 left-0 z-[2] h-[90px] w-[90px] -translate-x-[10px]  rounded-full ">
            <FrameCircleThin>
              <Image src="/assets/wizard.png" width={68} height={68} />
            </FrameCircleThin>
            <span className="absolute top-0 right-0 h-[30px] w-[30px] rounded-full border border-gold-70 bg-brown-800 text-center text-[18px] font-bold">
              {hero.level}
            </span>
          </div>
          <div className="pl-20 pt-4 font-bold">
            <p className="pb-2" onClick={() => console.log(hero.magic.tuple)}>
              {hero.name} <span className="opacity-60">#{hero.id}</span>
            </p>
            <div className="flex w-[111%] -translate-x-14 items-stretch">
              <ProgressBar
                className="flex-1"
                label={`Exp: ${hero.exp} / ${goal}`}
                labelHover="Click for stats"
                onClick={() => store.ui.openDialog(Dialog.HERO_LEVEL)}
                max={goal}
                value={hero.exp}
              />
              {hero.exp > goal && (
                <ButtonClaim
                  className={`progress-bar--gradient ml-[5px] inline-flex h-[30px] w-[64px] min-w-[initial] flex-col items-center justify-center border-[#03586E] px-0 py-0`}
                  onClick={() => {
                    store.ui.openDialog(Dialog.HERO_LEVEL)
                  }}
                >
                  <span className="">Lvl Up</span>
                </ButtonClaim>
              )}
            </div>
          </div>

          <div className="flex pt-3 pb-5 font-bold">
            <div className="pl-5 ">
              <p className="pb-[3px]">
                Energy:{' '}
                <span className="text-gold-100">
                  {ethers.utils.formatUnits(store.player.energy, 0)}
                </span>
              </p>
              <p>
                Claimable energy:{' '}
                <span className="text-gold-100">
                  {store.player.claimableEnergy}
                </span>
              </p>
            </div>
            <div className="flex flex-1 justify-end pr-6">
              <ClaimEnergy />
              <ButtonClaim
                className={`progress-bar--gradient ml-1 inline-flex h-[51px] w-[64px] min-w-[initial] flex-col items-center justify-center border-[#03586E] px-0 py-0`}
                onClick={() => {
                  store.ui.openDialog(Dialog.SHIELD_OPTIONS)
                }}
              >
                <span className="-translate-y-[2px]">
                  <Image
                    src="/assets/icons/dome.svg"
                    alt="shield"
                    width={40}
                    height={28}
                  />
                </span>
                <span className="-mt-[10px]">Shield</span>
              </ButtonClaim>
            </div>
          </div>
        </HeroBarContainer>
      ) : (
        <Shield />
      )}
    </>
  )
})

const HeroBarContainer: FC<FCChildren> = observer(({ children }) => {
  return (
    <div className="hero-bar-container fixed top-5 left-6 z-[100]">
      <div className=" flex flex-col p-2 text-white">{children}</div>
    </div>
  )
})
