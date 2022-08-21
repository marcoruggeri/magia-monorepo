import { FC, useEffect, useMemo, useState } from 'react'
import leaderBoardLogo from '../../assets/icons/leaderboard-panel-logo.svg'
import { useAppContext } from '../../providers/AppContext'
import { Villain } from '../../models/Villain'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import Image from 'next/image'
import { SidebarContainer } from './common/SidebarContainer'
import { SidebarHeader } from './common/SidebarHeader'
import { Hero } from '../../models/Hero'

export const Leaderboard: FC = () => {
  const { store } = useAppContext()

  const leaderboard = store.hero.heroesRanked.slice(0, 10)

  return (
    <SidebarContainer>
      <div className="flex-vertical pr-3">
        <SidebarHeader
          title="Leaderboard"
          description="Find out who is the leader and where you are."
          Icon={() => (
            <Image
              src="/assets/icons/leaderboard-icon.svg"
              width={40}
              height={40}
              className="mt-2 block"
            />
          )}
        />

        <p className="border-b border-b-white/50 pb-2 text-center text-[20px] font-bold">
          Top 10
        </p>
        <div className="flex h-[100%] max-h-[100%] flex-1 flex-col pt-3">
          <div className="mb-1 flex px-3 text-[18px] font-bold">
            <span className="flex-[0_0_40px]">Nr.</span>
            <span className="flex-1">Name</span>
            <span className="ml-auto">Exp</span>
          </div>

          <div className="custom-scrollbar overflow-y-auto px-3">
            {leaderboard.map((hero: Hero, idx) => {
              return (
                <div
                  key={hero.id}
                  className="flex select-none pl-2 font-medium"
                >
                  <span className="flex-[0_0_40px] pr-5 text-right">
                    {idx + 1}
                  </span>
                  <span className="flex-1 ">
                    {hero.name}
                    <span className="opacity-50">#{hero.id}</span>
                  </span>
                  <span className="ml-auto">{hero.totalExp}</span>
                </div>
              )
            })}
          </div>

          <div className="text-md mt-auto flex border-t-2 border-t-gold-200 px-3 py-2 font-medium text-gold-100">
            <span className="flex-[0_0_40px] pr-5 text-right">
              {store.hero.heroRank}
            </span>
            <span className="flex-1 ">
              {store.player.hero?.name}#{store.player.heroId}
            </span>
            <span className="ml-auto">{store.player.hero?.totalExp}</span>
          </div>
        </div>
      </div>
    </SidebarContainer>
  )
}
