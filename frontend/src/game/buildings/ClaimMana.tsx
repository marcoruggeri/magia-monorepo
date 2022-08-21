import { ethers } from 'ethers'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../providers/AppContext'
import { ActionButton } from 'src/components/ui/ActionButton'

export const ClaimMana = observer(() => {
  const { api, store } = useAppContext()

  let hasShrine

  if (store.land.selected) {
    hasShrine = store.land.selected.hasOwnManaShrine
  }

  const [claimableMana, setClaimableMana] = useState<any>()

  const getClaimableMana = async () => {
    if (store.player.hero && store.land.selected) {
      const diamond = store.contract.useSigned('diamond')
      // todo improve this mess
      const { res: getLastClaimed } = await diamond.getLastClaimedMana(
        store.land.selected.landId
      )
      if (getLastClaimed.toNumber() !== 0) {
        const { res: mana, err } = await diamond.getClaimableMana(
          store.land.selected.landId
        )
        if (!err) {
          setClaimableMana(mana)
        }
      }
    }
  }

  const claimMana = async () => {
    if (store.player.hero && store.land.selected) {
      const diamond = store.contract.useSigned('diamond')
      await diamond.claimMana(store.player.hero!.id, store.land.selected.landId)
      console.log('mana claimed')
      api.resource.getManaBalance()
      getClaimableMana()
    }
  }

  useEffect(() => {
    getClaimableMana()
  }, [store.player.hero, store.land.selected])

  return (
    <>
      {claimableMana && hasShrine && (
        <ActionButton onClick={() => claimMana()}>
          Claim {ethers.utils.formatUnits(claimableMana, 0)} Mana
        </ActionButton>
      )}
    </>
  )
})
