import { Tune } from "@mui/icons-material"
import {
  Badge,
  Button,
  CircularProgress,
  Collapse,
  Pagination,
} from "@mui/material"
import { useEffect, useState } from "react"
import { BulkDownloadButton } from "./BulkDownloadButton"
import { DEFAULT_SORT } from "../data/sort"
import { FiltersPanel } from "./FiltersPanel"
import { SortControl } from "./SortControl"

export const PAGE_SIZE = 50

/**
 * Shared layout + behavior for the four search result panels: loading/error
 * states, the left sidebar (result count, filters, list, pagination), and the
 * detail area for the selected item.
 */
export function EntityPanel({
  query,
  results,
  totalCount,
  // Key into the search API used for the bulk download, e.g. "studies"
  entityType,
  entityNames,
  searchTerm,
  simpleSearch,
  page,
  onPageChange,
  filterConfigs,
  filterValues,
  onFilterChange,
  hasActiveFilters,
  // Panels whose index maps sortable fields pass their options here; omitting
  // them hides the sort control entirely.
  sortOptions,
  sortValue = DEFAULT_SORT,
  onSortChange,
  renderSidebarItem,
  renderDetail,
  detailPlaceholder,
  // Any extra value (e.g. the simple search toggle) that should reset the
  // selection back to the first result when it changes
  resetKey,
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    setActiveIndex(0)
  }, [page, filterValues, sortValue, resetKey])

  if (query.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }
  if (query.error) {
    return (
      <div className="h-full flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading results</span>
      </div>
    )
  }
  if (query.data === null) {
    return null
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const activeItem = results[activeIndex]

  const sortable = Boolean(sortOptions?.length)
  const hasActiveSort = sortable && sortValue.key !== DEFAULT_SORT.key

  return (
    <div className="flex flex-row max-h-full h-full">
      <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0 border-r border-gray-200">
        <div className="flex-1 overflow-auto min-h-0">
          <div className="border-b border-gray-200 sticky top-0 bg-white isolate z-10">
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="italic text-gray-500">
                {totalCount}{" "}
                {totalCount !== 1 ? entityNames.plural : entityNames.singular}{" "}
                found.
              </span>
              <div className="flex items-center gap-1">
                <BulkDownloadButton
                  entityType={entityType}
                  entityNames={entityNames}
                  searchTerm={searchTerm}
                  simpleSearch={simpleSearch}
                />
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setFiltersOpen((prev) => !prev)}
                  endIcon={
                    <Badge
                      color="primary"
                      variant="dot"
                      invisible={!hasActiveFilters && !hasActiveSort}
                      sx={{
                        "& .MuiBadge-badge": { backgroundColor: "#4d2862" },
                      }}
                    >
                      <Tune fontSize="small" />
                    </Badge>
                  }
                  sx={{ color: "#4d2862" }}
                >
                  {sortable ? "Sort & Filter" : "Filters"}
                </Button>
              </div>
            </div>
            <Collapse in={filtersOpen}>
              <div className="px-4 pb-3">
                <SortControl
                  options={sortOptions}
                  value={sortValue}
                  onChange={onSortChange}
                />
                <FiltersPanel
                  filterConfigs={filterConfigs}
                  filterValues={filterValues}
                  onFilterChange={onFilterChange}
                />
              </div>
            </Collapse>
          </div>
          {results.length === 0 ? (
            <div className="w-full flex items-center justify-center p-4">
              <span className="italic">
                No results for the requested query.
              </span>
            </div>
          ) : (
            results.map((item, index) =>
              renderSidebarItem(item, {
                active: activeIndex === index,
                onClick: () => setActiveIndex(index),
              })
            )
          )}
        </div>
        {totalPages > 1 && (
          <div className="border-t border-gray-200 bg-white py-2 flex justify-center flex-shrink-0">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, newPage) => onPageChange(newPage)}
              size="small"
              sx={{
                "& .MuiPaginationItem-root": {
                  "&.Mui-selected": {
                    backgroundColor: "#4d2862",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#3d1e4e",
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </div>
      {results.length === 0 ? null : activeItem ? (
        renderDetail(activeItem)
      ) : (
        <div className="flex-1 p-4 min-h-0 overflow-auto flex items-center justify-center">
          <span className="text-gray-400 italic">{detailPlaceholder}</span>
        </div>
      )}
    </div>
  )
}
