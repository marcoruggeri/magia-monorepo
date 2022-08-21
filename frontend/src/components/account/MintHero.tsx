import { Dialog } from '@headlessui/react'
import { observer } from 'mobx-react-lite'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import { MagicStatsTuple } from '../../../magiaTypes'
import { useAppContext } from '../../providers/AppContext'
import { MagicPoints } from '../common/MagicPoints'
import { ButtonRegular } from '../ui/Button'
import { TextInput } from '../ui/forms/TextInput'
import { LoginManagerStep, LoginStepProps } from './LoginManager'

export const MintHero: FC<LoginStepProps> = observer(({ setStep }) => {
  const { api, store } = useAppContext()

  // have we checked that a hero wasn't already minted?
  const [loaded, setLoaded] = useState(false)

  const [isMinting, setIsMinting] = useState(false)

  useEffect(() => {
    const checkHero = async () => {
      // init the mint/register flow
      await api.hero.fetchPlayerHero()
      if (store.player.hero) {
        setStep(LoginManagerStep.REGISTER_HERO)
      }

      setLoaded(true)
    }

    checkHero()
  }, [])

  const [name, setName] = useState('')

  const max = 20

  const [error, setError] = useState('')

  const [points, setPoints] = useState<MagicStatsTuple>([0, 0, 0, 0, 0])

  const handlePointChange = (p: MagicStatsTuple) => {
    setPoints(p)
    if (error) {
      setError('')
    }
  }

  const remain =
    max -
    points.reduce((acc: number, val: number) => {
      return acc + val
    }, 0)

  const mint = async () => {
    if (!name) {
      setError('Give your wizard a name')
      return
    }
    if (remain) {
      setError('You must assign all your points')
      return
    }

    const input = {
      magic: points,
      name,
    }

    setIsMinting(true)
    const { err } = await api.hero.mint(input)
    setIsMinting(false)
    if (err) {
      // failed to mint
      return
    }

    // success
    setStep(LoginManagerStep.REGISTER_HERO)
  }

  const rng = () => {
    // how to split?
    const splitType = Math.floor(Math.random() * 3)
    // how many picks do we want?
    const choicesN = 4
    // how many have we made?
    let choices = 0
    const nextPoints = [0, 0, 0, 0, 0]

    switch (splitType) {
      // non-exclusive
      case 1:
        while (choices < choicesN) {
          const idx = Math.floor(Math.random() * nextPoints.length)
          nextPoints[idx] += 5
          choices++
        }
        break
      // exclusive
      case 2:
        const choicesMade: number[] = []
        while (choices < choicesN) {
          const idx = Math.floor(Math.random() * nextPoints.length)
          if (!choicesMade.includes(idx)) {
            choicesMade.push(idx)
            nextPoints[idx] = 5
            choices++
          }
        }
        break
      // one shot
      case 0:
        const idx = Math.floor(Math.random() * nextPoints.length)
        nextPoints[idx] = 20
        break

      default:
        break
    }
    handlePointChange(nextPoints)
  }

  if (!loaded) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="heading-level-2">Checking for Hero...</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <Dialog.Title>
        <span className="my-4 block text-center font-serif text-[40px] font-bold">
          Mint Your Wizard
        </span>
      </Dialog.Title>

      <p className="my-6 mx-auto max-w-[500px]  ">
        <TextInput
          value={name}
          onChange={(e) => {
            if (error) {
              setError('')
            }
            setName(e.target.value)
          }}
          placeholder="Wizard name..."
        />
      </p>
      <div className="mb-4 flex items-end justify-center">
        <Image src="/assets/icons/mp.svg" width={60} height={61} />
        <p className="ml-4 font-serif text-[26px] font-bold tracking-tight text-green-120">
          Magic Points
        </p>
      </div>

      <div className="mb-6 text-center">
        <Dialog.Description>
          You have <span className="text-2xl ">{remain}</span> points left to
          assign
        </Dialog.Description>
      </div>
      <MagicPoints total={max} onChange={handlePointChange} points={points} />
      <div className="my-5 text-center">
        {error ? (
          <p className="mx-auto max-w-[320px] border-2 border-red-400 py-2">
            {error}
          </p>
        ) : (
          <>
            <p>
              Each type of magic has a spell requiring a minimum level 5, 10,
              20.
            </p>
            <p>You'll earn more points to spend as you level up</p>
          </>
        )}
      </div>
      <div className="relative flex justify-center">
        <ButtonRegular
          onClick={mint}
          className="w-[270px] py-3 text-[18px]"
          disabled={isMinting}
        >
          {isMinting ? 'minting..' : 'Mint Wizard'}
        </ButtonRegular>
        <button className="absolute bottom-[2px] right-[114px] " onClick={rng}>
          <Image src="/assets/icons/shuffle.png" width={40} height={40} />
        </button>
      </div>
    </div>
  )
})
