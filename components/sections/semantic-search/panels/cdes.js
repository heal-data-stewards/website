import { Bookmark, BookmarkBorder, Download, Tune } from "@mui/icons-material"
import {
  Badge,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  Pagination,
  styled,
} from "@mui/material"
import { useMemo, useState } from "react"
import { useQuery } from "utils/use-query"
import { FiltersPanel } from "../components/FiltersPanel"
import { ParentStudiesDisplay } from "../components/ParentStudiesDisplay"
import { VariableQuestionDisplay } from "../components/VariableQuestionDisplay"
import { useCollectionContext } from "../context/collection"
import { InfiniteScrollList } from "../components/InfiniteScrollList"
import { FiltersPanel } from "../components/FiltersPanel"
import {
  trackBookmarkClick,
  trackCdeDownloadClick,
  PANEL_LOCATIONS,
  UI_SURFACES,
} from "../analytics"
import { fetchCDEs } from "../data/cdes"

const PAGE_SIZE = 50

export const CDEsPanel = ({ searchTerm }) => {
  const collection = useCollectionContext()
  const [activeSidebarItem, setActiveSidebarItem] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [filterValues, setFilterValues] = useState({
    cdeTypes: [],
    usedByStudies: "",
  })

  const apiFilters = useMemo(() => {
    const filters = []

    if (filterValues.cdeTypes.length > 0) {
      filters.push({
        field: "metadata.categories.keyword",
        operator: "in",
        value: filterValues.cdeTypes,
      })
    }

    if (filterValues.usedByStudies === "used") {
      filters.push({
        field: "metadata.study_mappings",
        operator: "size_gt",
        value: 0,
      })
    } else if (filterValues.usedByStudies === "not_used") {
      filters.push({
        field: "metadata.study_mappings",
        operator: "size_eq",
        value: 0,
      })
    }

    return filters
  }, [filterValues])

  const payload = {
    query: searchTerm,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    filters: apiFilters,
    aggs: { "metadata.categories.keyword": 25 },
  }

  const cdesQuery = useQuery({
    queryFn: () => {
      if (!searchTerm) return null
      return fetchCDEs(payload)
    },
    queryKey: `cdes-${JSON.stringify(payload)}`,
  })

  const hasActiveFilters =
    filterValues.cdeTypes.length > 0 || filterValues.usedByStudies !== ""

  const filterConfigs = useMemo(() => {
    const cdeTypeOptions =
      cdesQuery.data?.aggregations?.["metadata.categories.keyword"]?.map(
        (bucket) => bucket.key
      ) || []

    return [
      {
        key: "cdeTypes",
        label: "CDE Type",
        type: "multiselect",
        options: cdeTypeOptions,
      },
      {
        key: "usedByStudies",
        label: "Used by Studies",
        type: "select",
        options: [
          { value: "used", label: "Used by studies" },
          { value: "not_used", label: "Not used by studies" },
        ],
      },
    ]
  }, [cdesQuery.data?.aggregations])

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
    setPage(1)
    setActiveSidebarItem(0)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
    setActiveSidebarItem(0)
  }
  if (cdesQuery.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }
  if (cdesQuery.error) {
    return (
      <div className="h-full flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading results</span>
      </div>
    )
  }
  if (cdesQuery.data === null) {
    return null
  }
  const cdes = cdesQuery.data.results
  const totalCount = cdesQuery.data.metadata?.total_count ?? cdes.length
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  if (cdes.length < 1)
    return (
      <div className="flex flex-row max-h-full h-full">
        <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0 border-r border-gray-200 overflow-auto">
          <div className="border-b border-gray-200 sticky top-0 bg-white isolate z-10">
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="italic text-gray-500">0 CDEs found.</span>
              <Button
                variant="text"
                size="small"
                onClick={() => setFiltersOpen((prev) => !prev)}
                endIcon={
                  <Badge
                    color="primary"
                    variant="dot"
                    invisible={!hasActiveFilters}
                    sx={{ "& .MuiBadge-badge": { backgroundColor: "#4d2862" } }}
                  >
                    <Tune fontSize="small" />
                  </Badge>
                }
                sx={{ color: "#4d2862" }}
              >
                Filters
              </Button>
            </div>
            <Collapse in={filtersOpen}>
              <div className="px-4 pb-3">
                <FiltersPanel
                  filterConfigs={filterConfigs}
                  filterValues={filterValues}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </Collapse>
          </div>
          <div className="w-full h-24 flex items-center justify-center p-2">
            <span className="italic">No results for the requested query.</span>
          </div>
        </div>
      </div>
    )
  const activeCde = cdes[activeSidebarItem]

  return (
    <div className="flex flex-row max-h-full h-full">
      <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0 border-r border-gray-200">
        <div className="flex-1 overflow-auto min-h-0">
          <div className="border-b border-gray-200 sticky top-0 bg-white isolate z-10">
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="italic text-gray-500">
                {totalCount} {totalCount !== 1 ? "CDEs" : "CDE"} found.
              </span>
              <Button
                variant="text"
                size="small"
                onClick={() => setFiltersOpen((prev) => !prev)}
                endIcon={
                  <Badge
                    color="primary"
                    variant="dot"
                    invisible={!hasActiveFilters}
                    sx={{ "& .MuiBadge-badge": { backgroundColor: "#4d2862" } }}
                  >
                    <Tune fontSize="small" />
                  </Badge>
                }
                sx={{ color: "#4d2862" }}
              >
                Filters
              </Button>
            </div>
            <Collapse in={filtersOpen}>
              <div className="px-4 pb-3">
                <FiltersPanel
                  filterConfigs={filterConfigs}
                  filterValues={filterValues}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </Collapse>
          </div>
          {cdes.map((cde, index) => (
            <SidebarItem
              cde={cde}
              key={cde.id}
              name={cde.name}
              id={cde.id}
              description={cde.description}
              onClick={() => setActiveSidebarItem(index)}
              active={activeSidebarItem === index}
              searchTerm={searchTerm}
            />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="border-t border-gray-200 bg-white py-2 flex justify-center flex-shrink-0">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
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
      {activeCde ? (
        <div className="flex-1 p-4 min-h-0 overflow-auto">
          <div className="flex gap-2">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold leading-relaxed text-[#592963]">
                {activeCde.name}{" "}
              </h2>
              <p className="text-lg text-gray-500 font-normal">
                {activeCde.id}
              </p>
            </div>
            <IconButton
              size="large"
              onClick={() => {
                const isBookmarked = collection.cdes.has(activeCde)
                collection.cdes.toggle(activeCde)
                trackBookmarkClick({
                  action: isBookmarked ? "remove" : "add",
                  entity: activeCde,
                  panelLocation: PANEL_LOCATIONS.CDES,
                  uiSurface: UI_SURFACES.RIGHT_DETAIL,
                  referringSearchTerm: searchTerm,
                })
              }}
            >
              {collection.cdes.has(activeCde) ? (
                <Bookmark fontSize="large" sx={{ color: "#4d2862" }} />
              ) : (
                <BookmarkBorder fontSize="large" sx={{ color: "#4d2862" }} />
              )}
            </IconButton>
          </div>
          <p className="mt-4">{activeCde.description}</p>

          <hr className="my-4" />

          <VariableQuestionDisplay variableList={activeCde.variable_list} />

          <ParentStudiesDisplay
            studyIds={activeCde.parents}
            searchTerm={searchTerm}
            panelLocation={PANEL_LOCATIONS.CDES}
            titleFormatter={(n) =>
              `Studies using this CDE ${
                n > 0 ? ` (${n.toLocaleString()})` : ""
              }`
            }
            notFoundText={"No studies found for this CDE."}
          />

          <h3 className="text-xl font-semibold mt-6 mb-2">Downloads</h3>
          {activeCde.metadata?.urls?.length === 0 ? (
            <p className="text-gray-400 italic">
              No downloads found for this CDE
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              {activeCde.metadata?.urls?.map((url) => (
                <DownloadCard
                  className="p-4 flex gap-1 shadow-md transition-all duration-150 rounded-md border-[1px] border-gray-200"
                  key={url.filename}
                  href={url.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackCdeDownloadClick({
                      cde: activeCde,
                      file: url,
                      panelLocation: PANEL_LOCATIONS.CDES,
                      uiSurface: UI_SURFACES.CDE_DOWNLOAD_CARD,
                      referringSearchTerm: searchTerm,
                    })
                  }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-500 mb-1">
                      {url.filename}
                    </p>
                    <p>{url.description}</p>
                  </div>
                  <Download />
                </DownloadCard>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 p-4 min-h-0 overflow-auto flex items-center justify-center">
          <span className="text-gray-400 italic">
            Select a CDE to view details
          </span>
        </div>
      )}
    </div>
  )
}

const DownloadCard = styled("a")`
  &:hover {
    background-color: #fafafa;
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`

function SidebarItem({ cde, name, description, onClick, active, searchTerm }) {
  const collection = useCollectionContext()

  return (
    <button
      onClick={onClick}
      className={
        `w-full p-4 border-b border-gray-200 cursor-pointer text-left` +
        (active ? " bg-[#eeecf0]" : "")
      }
    >
      <div className="flex gap-2 items-start justify-between">
        <h4 className="font-semibold">{name}</h4>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            const isBookmarked = collection.cdes.has(cde)

            collection.cdes.toggle(cde)
            trackBookmarkClick({
              action: isBookmarked ? "remove" : "add",
              entity: cde,
              panelLocation: PANEL_LOCATIONS.CDES,
              uiSurface: UI_SURFACES.CDE_ACCORDION_ROW,
              referringSearchTerm: searchTerm,
            })
          }}
        >
          {collection.cdes.has(cde) ? (
            <Bookmark fontSize="small" sx={{ color: "#4d2862" }} />
          ) : (
            <BookmarkBorder fontSize="small" sx={{ color: "#4d2862" }} />
          )}
        </IconButton>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </button>
  )
}
