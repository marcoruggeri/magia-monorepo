import { observer } from 'mobx-react-lite'
import Image from 'next/image'
import { createRef, MouseEvent, useState } from 'react'
import { miniMapRectToMap } from '../../lib/utils/mapRectToMiniMap'
import { useAppContext } from '../../providers/AppContext'
import { HUDState } from '../../types/ui/HUDState'
// import { MintHeroDemo } from '../account/MintHero'
import { HUDSidebar } from '../sidebar/HUDSidebar'
import { ButtonTriangle } from './Button'
import { HeroBar } from './HeroBar'
import { ResourcesBar } from './ResourcesBar'
import { Toasts } from './Toasts'
import { Transmute } from './Transmute'

export const HUD = observer(() => {
  // TODO: set phaser game.input.disabled whenever a
  // modal is open so we cant trigger UI under the modal
  return (
    <>
      <HeroBar />
      <HUDSidebar />
      <ModeBar />
      <Toasts />
      <ResourcesBar />
      <MinimapFrame />
      <Transmute />
    </>
  )
})

const ModeBar = observer(() => {
  const {
    store: { ui },
    controller,
  } = useAppContext()

  if (ui.HUDState == HUDState.MAP) {
    return <></>
  }

  return (
    <div
      className={`fixed bottom-2 left-1/2 flex ${
        ui.hasHUDCleanupTasks ? '-translate-x-1/3' : '-translate-x-1/2'
      }`}
    >
      <div className="label-sm  z-10  p-2">
        <p>{ui.HUDState}</p>
      </div>
      {ui.HUDState === HUDState.CAST_PYROBLAST_CONFIRM && (
        <button
          className="label-sm ml-1 cursor-pointer select-none  border-[#E4D399] bg-gradient-to-b from-gold-50 to-gold-300 !px-4 transition-transform hover:-translate-y-1"
          onClick={controller.magic.castPyroblast}
        >
          Fire
        </button>
      )}
      {ui.hasHUDCleanupTasks && (
        <button
          className="label-sm ml-1 cursor-pointer select-none  border-[#E4D399] bg-gradient-to-b from-gold-50 to-gold-300 !px-4 transition-transform hover:-translate-y-1"
          onClick={ui.revertHUDState}
        >
          Cancel
        </button>
      )}
    </div>
  )
})

export interface ICameraRect {
  x: number
  y: number
  width: number
  height: number
}

const MinimapFrame = observer(() => {
  const {
    // controller: {
    //   map: {
    //     modX,
    //     modY,
    //     modWidth,
    //     modHeight,
    //     setModX,
    //     setModY,
    //     setModWidth,
    //     setModHeight,
    //   },
    // },
    controller,
    store: {
      ui: { minimapRect },
      game,
    },
  } = useAppContext()

  const minimapRef = createRef<HTMLDivElement>()

  const handleMinimapClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!minimapRef.current) {
      return
    }
    const bounds = minimapRef.current.getBoundingClientRect()
    const x = e.clientX - bounds.left
    const y = e.clientY - bounds.top
    const { width, height } = minimapRect
    game?.events.emit('MINIMAP_MOVE', miniMapRectToMap({ x, y, width, height }))
  }

  const [dragging, setDragging] = useState(false)

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setDragging(true)
    handleMinimapClick(e)
  }

  const cancelDragging = () => {
    setDragging(false)
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (dragging) {
      handleMinimapClick(e)
    }
  }

  return (
    <div className="fixed bottom-6 left-5">
      {/* <div className="absolute bottom-[110%] left-0">
        <input
          type="text"
          value={modX}
          className="mb-1 text-black"
          onChange={(e) => setModX(parseInt(e.target.value))}
        />
        <input
          type="text"
          value={modY}
          className="mb-1 text-black"
          onChange={(e) => setModY(parseInt(e.target.value))}
        />
        <input
          type="text"
          value={modWidth}
          className="mb-1 text-black"
          onChange={(e) => setModWidth(parseInt(e.target.value))}
        />
        <input
          type="text"
          value={modHeight}
          className="mb-1 text-black"
          onChange={(e) => setModHeight(parseInt(e.target.value))}
        />
      </div> */}
      <Image
        src="/assets/ui/minimap-frame.png"
        width={260}
        height={220}
        className="minimap-frame"
      />
      <div className="absolute inset-0 p-6">
        <div
          className="relative h-full w-full"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={cancelDragging}
          onMouseLeave={cancelDragging}
          ref={minimapRef}
        >
          <div
            className="absolute border border-white/60 bg-brown-450/30"
            style={{
              width: `${minimapRect.width}px`,
              height: `${minimapRect.height}px`,
              left: `${minimapRect.x}px`,
              top: `${minimapRect.y}px`,
            }}
          ></div>
        </div>
      </div>
      <div className="absolute top-0 left-1/2 flex -translate-x-1/2 -translate-y-[30%] items-start">
        <ButtonTriangle
          className="-translate-y-1"
          onClick={controller.map.panToPrevOwnLand}
        />

        <span className="image-block-hack block overflow-hidden rounded-full backdrop-blur-md">
          <Image
            src="/assets/icons/map-icon.svg"
            width={80}
            height={80}
            alt="Map Icon"
          />
        </span>

        <ButtonTriangle
          className="-translate-y-1 -scale-x-100"
          onClick={controller.map.panToNextOwnLand}
        />
      </div>
    </div>
  )
})
