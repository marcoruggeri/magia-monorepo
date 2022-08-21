import { enableStaticRendering } from 'mobx-react-lite'
import { createContext, ReactNode, useContext } from 'react'
import { AppAPI } from '../api'
import { AppController } from '../controllers/app'
import { AppStore } from '../stores/app'

interface AppContextType {
  store: AppStore
  api: AppAPI
  controller: AppController
}

enableStaticRendering(typeof window === 'undefined')

let store: AppStore
let api: AppAPI
let controller: AppController

const AppContext = createContext<undefined | AppContextType>(undefined)

AppContext.displayName = 'AppContext'

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppContextProvider')
  }
  return context as AppContextType
}

export default AppContext

export function AppContextProvider({ children }: { children: ReactNode }) {
  const context = initializeContext()

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}

function initializeContext(): AppContextType {
  const _store = store ?? new AppStore()
  const _api = api ?? new AppAPI(_store)
  const _controller = controller ?? new AppController(_store, _api)

  // For SSG and SSR always create a new context
  if (typeof window === 'undefined')
    return {
      store: _store,
      api: _api,
      controller: _controller,
    }

  // Create the all once in the client
  if (!store) store = _store
  if (!api) api = _api
  if (!controller) controller = _controller

  return {
    store: _store,
    api: _api,
    controller: _controller,
  }
}
