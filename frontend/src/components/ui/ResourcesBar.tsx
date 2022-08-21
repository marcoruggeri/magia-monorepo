import { ethers } from 'ethers'
import { observer } from 'mobx-react-lite'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import { FCChildren } from '../../../magiaTypes'
import { useAppContext } from '../../providers/AppContext'
import { GoldFrame } from './GoldFrame'
import { CoinGold } from './icons/CoinGold'
import { CoinLumber } from './icons/CoinLumber'
import { CoinMana } from './icons/CoinMana'
import { TransactionInProgress } from './TransactionInProgress'

export const ResourcesBar = observer(() => {
  const { store, api } = useAppContext()

  useEffect(() => {
    api.resource.getGoldBalance()
    api.resource.getLumberBalance()
    api.resource.getManaBalance()
  }, [])

  return store.player.hero ? (
    <ResourcesBarContainer>
      <p className="inline-flex h-full items-center pb-1">
        <span className="mr-2 translate-y-[2px]">
          <Image
            src="/assets/icons/gold.svg"
            width={25}
            height={26}
            alt="Gold"
          />
        </span>
        Gold: <span className="ml-1">{store.player.gold}</span>
      </p>
      <p className="inline-flex h-full items-center pb-1">
        <span className="mr-2 translate-y-[2px]">
          <Image
            src="/assets/icons/lumber.svg"
            width={25}
            height={26}
            alt="Lumber"
          />
        </span>
        Lumber: <span className="ml-1">{store.player.lumber}</span>
      </p>
      <p className="inline-flex h-full items-center pb-1">
        <span className="mr-2 translate-y-[2px]">
          <Image
            src="/assets/icons/mana.svg"
            width={25}
            height={26}
            alt="Mana"
          />
        </span>
        Mana: <span className="ml-1">{store.player.mana}</span>
      </p>
      <TransactionInProgress />
    </ResourcesBarContainer>
  ) : (
    <></>
  )
})

const ResourcesBarContainer: FC<FCChildren> = ({ children }) => {
  return (
    <div className="resources-bar-container fixed top-4 left-1/2 -translate-x-1/2 px-12 text-[16px]">
      <div className="flex h-full items-center justify-between font-bold">
        {children}
      </div>
    </div>
  )
}
