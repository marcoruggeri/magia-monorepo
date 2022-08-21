import { useEffect, useState } from 'react'
import { Tile } from '../models/Tile'
import { Unit } from '../models/Unit'
import { useAppContext } from '../providers/AppContext'

export const useShieldTimer = (unit?: Unit) => {
  const { store } = useAppContext()
  const [shieldTime, setShieldTime] = useState('')

  useEffect(() => {
    let shieldInt: any

    if (unit?.shieldActive) {
      shieldInt = setInterval(() => {
        console.log('shielf int', unit.shieldRemaining)

        if (unit.shieldRemaining) {
          setShieldTime(unit.shieldRemaining)
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

  return shieldTime
}
