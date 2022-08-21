import { observer, useLocalObservable } from 'mobx-react'
import Image from 'next/image'
import { FC, useEffect } from 'react'
import { $enum } from 'ts-enum-util'
import { MagicType } from '../../../enums'
import { MagicStatsTuple } from '../../../magiaTypes'
import { MagicStatsStore } from '../../models/Hero'

interface Props {
  total: number
  points?: MagicStatsTuple
  basePoints?: MagicStatsTuple
  onChange: (points: MagicStatsTuple) => void
}

export const MagicPoints: FC<Props> = observer(
  ({ total, onChange, points, basePoints }) => {
    const stats = useLocalObservable(() => new MagicStatsStore())
    const remaining = total - stats.totalPoints

    useEffect(() => {
      if (points) {
        stats.loadMagicStats(points)
      }
    }, [points])

    return (
      <div className="mx-auto flex max-w-[560px] justify-between">
        {$enum(MagicType).map((magic, _, __, idx) => {
          return (
            <Point
              key={magic}
              magic={magic}
              base={basePoints ? basePoints[idx] : undefined}
              pool={remaining}
              value={stats.get(magic)}
              onChange={(val: number) => {
                stats.set(magic, val)
                onChange(stats.tuple)
              }}
            />
          )
        })}
      </div>
    )
  }
)

interface IPointProps {
  magic: MagicType
  value: number
  pool: number
  base?: number
  onChange: (val: number) => void
}
const Point: FC<IPointProps> = observer(
  ({ pool, magic, onChange, value, base }) => {
    const Icon = $enum.visitValue(magic).with({
      [MagicType.WHITE]: () => () =>
        (
          <Image
            src="/assets/icons/magic/magic-white-icon.svg"
            width={19}
            height={22}
          />
        ),
      [MagicType.BLACK]: () => () =>
        (
          <Image
            src="/assets/icons/magic/magic-black-icon.svg"
            width={19}
            height={22}
          />
        ),
      [MagicType.FIRE]: () => () =>
        (
          <Image
            src="/assets/icons/magic/magic-fire-icon.svg"
            width={13}
            height={20}
          />
        ),
      [MagicType.WATER]: () => () =>
        (
          <Image
            src="/assets/icons/magic/magic-water-icon.svg"
            width={13}
            height={20}
          />
        ),
      [MagicType.EARTH]: () => () =>
        (
          <Image
            src="/assets/icons/magic/magic-earth-icon.svg"
            width={16}
            height={16}
          />
        ),
    })

    return (
      <div className="text-center">
        <div className="flex justify-center">
          <div className="relative flex h-[54px] w-[54px] items-center justify-center">
            <div className="absolute inset-0">
              <Image
                src="/assets/ui/magic-point-frame.svg"
                width={54}
                height={54}
              />
              {/* {base !== undefined && (
                // <p className="absolute left-1/2 top-1/2 z-10 w-[20px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ECAB2C] font-bold text-[#C86800]">
                //   {base}
                // </p>
              )} */}
            </div>

            <Icon />
          </div>
        </div>
        <p className="mt-3 mb-1 text-[18px] font-bold">
          {magic} {base !== undefined && <span>({base})</span>}
        </p>

        <NumberInputWithQtyAdjust
          update={onChange}
          min={0}
          max={value + pool}
          value={value}
        />
      </div>
    )
  }
)

interface NumberInputProps {
  value: number
  max: number
  min: number
  update: (n: number) => void
}

export const NumberInputWithQtyAdjust: FC<NumberInputProps> = observer(
  ({ value, max, min, update }) => {
    return (
      <p className="mb-1 flex max-w-[88px] border-b-2 border-b-brown-500">
        <button
          className="-ml-1 px-2 text-3xl font-bold text-gold-100 disabled:text-white disabled:opacity-60"
          onClick={() => update(value - 1)}
          disabled={value <= min}
        >
          -
        </button>
        <input
          className="w-[40px] bg-transparent p-2 text-center font-semibold text-white"
          type="number"
          max={max}
          min={min}
          value={value}
          onChange={(e) => {
            const value = parseInt(e.target.value)
            if (value >= min && value <= max) {
              update(value)
            } else if (e.target.value === '') {
              update(0)
            }
          }}
        />
        <button
          className="-mr-1 px-2 text-2xl font-bold text-gold-100 disabled:text-white disabled:opacity-60"
          onClick={() => update(value + 1)}
          disabled={value >= max}
        >
          +
        </button>
      </p>
    )
  }
)
