import { observer } from 'mobx-react-lite'
import { FC, useState } from 'react'
import { useAppContext } from '../../providers/AppContext'
import { Toast } from '../../types/ui/Toast'

export const Toasts = observer(() => {
  const { store } = useAppContext()

  return (
    <div className="fixed left-1/2 top-[130px] z-10 -translate-x-1/2 list-none">
      {store.ui.toasts.map((t, idx) => (
        <ToastItem key={idx + t.message.substring(0, 16)} toast={t} />
      ))}
    </div>
  )
})

interface IToastProps {
  toast: Toast
}
const ToastItem: FC<IToastProps> = ({ toast }) => {
  const [showData, setShowData] = useState(false)
  const { controller } = useAppContext()

  const action = showData ? 'hide' : 'show'

  return (
    <li className="mt-2 min-w-[530px] max-w-[650px] bg-brown-primary py-1 px-4 text-brown-light">
      <div className="flex">
        <p className="flex items-center justify-between">{toast.message} </p>
        {toast.data && (
          <button
            onClick={() => setShowData((d) => !d)}
            className="mx-auto cursor-pointer select-none text-sm hover:underline"
          >
            {action} data
          </button>
        )}
        <button
          onClick={() => controller.hud.clearToast(toast)}
          className="cursor-pointer select-none text-sm hover:underline"
        >
          dismiss
        </button>
      </div>
      {toast.data && showData && (
        <pre className="mt-4 whitespace-pre-wrap py-2">
          {JSON.stringify(toast.data, undefined, 2)}
        </pre>
      )}
    </li>
  )
}
