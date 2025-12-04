import { useCallback, useEffect, useState } from "react"

/**
 * @param {string | null} initialState
 * @param {string} key key to be used in URL query param
 * @returns {[string | null, React.Dispatch<React.SetStateAction<string | null>>]}
 */
export const useQueryParams = (initialState, key) => {
  const [state, setState] = useState(initialState)

  const onPopStateHandler = useCallback(() => {
    const params = new URLSearchParams(window.location.search)
    setState(params.get(key))
  }, [key])

  useEffect(() => {
    window.addEventListener("popstate", onPopStateHandler)
    return () => window.removeEventListener("popstate", onPopStateHandler)
  }, [onPopStateHandler])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setState(params.get(key))
  }, [setState, key])

  /**
   * @type {React.Dispatch<React.SetStateAction<string | null>>}
   */
  const setQueryParamState = (s) => {
    let next = null

    if (typeof s === "string" || s === null) next = s
    else next = s(state)

    const params = new URLSearchParams(window.location.search)
    if (next !== null) {
      params.set(key, next)
      window.history.pushState(null, "", "?" + params.toString())
    }

    setState(next)
  }

  return [state, setQueryParamState]
}
