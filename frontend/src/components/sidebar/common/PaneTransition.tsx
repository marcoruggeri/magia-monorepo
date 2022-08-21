import { Transition } from '@headlessui/react'
import { FC } from 'react'
import { Children } from '../../../../magiaTypes'

export const PaneTransition: FC<Children> = ({ children }) => (
  <Transition
    appear={true}
    show={true}
    enter="transition-all duration-200 delay-[80ms]"
    enterFrom="opacity-0 translate-y-1"
    enterTo="opacity-100 translate-x-0"
    leave="transition-opacity duration-150"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    {children}
  </Transition>
)
