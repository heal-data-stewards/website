import { CircularProgress } from "@mui/material"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useQuery } from "utils/use-query"

export function InfiniteScrollList({
  fetchFunction,
  searchTerm,
  renderItem,
  filterFunction,
  filters,
  activeItemIndex,
  onActiveItemChange,
  getCountDisplay,
  onFilteredItemsChange,
  renderFilters,
  panelId,
}) {
  const [allLoadedItems, setAllLoadedItems] = useState([])
  const [currentOffset, setCurrentOffset] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [totalCount, setTotalCount] = useState(null)
  const [hasMorePages, setHasMorePages] = useState(true)
  const [fullApiResponse, setFullApiResponse] = useState(null)

  const sentinelRef = useRef(null)
  const initialLoadDone = useRef(false)

  const initialQuery = useQuery({
    queryFn: () => {
      if (!searchTerm) return null
      return fetchFunction({ query: searchTerm, offset: 0, limit: 100 })
    },
    queryKey: `initial-${panelId}-${searchTerm}-0`,
  })

  useEffect(() => {
    if (initialQuery.data && !initialLoadDone.current) {
      const { results, metadata } = initialQuery.data
      setAllLoadedItems(results)
      setTotalCount(metadata.total_count)
      setCurrentOffset(100)
      setHasMorePages(100 < metadata.total_count)
      setFullApiResponse(initialQuery.data)
      initialLoadDone.current = true
    }
  }, [initialQuery.data])

  useEffect(() => {
    setAllLoadedItems([])
    setCurrentOffset(0)
    setTotalCount(null)
    setHasMorePages(true)
    setFullApiResponse(null)
    initialLoadDone.current = false
  }, [searchTerm, panelId])

  const filteredItems = useMemo(() => {
    if (!filterFunction || !filters) return allLoadedItems
    return allLoadedItems.filter((item) => filterFunction(item, filters))
  }, [allLoadedItems, filters, filterFunction])

  useEffect(() => {
    if (onFilteredItemsChange) {
      onFilteredItemsChange(filteredItems, fullApiResponse)
    }
  }, [filteredItems, fullApiResponse, onFilteredItemsChange])

  const hasActiveFilters = useMemo(() => {
    if (!filters) return false
    return Object.values(filters).some((value) => {
      if (typeof value === "boolean") return value
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === "string") return value !== ""
      return false
    })
  }, [filters])

  const loadMoreItems = useCallback(async () => {
    if (isLoadingMore || !hasMorePages || !searchTerm) return

    setIsLoadingMore(true)
    try {
      const response = await fetchFunction({
        query: searchTerm,
        offset: currentOffset,
        limit: 100,
      })

      const { results, metadata } = response
      setAllLoadedItems((prev) => [...prev, ...results])
      setTotalCount(metadata.total_count)

      const newOffset = currentOffset + 100
      setCurrentOffset(newOffset)
      setHasMorePages(newOffset < metadata.total_count)
    } catch (error) {
      console.error("Error loading more items:", error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, hasMorePages, searchTerm, currentOffset, fetchFunction])

  useEffect(() => {
    if (!sentinelRef.current || !hasMorePages) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMoreItems()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinelRef.current)

    return () => {
      if (sentinelRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(sentinelRef.current)
      }
    }
  }, [hasMorePages, isLoadingMore, loadMoreItems])

  const countDisplay = useMemo(() => {
    if (!getCountDisplay) {
      if (!hasActiveFilters) {
        if (hasMorePages) {
          return `${allLoadedItems.length}+ items found`
        }
        return `${totalCount || allLoadedItems.length} items found`
      } else {
        const loaded = hasMorePages
          ? `${allLoadedItems.length}+`
          : `${totalCount || allLoadedItems.length}`
        return `Found ${filteredItems.length} of ${loaded} items matching filters`
      }
    }

    return getCountDisplay(
      filteredItems.length,
      allLoadedItems.length,
      totalCount,
      hasMorePages,
      hasActiveFilters
    )
  }, [
    filteredItems.length,
    allLoadedItems.length,
    totalCount,
    hasMorePages,
    hasActiveFilters,
    getCountDisplay,
  ])

  if (initialQuery.isLoading) {
    return (
      <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0">
        <div className="h-full flex items-center justify-center">
          <CircularProgress />
        </div>
      </div>
    )
  }

  if (initialQuery.error) {
    return (
      <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0">
        <div className="h-full flex items-center justify-center p-4">
          <span className="text-red-600">Error loading results</span>
        </div>
      </div>
    )
  }

  if (initialQuery.data === null || allLoadedItems.length === 0) {
    return (
      <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0">
        <div className="h-24 flex items-center justify-center p-2">
          <span className="italic">No results found</span>
        </div>
      </div>
    )
  }

  if (filteredItems.length === 0 && hasActiveFilters) {
    return (
      <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0 overflow-auto border-r border-gray-200">
        <div className="px-4 py-2 border-b border-gray-200 sticky top-0 bg-white isolate z-10">
          <div className="italic text-gray-500">{countDisplay}</div>
          {renderFilters && renderFilters()}
        </div>
        <div className="h-24 flex items-center justify-center p-2">
          <span className="italic">No items match the current filters</span>
        </div>
        {hasMorePages && (
          <div
            ref={sentinelRef}
            className="flex items-center justify-center p-4"
          >
            {isLoadingMore && <CircularProgress size={24} />}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0 overflow-auto border-r border-gray-200">
      <div className="px-4 py-2 border-b border-gray-200 sticky top-0 bg-white isolate z-10">
        <div className="italic text-gray-500 border-b border-gray-200 pb-2">
          {countDisplay}
        </div>
        {renderFilters && renderFilters()}
      </div>
      {filteredItems.map((item, index) => {
        const originalIndex = allLoadedItems.indexOf(item)
        const offset = Math.floor(originalIndex / 100) * 100
        const indexInPage = originalIndex % 100
        const key = `${offset}-${indexInPage}`

        return renderItem(item, key, activeItemIndex === index, () =>
          onActiveItemChange(index)
        )
      })}
      {hasMorePages && (
        <div
          ref={sentinelRef}
          className="flex items-center justify-center p-4 border-b border-gray-200"
        >
          {isLoadingMore && <CircularProgress size={24} />}
        </div>
      )}
    </div>
  )
}
