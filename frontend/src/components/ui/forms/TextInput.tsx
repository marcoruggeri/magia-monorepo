import { ChangeEventHandler, FC } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
  value?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  className?: string
}

export const TextInput: FC<Props> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  const defaultCls =
    'rounded-[3px] border-2 border-brown-500 bg-[#130602] px-[16px] py-[14px] text-[16px] placeholder:text-gold-100 block w-full'

  const cls = className ? twMerge(defaultCls, className) : defaultCls

  return (
    <input
      className={cls}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  )
}
