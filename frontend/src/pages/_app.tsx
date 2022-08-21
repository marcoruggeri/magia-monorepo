import '../../styles/globals.css'
import type { AppProps } from 'next/app'
import { AppContextProvider } from '../providers/AppContext'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <Component {...pageProps} />
    </AppContextProvider>
  )
}

export default MyApp
