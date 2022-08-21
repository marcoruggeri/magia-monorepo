import { autorun, toJS } from 'mobx'

const locals: any[] = []

export function makeLocalStorage<T extends object, K extends keyof T>(
  obj: T,
  prefix: string,
  keys: K[]
): void {
  if (typeof localStorage == 'undefined') {
    return
  }

  locals.push({ obj, prefix, keys })

  autorun(() => {
    for (const key of keys) {
      const localKey = `${prefix}_${key}`

      localStorage.setItem(localKey, JSON.stringify(toJS(obj[key])))
    }
  })
}

const loadLocal = ({
  obj,
  prefix,
  keys,
}: {
  obj: any
  prefix: string
  keys: any
}) => {
  for (const key of keys) {
    const localKey = `${prefix}_${key}`

    const valueStr = localStorage.getItem(localKey)

    if (!valueStr) {
      continue
    }

    const value = JSON.parse(valueStr)
    console.log('hey in MLS', value)
    obj[key] = value
  }
}

export const loadLocals = () => {
  locals.forEach((l) => loadLocal(l))
}
