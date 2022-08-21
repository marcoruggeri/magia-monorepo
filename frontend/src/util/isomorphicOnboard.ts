import Onboard from 'bnc-onboard'

// not used atm. we are calling onboard from a useEffect hook instead to save having to mock the object or ignore types
export const isomorphicOnboard =
  typeof window !== 'undefined'
    ? Onboard
    : () => ({ getState: () => ({ address: null }) })
