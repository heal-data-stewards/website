import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

const QueryCacheContext = createContext({})

export const QueryCacheProvider = ({ children }) => {
  const [cache, setCache] = useState(new Map())

  const get = useCallback((key) => cache.get(key), [cache])

  const set = useCallback(
    (key, value) => {
      setCache((prev) => {
        const next = new Map(prev)
        next.set(key, value)
        return next
      })
    },
    [setCache]
  )

  return (
    <QueryCacheContext.Provider value={{ get, set }}>
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

    ;(async () => {
      setData(null)
      setIsLoading(true)
      setError(null)

      const cachedData = cache.get(queryKey)
      if (cachedData) {
        setData(cachedData)
        setIsLoading(false)
        return
      }

      try {
        const data = await queryFn()

        if (ignore) return

        cache.set(queryKey, data)
        setData(data)
        setIsLoading(false)
      } catch (error) {
        setError(error.message)
        setIsLoading(false)
      }
    })()

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
