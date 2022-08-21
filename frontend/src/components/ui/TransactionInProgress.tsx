import { Transition } from '@headlessui/react'
import { observer } from 'mobx-react-lite'
import { useAppContext } from '../../providers/AppContext'
import { LoadingSpinner } from './LoadingSpinner'

export const TransactionInProgress = observer(() => {
  const {
    store: { ui },
  } = useAppContext()

  return ui.transactions.length ? (
    <div className="label-sm absolute -bottom-3  left-1/2 -translate-x-1/2  translate-y-1/2 pl-3 pr-4 ">
      <div className="flex items-center">
        <span className="mr-3 block animate-spin">
          <LoadingSpinner width={16} />
        </span>
        <div>
          {ui.transactions.map((t) => (
            <Transition
              key={t.id}
              appear={true}
              show={true}
              enter="transition-opacity transition-translate duration-200"
              enterFrom="opacity-0 translate-x-4"
              enterTo="opacity-100 translate-x-0"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <span className="block">{t.label}</span>
            </Transition>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
})
