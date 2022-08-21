import { observer } from 'mobx-react-lite'
import { useAppContext } from '../../providers/AppContext'
import { ButtonRegular } from './Button'

export const OwnLandNav = observer(() => {
  const { store, controller } = useAppContext()

  return (
    <>
      {store.player.hero && store.land.ownLand && (
        <div className="col-span-2 flex">
          <ButtonRegular
            onClick={controller.map.panToPrevOwnLand}
            className="min-w-[100px] flex-[0_0_100px] rounded-r-none border-r-0 py-0"
          >
            {'<'}
          </ButtonRegular>

          <ButtonRegular
            onClick={controller.map.panToNextOwnLand}
            className="flex-1 rounded-none border-l-0 border-r-0 bg-brown-primary/80 py-0 disabled:opacity-100"
            disabled={true}
          >
            My lands
          </ButtonRegular>
          <ButtonRegular
            onClick={controller.map.panToNextOwnLand}
            className="min-w-[100px] flex-[0_0_100px] rounded-l-none border-l-0 py-0"
          >
            {'>'}
          </ButtonRegular>
        </div>
      )}
    </>
  )
})
