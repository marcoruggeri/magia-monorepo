import { FC, MouseEvent, ReactNode } from 'react'

interface IActionButton {
  onClick?: (e: MouseEvent<HTMLElement>) => void
  children?: ReactNode
  className?: string
}

export const ActionButton: FC<IActionButton> = ({
  onClick,
  children,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${className} mt-2 w-full border-2 border-brown-primary bg-brown-light p-2 text-lg font-bold text-black`}
    >
      {children}
    </button>
  )
}
