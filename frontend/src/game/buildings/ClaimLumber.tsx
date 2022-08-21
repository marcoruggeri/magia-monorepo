import { ethers } from 'ethers'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../providers/AppContext'
import { ActionButton } from 'src/components/ui/ActionButton'

export const ClaimLumber = observer(() => {
  const { api, store } = useAppContext()

  let hasLumbermill

  if (store.land.selected) {
    hasLumbermill = store.land.selected.hasOwnLumbermill
  }

  const [claimableLumber, setClaimableLumber] = useState<any>()

  const getClaimableLumber = async () => {
    if (store.player.hero && store.land.selected) {
      const diamond = store.contract.useSigned('diamond')
      // todo improve this mess
      const { res: getLastClaimed } = await diamond.getLastClaimedLumber(
        store.land.selected.landId
      )
      if (getLastClaimed.toNumber() !== 0) {
        const { res: lumber } = await diamond.getClaimableLumber(
          store.land.selected.landId
        )
        setClaimableLumber(lumber)
      }
    }
  }

  const claimLumber = async () => {
    if (store.player.hero && store.land.selected) {
      const diamond = store.contract.useSigned('diamond')
      await diamond.claimLumber(
        store.player.hero!.id,
        store.land.selected.landId
      )

      api.resource.getLumberBalance()
      getClaimableLumber()
    }
  }

  useEffect(() => {
    getClaimableLumber()
  }, [store.player.hero, store.land.selected])

  return (
    <>
      {claimableLumber && hasLumbermill && (
        <ActionButton onClick={() => claimLumber()}>
          Claim {ethers.utils.formatUnits(claimableLumber, 0)} Lumber
        </ActionButton>
      )}
    </>
  )
})
