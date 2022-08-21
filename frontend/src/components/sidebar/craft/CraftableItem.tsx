import { observer } from 'mobx-react'
import { FC, useState } from 'react'
import { ButtonRegular, ButtonTransparent } from '../../ui/Button'
import goldIcon from '../../../assets/icons/gold.svg'
import lumberIcon from '../../../assets/icons/lumber.svg'
import manaIcon from '../../../assets/icons/mana.svg'
import Image from 'next/image'

export interface ICraftableItem {
  name: string
  image: JSX.Element
  goldCost: number
  lumberCost: number
  manaCost: number
  requirement?: string
  craftTime: number
  craftFunction: () => Promise<void>
  disabled?: boolean | string
}

export const CraftableItem = observer(({ item }: { item: ICraftableItem }) => {
  const [open, setOpen] = useState(false)
  const [crafted, setCrafted] = useState(false)

  const handleCraft = async () => {
    setCrafted(true)
    await item.craftFunction()
  }

  const handleToggle = () => {
    setOpen((s) => !s)
    // if we were closed then leave it at that
    if (!open) {
      return
    }

    // if we were open then clear the crafted status
    setCrafted(false)
  }

  return (
    <div
      className={`cursor-pointer select-none pb-1 pl-[25px] pr-[30px] ${
        !open && 'hover:bg-brown-light/10'
      }`}
    >
      <div
        key={item.name}
        className="flex items-start pt-3 pb-2 "
        onClick={handleToggle}
      >
        <div className="mr-[18px] w-[35%]">{item.image}</div>
        <div className="flex w-[65%] flex-col">
          <p className="text-md mb-2 text-[18px] font-bold">{item.name}</p>
          <div className=" grid grid-cols-3 gap-2">
            <span className="flex items-center break-all ">
              <img
                src={goldIcon.src}
                className="mr-2 max-h-[18px]"
                alt="Gold"
              />{' '}
              {item.goldCost}
            </span>
            <span className="col-span-2 flex items-center break-all">
              <img
                src={manaIcon.src}
                className="mr-2 max-h-[18px]"
                alt="Mana potion"
              />{' '}
              {item.manaCost}
            </span>
            <span className=" flex items-center break-all">
              <img
                src={lumberIcon.src}
                className="mr-2 max-h-[18px]"
                alt="Lumber"
              />{' '}
              {item.lumberCost}
            </span>
            <span className="col-span-2 hidden break-all">
              Craft Time: {item.craftTime}
            </span>
            {item.requirement && (
              <span className="col-span-2 -ml-[3px] flex items-center ">
                <Image
                  src="/assets/icons/craft-icon.svg"
                  width={18}
                  height={18}
                />
                <span className="ml-2 first-letter:capitalize">
                  {item.requirement}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
      {open && (
        <div className="mt-3 flex justify-start pb-1">
          <CraftItemButtons
            handleCraft={handleCraft}
            handleToggle={handleToggle}
            disabled={item.disabled}
            crafted={crafted}
          />
        </div>
      )}
    </div>
  )
})

interface ICraftItemButtons {
  disabled?: boolean | string

  crafted: boolean
  handleCraft: () => void
  handleToggle: () => void
}
const CraftItemButtons: FC<ICraftItemButtons> = ({
  disabled,
  crafted,
  handleCraft,
  handleToggle,
}) => {
  if (disabled) {
    return <p>{disabled}</p>
  }

  if (crafted) {
    return (
      <>
        <ButtonRegular className="mr-3" onClick={handleCraft}>
          Craft Again
        </ButtonRegular>
        <ButtonTransparent onClick={handleToggle}>Done</ButtonTransparent>
      </>
    )
  }

  return (
    <>
      <ButtonRegular className="mr-3" onClick={handleCraft}>
        Craft
      </ButtonRegular>
      <ButtonTransparent onClick={handleToggle}>Cancel</ButtonTransparent>
    </>
  )
}
