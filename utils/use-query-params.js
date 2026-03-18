import { useCallback, useEffect, useReducer, useRef, useState } from "react"

const listeners = new Set()

function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function notify() {
  listeners.forEach((fn) => fn())
}

// patch popstate once so the shared layer also hears browser back/forward
if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => notify())
}

/**
 * @param {string | null} initialState
 * @param {string} key key to be used in URL query param
 * @returns {[string | null, (value: string | null | ((prev: string | null) => string | null)) => void]}
 */
export const useQueryParam = (initialState, key) => {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return initialState
    return new URLSearchParams(window.location.search).get(key) ?? initialState
  })

  const stateRef = useRef(state)
  stateRef.current = state

  // subscribe to the shared notification channel
  useEffect(() => {
    return subscribe(() => {
      const next = new URLSearchParams(window.location.search).get(key)
      if (next !== stateRef.current) {
        setState(next)
      }
    })
  }, [key])

  const setQueryParamState = useCallback(
    (s) => {
      let next = null

      if (typeof s === "string" || s === null) next = s
      else next = s(stateRef.current)

      const params = new URLSearchParams(window.location.search)
      if (next !== null) {
        params.set(key, next)
      } else {
        params.delete(key)
      }
      window.history.pushState(null, "", "?" + params.toString())

      setState(next)
      notify()
    },
    [key]
  )

  return [state, setQueryParamState]
}

function paramsReducer(state, action) {
  if (action.type === "sync") {
    // action.next is an object of { key: value } for all tracked keys.
    // Return the same reference if nothing changed.
    let changed = false
    for (const k of Object.keys(action.next)) {
      if (state[k] !== action.next[k]) {
        changed = true
        break
      }
    }
    return changed ? { ...state, ...action.next } : state
  }

  if (action.type === "set") {
    if (state[action.key] === action.value) return state
    return { ...state, [action.key]: action.value }
  }

  return state
}

function readParams(keys) {
  const params = new URLSearchParams(window.location.search)
  const result = {}
  for (const key of keys) {
    result[key] = params.get(key)
  }
  return result
}

/**
 * @param {Record<string, string | null>} config  – { key: initialValue } pairs
 * @returns {[Record<string, string | null>, (key: string, value: string | null) => void]}
 */
export const useQueryParams = (config) => {
  const keysRef = useRef(Object.keys(config))

  const [values, dispatch] = useReducer(paramsReducer, config, (initial) => {
    if (typeof window === "undefined") return initial
    const fromUrl = readParams(Object.keys(initial))
    // url values take precedence over initial values.
    const merged = {}
    for (const key of Object.keys(initial)) {
      merged[key] = fromUrl[key] ?? initial[key]
    }
    return merged
  })

  const valuesRef = useRef(values)
  valuesRef.current = values

  useEffect(() => {
    return subscribe(() => {
      const next = readParams(keysRef.current)
      dispatch({ type: "sync", next })
    })
  }, [])

  const setParam = useCallback(
    /**
     * @param {string} key
     * @param {string | null} value
     */
    (key, value) => {
      const params = new URLSearchParams(window.location.search)
      if (value !== null) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      window.history.pushState(null, "", "?" + params.toString())

      dispatch({ type: "set", key, value })
      notify()
    },
    []
  )

  return [values, setParam]
}
