import { twMerge } from 'tailwind-merge'
import { FC, ReactNode } from 'react'
import Image from 'next/image'

interface Props {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | undefined
  children?: ReactNode
  title?: string
}

export const Button: FC<Props> = ({
  children,
  onClick,
  disabled,
  className,
  title,
  type,
}) => {
  const defaultClassName = 'text-[14px] text-white'

  const cls = className
    ? twMerge(defaultClassName, className)
    : defaultClassName
  return (
    <button
      className={cls}
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  )
}

export const ButtonPrimary: FC<Props> = (props) => {
  const defaultClassName =
    ' rounded-[10px] border-green-450 bg-green-350 gradient from-[#949F60] to-[#545416] '

  const cls = props.className
    ? twMerge(defaultClassName, props.className)
    : defaultClassName

  const newProps = { ...props }
  delete newProps['className']
  return <ButtonRegular className={cls} {...newProps} />
}
export const ButtonSecondary: FC<Props> = (props) => {
  return (
    <Button className="rounded-[10px]  border-red-450 bg-red-350 " {...props} />
  )
}

export const ButtonRegular: FC<Props> = (props) => {
  const defaultClassName =
    'py-2 min-w-[158px] rounded-[8px] border-2 border-[#E4D399] bg-gradient-to-b from-gold-70 hover:from-gold-50 hover:to-gold-300 to-gold-500 disabled:opacity-70'

  const cls = props.className
    ? twMerge(defaultClassName, props.className)
    : defaultClassName

  const newProps = { ...props }
  delete newProps['className']

  return <Button className={cls} {...newProps} />
}

export const ButtonTransparent: FC<Props> = (props) => {
  const defaultClassName = 'bg-transparent from-transparent to-transparent'

  const cls = props.className
    ? twMerge(defaultClassName, props.className)
    : defaultClassName

  const newProps = { ...props }
  delete newProps['className']
  return <ButtonRegular className={cls} {...newProps} />
}

export const ButtonClaim: FC<Props> = (props) => {
  const defaultClassName =
    'py-2 min-w-[190px] font-semibold rounded-[8px] border-2 border-[#E4D399] bg-gradient-to-b from-gold-50 to-gold-300 disabled:opacity-70'

  const cls = props.className
    ? twMerge(defaultClassName, props.className)
    : defaultClassName

  const newProps = { ...props }
  delete newProps['className']

  return <Button className={cls} {...newProps} />
}

export const ButtonCancel: FC<Props> = (props) => {
  const defaultClassName = 'min-w-[170px] border-red-450 bg-red-350'

  const cls = props.className
    ? twMerge(defaultClassName, props.className)
    : defaultClassName

  const newProps = { ...props }
  delete newProps['className']

  return <ButtonRegular className={cls} {...newProps} />
}

export const ButtonTriangle: FC<Props> = (props) => {
  const defaultClassName = 'p-2 disabled:opacity-70'

  const cls = props.className
    ? twMerge(defaultClassName, props.className)
    : defaultClassName

  const newProps = { ...props }
  delete newProps['className']

  return (
    <button
      className={cls}
      onClick={props.onClick}
      type={props.type}
      disabled={props.disabled}
      title={props.title}
    >
      <Image
        src="/assets/ui/buttons/caret-left.svg"
        width={12}
        height={24}
        alt={props.title}
      />
    </button>
  )
}
