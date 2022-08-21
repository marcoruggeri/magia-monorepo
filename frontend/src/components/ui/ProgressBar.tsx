import { observer } from 'mobx-react-lite'
import { FC } from 'react'

interface Props {
  label: string
  labelHover?: string
  onClick?: () => void
  value: number | string
  max?: number | string
  className?: string
}

export const ProgressBar: FC<Props> = observer(
  ({ label, labelHover, value, max, className, onClick }) => {
    if (!max) {
      max = 100
    }

    const percentage = (Number(value) / Number(max)) * 100

    return (
      <div className={className} onClick={onClick}>
        <div
          className={`group relative flex h-[30px] 
          select-none items-center justify-center overflow-hidden rounded-md border-2 border-[#03586E] bg-[#023947] ${
            onClick && 'cursor-pointer'
          }`}
        >
          <div
            className="progress-bar--gradient absolute top-0 left-0 h-full border border-r-0 border-[#03586E] transition-all duration-300"
            style={{ width: `${percentage}%` }}
          >
            <span className="progress-bar--separator"></span>
          </div>

          <span
            className="relative text-[15px] text-white "
            style={{ textShadow: '1px 3px 10px rgba(0,0,0,1)' }}
          >
            {label && (
              <span className={labelHover && 'group-hover:hidden'}>
                {label}
              </span>
            )}
            {labelHover && (
              <span className="hidden group-hover:block">{labelHover}</span>
            )}
          </span>
        </div>
      </div>
    )
  }
)
