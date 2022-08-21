import { FC } from 'react'

interface Props {
  ids: string[]
  activeId: string
  setActive: (id: string) => void
}

export const Tabs: FC<Props> = ({ ids, activeId, setActive }) => {
  return (
    <div className="mt-5 flex items-center justify-between">
      {ids.map((id) => {
        const active = id === activeId
        return (
          <button
            key={id}
            className={`
                  flex-1 border-b pb-2 text-center text-lg first:pl-3 last:pr-2
                  ${
                    active
                      ? 'border-b-[3px] border-b-gold-100 font-bold'
                      : 'border-b-white/50'
                  }
                `}
            onClick={() => setActive(id)}
          >
            {id}
          </button>
        )
      })}
    </div>
  )
}
