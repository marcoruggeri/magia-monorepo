import { ethers } from 'ethers'
import { observer } from 'mobx-react-lite'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../providers/AppContext'
import { ButtonClaim } from './Button'

export const ClaimEnergy = observer(() => {
  const { api, store } = useAppContext()

  const claimEnergy = async () => {
    const heroes = store.contract.useSigned('heroes')
    if (store.player.hero) {
      await heroes.claimEnergy(store.player.hero!.id)

      await api.hero.getEnergy()
    }
  }

  return store.player.hero ? (
    <>
      <ButtonClaim
        onClick={() => claimEnergy()}
        className={`ml-auto inline-flex h-[51px] w-[64px] min-w-[initial] flex-col items-center justify-center px-0 py-0`}
      >
        <Image
          src="/assets/icons/flash.svg"
          alt="claim energy"
          width={12}
          height={18}
        />
        <span className="mt-[1px]">Claim</span>
      </ButtonClaim>
    </>
  ) : (
    <></>
  )
})
