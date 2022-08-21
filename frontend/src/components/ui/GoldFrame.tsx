import { FC, ReactNode } from 'react'

interface IProps {
  children?: ReactNode
  className?: string
}

export const GoldFrame: FC<IProps> = ({ children, className }) => {
  return (
    <div
      className={`dialog--framed relative bg-brown-primary/90 py-8 px-10 text-white ${
        className ? className : ''
      }`}
    >
      <div className="dialog--frame-top-corners"></div>
      <div className="dialog--frame-bottom-corners"></div>
      {children}
    </div>
  )
}
