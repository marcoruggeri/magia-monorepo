import { ethers } from 'ethers'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../providers/AppContext'
import { ActionButton } from 'src/components/ui/ActionButton'

export const ClaimGold = observer(() => {
  const { api, store } = useAppContext()

  let hasGoldMine

  if (store.land.selected) {
    hasGoldMine = store.land.selected.hasOwnGoldmine
  }

  const [claimableGold, setClaimableGold] = useState<any>()

  const getClaimableGold = async () => {
    if (store.player.hero && store.land.selected) {
      const diamond = store.contract.useSigned('diamond')
      // todo improve this mess
      const { res: getLastClaimed } = await diamond.getLastClaimedGold(
        store.land.selected.landId
      )
      if (getLastClaimed.toNumber() !== 0) {
        const { res: gold } = await diamond.getClaimableGold(
          store.land.selected.landId
        )
        setClaimableGold(gold)
      }
    }
  }

  const claimGold = async () => {
    if (store.player.hero && store.land.selected) {
      const diamond = store.contract.useSigned('diamond')
      await diamond.claimGold(store.player.hero!.id, store.land.selected.landId)
      api.resource.getGoldBalance()
      getClaimableGold()
    }
  }

  useEffect(() => {
    getClaimableGold()
  }, [store.player.hero, store.land.selected])

  return (
    <>
      {claimableGold && hasGoldMine && (
        <ActionButton onClick={() => claimGold()}>
          Claim {ethers.utils.formatUnits(claimableGold, 0)} Gold
        </ActionButton>
      )}
    </>
  )
})
