import { observer } from 'mobx-react-lite'

import { SidebarContainer } from './common/SidebarContainer'

import { useAppContext } from '../../providers/AppContext'
import { useShieldTimer } from '../../hooks/useShieldTimer'
import { BuildingImage } from '../ui/BuildingImage'
import { UnitImage } from '../ui/UnitImage'
import { FC, useEffect, useMemo, useState } from 'react'
import { Unit } from '../../models/Unit'
import { SidebarHeader } from './common/SidebarHeader'
import { Children } from '../../../magiaTypes'
import { Tileset } from '../../../enums'

export const SelectedLandInfo = observer(() => {
  const { store } = useAppContext()
  const { selected } = store.land
  // const shieldRemaining = useShieldTimer(selected?.unitId)

  const tileType = useMemo(() => {
    if (!selected) {
      return ''
    }
    const key = Object.values(Tileset)[selected.landSpriteId]
    if (typeof key !== 'string') {
      return key
    }
    const lowercase = key.toLowerCase()
    return lowercase.substring(0, 1).toUpperCase() + lowercase.substring(1)
  }, [selected])

  if (!selected) {
    return <></>
  }

  const { unit } = selected
  const enemyUnit = store.land.potentialTarget?.unit

  const heroName = selected.heroId
    ? store.hero.byId.get(selected.heroId)?.name
    : false

  // const tileType = useMemo(() => {
  //   const key = Object.values(Tileset)[selected.landSpriteId]
  //   if (typeof key !== 'string') {
  //     return key
  //   }
  //   const lowercase = key.toLowerCase()
  //   return lowercase.substring(0, 1).toUpperCase() + lowercase.substring(1)
  // }, [selected])

  return (
    <div className="flex-vertical ">
      <SidebarContainer>
        <div className="">
          <SidebarHeader title="Selected" />
          <div className="-mt-4 flex items-start justify-between bg-brown-500/30 pl-6">
            <div className="min-h-[110px] pb-3 pt-4 pl-1 font-semibold">
              {heroName !== false && (
                <>
                  <p>
                    <span className="brightness-0 invert filter">
                      <FieldLabel>🏴</FieldLabel>
                    </span>
                    {heroName}{' '}
                    <span className="opacity-50">#{selected.heroId}</span>
                  </p>
                </>
              )}

              <p>
                <FieldLabel>Tile</FieldLabel>

                {tileType}
              </p>

              {selected.gold > 0 && (
                <p>
                  <FieldLabel>Gold</FieldLabel>
                  {selected.gold}
                </p>
              )}
              {selected.lumber > 0 && (
                <p>
                  <FieldLabel>Lumber</FieldLabel>
                  {selected.lumber}
                </p>
              )}
              {selected.mana > 0 && (
                <p>
                  <FieldLabel>Mana</FieldLabel>
                  {selected.mana}
                </p>
              )}

              <p>
                <FieldLabel> {'[x, y]'} </FieldLabel>[{selected.coords.gridX},
                {selected.coords.gridY}]
              </p>
              {store.debug.enabled && (
                <>
                  <p>
                    <FieldLabel>LandId</FieldLabel>
                    {selected.landId}
                  </p>
                </>
              )}
              {store.debug.enabled && selected.unitTokenId > 0 && (
                <p>
                  <FieldLabel>UnitId</FieldLabel>
                  {selected.unitTokenId}
                </p>
              )}
            </div>
            <div className="mt-4 -mb-10 mr-10">
              <BuildingImage
                sprite={selected.landSpriteId}
                className="block"
                width={64}
                height={64}
              />
            </div>
          </div>
          {/* unit */}
          {unit && (
            <div className="items-starts flex justify-between pl-6">
              <div className="pt-4 pl-1 pb-3 font-semibold">
                <p>
                  <FieldLabel>Unit</FieldLabel>
                  {unit.name}
                </p>
                <p>
                  <FieldLabel>Attack</FieldLabel>
                  {unit.attack}
                </p>
                <p>
                  <FieldLabel>Defense</FieldLabel>
                  {unit.defense}
                </p>
                <p>
                  <FieldLabel>Health</FieldLabel>
                  {unit.health}
                </p>
                <p>
                  <FieldLabel>Range</FieldLabel>
                  {unit.range}
                </p>

                {unit.shieldActive && <ShieldCountdown unit={unit} />}
              </div>
              <div className="mt-4 -mb-10 -ml-2 mr-9">
                <UnitImage
                  className="block"
                  sprite={unit.unitType}
                  width={80}
                  height={80}
                ></UnitImage>
              </div>
            </div>
          )}
          {enemyUnit && (
            <div>
              <header className="sidebar__panel__header border-t-2 border-t-gold-500  pt-5 pl-[25px] pr-[20px]">
                <h2 className="mb-0 font-serif font-bold">Targetting</h2>
              </header>
              <div className="items-starts -mt-2 flex justify-between pl-6">
                <div className="pl-1 pb-3 font-semibold">
                  <p>
                    <FieldLabel>Unit</FieldLabel>
                    {enemyUnit.name}
                  </p>
                  <p>
                    <FieldLabel>Attack</FieldLabel>
                    {enemyUnit.attack}
                  </p>
                  <p>
                    <FieldLabel>Defense</FieldLabel>
                    {enemyUnit.defense}
                  </p>
                  <p>
                    <FieldLabel>Health</FieldLabel>
                    {enemyUnit.health}
                  </p>
                  <p>
                    <FieldLabel>Range</FieldLabel>
                    {enemyUnit.range}
                  </p>

                  {enemyUnit.shieldActive && (
                    <ShieldCountdown unit={enemyUnit} />
                  )}
                </div>
                <div className="mt-4 -mb-10 -ml-2 mr-9">
                  <UnitImage
                    className="block"
                    sprite={enemyUnit.unitType}
                    width={80}
                    height={80}
                  ></UnitImage>
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarContainer>
    </div>
  )
})

const FieldLabel: FC<Children> = ({ children }) => (
  <span className="inline-block w-[85px] font-normal">{children}</span>
)

interface IShieldCountdownProps {
  unit: Unit
}
const ShieldCountdown: FC<IShieldCountdownProps> = observer(({ unit }) => {
  const [shieldTime, setShieldTime] = useState('')

  useEffect(() => {
    let shieldInt: any

    if (unit.shieldActive) {
      if (unit.shieldRemaining) {
        setShieldTime(unit.shieldRemaining)
      }

      shieldInt = setInterval(() => {
        if (unit.shieldRemaining) {
          setShieldTime(unit.shieldRemaining)
        } else {
          setShieldTime('')
          clearInterval(shieldInt)
        }
      }, 500)
    }

    return () => {
      if (shieldInt) {
        setShieldTime('')
        clearInterval(shieldInt)
      }
    }
  }, [unit, unit?.shieldActive])

  return (
    <p>
      <FieldLabel>Shield</FieldLabel>
      {shieldTime}
    </p>
  )
})
