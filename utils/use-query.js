import React, { createContext, useContext, useEffect, useState } from "react"

const QueryCacheContext = createContext(null)

/**
 * Caches query promises by key, so components that mount at the same time with
 * the same key share one in-flight request instead of each sending their own.
 */
export const QueryCacheProvider = ({ children }) => {
  const [cache] = useState(() => new Map())

  return (
    <QueryCacheContext.Provider value={cache}>
      {children}
    </QueryCacheContext.Provider>
  )
}

export const useQuery = ({ queryFn, queryKey }) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const cache = useContext(QueryCacheContext)
  if (!cache)
    throw new Error("You must use `useQuery` hook within `QueryCacheProvider`")

  useEffect(() => {
    let ignore = false

    setData(null)
    setIsLoading(true)
    setError(null)

    let promise = cache.get(queryKey)
    if (!promise) {
      promise = Promise.resolve().then(queryFn)
      cache.set(queryKey, promise)
      // Evict failures so the next mount retries instead of reusing the error
      promise.catch(() => {
        if (cache.get(queryKey) === promise) cache.delete(queryKey)
      })
    }

    promise.then(
      (data) => {
        if (ignore) return
        setData(data)
        setIsLoading(false)
      },
      (error) => {
        if (ignore) return
        setError(error.message)
        setIsLoading(false)
      }
    )

    return () => {
      ignore = true
    }

    // Don't rerender if queryFn is different, this can cause an endless render loop if
    // the component calling useQuery uses a closure like `queryFn: () => fetchFn(someLocalVar)`.

    // This could be fixed by wrapping the closure in a useCallback in the calling component
    // or including a dependency array in this hook. All should work fine if all the queryFn
    // depends on is included in the queryKey.

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey, cache])

  return { data, isLoading, error }
}
