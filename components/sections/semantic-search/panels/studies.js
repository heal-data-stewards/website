import { Bookmark, BookmarkBorder, OpenInNew, Tune } from "@mui/icons-material"
import {
  Badge,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  Pagination,
  Tooltip,
} from "@mui/material"
import { format, isValid, parseISO } from "date-fns"
import { useMemo, useState } from "react"
import { FiltersPanel } from "../components/FiltersPanel"
import { useQuery } from "utils/use-query"
import Link from "../../../elements/link"
import { CDEDisplay } from "../components/CDEDisplay"
import { VariablesList } from "../components/VariablesList"
import { useCollectionContext } from "../context/collection"
import { InfiniteScrollList } from "../components/InfiniteScrollList"
import {
  trackBookmarkClick,
  trackHdpLinkClick,
  PANEL_LOCATIONS,
  UI_SURFACES,
} from "../analytics"
import { fetchStudies } from "../data/studies"

const PAGE_SIZE = 50

export const StudiesPanel = ({ searchTerm }) => {
  const collection = useCollectionContext()
  const [activeSidebarItem, setActiveSidebarItem] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [filterValues, setFilterValues] = useState({
    researchNetworks: [],
    vlmdAvailable: "",
    dataAvailability: "",
    cdesUsed: "",
  })

  const apiFilters = useMemo(() => {
    const filters = []

    if (filterValues.researchNetworks.length > 0) {
      filters.push({
        field: "programs.keyword",
        operator: "in",
        value: filterValues.researchNetworks,
      })
    }

    if (filterValues.vlmdAvailable === "available") {
      filters.push({
        field: "variable_list",
        operator: "size_gt",
        value: 0,
      })
    } else if (filterValues.vlmdAvailable === "not_available") {
      filters.push({
        field: "variable_list",
        operator: "size_eq",
        value: 0,
      })
    }

    if (filterValues.dataAvailability === "available") {
      filters.push({
        field: "metadata.Data Availability.keyword",
        operator: "eq",
        value: "available",
      })
    } else if (filterValues.dataAvailability === "not_available") {
      filters.push({
        field: "metadata.Data Availability.keyword",
        operator: "missing",
      })
    }

    if (filterValues.cdesUsed === "used") {
      filters.push({
        field: "section_list",
        operator: "size_gt",
        value: 0,
      })
    } else if (filterValues.cdesUsed === "not_used") {
      filters.push({
        field: "section_list",
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
    aggs: { "programs.keyword": 50 },
  }

  const studiesQuery = useQuery({
    queryFn: () => {
      if (!searchTerm) return null
      return fetchStudies(payload)
    },
    queryKey: `studies-${JSON.stringify(payload)}`,
  })

  const hasActiveFilters =
    filterValues.researchNetworks.length > 0 ||
    filterValues.vlmdAvailable !== "" ||
    filterValues.dataAvailability !== "" ||
    filterValues.cdesUsed !== ""

  const filterConfigs = useMemo(() => {
    const researchNetworkOptions =
      studiesQuery.data?.aggregations?.["programs.keyword"]?.map(
        (bucket) => bucket.key
      ) || []

    return [
      {
        key: "researchNetworks",
        label: "Research Networks",
        type: "multiselect",
        options: researchNetworkOptions,
      },
      {
        key: "vlmdAvailable",
        label: "VLMD Available",
        type: "select",
        options: [
          { value: "available", label: "Available" },
          { value: "not_available", label: "Not Available" },
        ],
      },
      {
        key: "dataAvailability",
        label: "Data Availability",
        type: "select",
        options: [
          { value: "available", label: "Available" },
          { value: "not_available", label: "Not Available" },
        ],
      },
      {
        key: "cdesUsed",
        label: "CDEs Used",
        type: "select",
        options: [
          { value: "used", label: "Used" },
          { value: "not_used", label: "Not Used" },
        ],
      },
    ]
  }, [studiesQuery.data?.aggregations])

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
    setPage(1)
    setActiveSidebarItem(0)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
    setActiveSidebarItem(0)
  }

  if (studiesQuery.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }
  if (studiesQuery.error) {
    return (
      <div className="h-full flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading results</span>
      </div>
    )
  }
  if (studiesQuery.data === null) {
    return null
  }
  const studies = studiesQuery.data.results
  const totalCount = studiesQuery.data.metadata?.total_count ?? studies.length
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  if (studies.length < 1)
    return (
      <div className="flex flex-row max-h-full h-full">
        <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0 border-r border-gray-200 overflow-auto">
          <div className="border-b border-gray-200 sticky top-0 bg-white isolate z-10">
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="italic text-gray-500">0 studies found.</span>
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
  const activeStudy = studies[activeSidebarItem]

  return (
    <div className="flex flex-row max-h-full h-full">
      <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0 border-r border-gray-200">
        <div className="flex-1 overflow-auto min-h-0">
          <div className="border-b border-gray-200 sticky top-0 bg-white isolate z-10">
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="italic text-gray-500">
                {totalCount} {totalCount !== 1 ? "studies" : "study"} found.
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
          {studies.map((study, index) => (
            <SidebarItem
              study={study}
              key={study.id}
              name={study.name}
              id={study.id.split(":")?.[1] ?? study.id}
              variables={study.variable_list}
              sections={study.section_list}
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
      {activeStudy ? (
        <div className="flex-1 p-4 min-h-0 overflow-auto">
          <div className="flex gap-2 justify-between">
            <h2 className="text-2xl font-semibold leading-relaxed mb-2 text-[#592963]">
              {activeStudy.name}
            </h2>
            <IconButton
              size="large"
              onClick={() => {
                const isBookmarked = collection.studies.has(activeStudy)

                collection.studies.toggle(activeStudy)

                trackBookmarkClick({
                  action: isBookmarked ? "remove" : "add",
                  entity: activeStudy,
                  panelLocation: PANEL_LOCATIONS.STUDIES,
                  uiSurface: UI_SURFACES.RIGHT_DETAIL,
                  referringSearchTerm: searchTerm,
                })
              }}
            >
              {collection.studies.has(activeStudy) ? (
                <Bookmark fontSize="large" sx={{ color: "#4d2862" }} />
              ) : (
                <BookmarkBorder fontSize="large" sx={{ color: "#4d2862" }} />
              )}
            </IconButton>
          </div>
          <span>
            Study ID:{" "}
            <Link
              to={activeStudy.action}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackHdpLinkClick({
                  study: activeStudy,
                  panelLocation: PANEL_LOCATIONS.STUDIES,
                  uiSurface: UI_SURFACES.RIGHT_DETAIL,
                  referringSearchTerm: searchTerm,
                })
              }
            >
              <Tooltip
                title="Open study in the HEAL Data Platform"
                placement="right"
              >
                {activeStudy.id.split(":")?.[1] ?? activeStudy.id}{" "}
                <OpenInNew fontSize="small" />
              </Tooltip>
            </Link>
          </span>
          <div className="flex flex-col gap-1 mt-2">
            {activeStudy.programs.map((prog) => (
              <p key={prog} className="uppercase text-gray-500 text-sm">
                {prog}
              </p>
            ))}
          </div>
          <hr className="my-4" />
          <p className="">{activeStudy.description}</p>

          <h3 className="text-xl font-semibold mt-6 mb-1">Information</h3>
          <NestedTable object={activeStudy.metadata} />

          <VariablesList
            study={activeStudy}
            searchTerm={searchTerm}
            panelLocation={PANEL_LOCATIONS.STUDIES}
          />

          <CDEDisplay
            studyId={activeStudy.id}
            searchTerm={searchTerm}
            panelLocation={PANEL_LOCATIONS.STUDIES}
          />
        </div>
      ) : (
        <div className="flex-1 p-4 min-h-0 overflow-auto flex items-center justify-center">
          <span className="text-gray-400 italic">
            Select a study to view details
          </span>
        </div>
      )}
    </div>
  )
}

function NestedTable({ object, showHeader = true, showBorders = false }) {
  return (
    <table className={`w-full table-auto border-collapse align-top`}>
      {showHeader && (
        <thead className="border-b border-gray-200 mb-2">
          <tr>
            <th className="text-left font-semibold py-1 pr-4">Field</th>
            <th className="text-left font-semibold py-1 ">Value</th>
          </tr>
        </thead>
      )}
      <tbody>
        {Object.entries(object).map(([key, value]) => {
          let cell = null

          if (typeof value === "string") {
            cell = formatStringIfDate(value)
          } else if (Array.isArray(value)) {
            if (value.length === 0) {
              cell = <span className="italic text-gray-500">No values</span>
            } else if (
              value.every((v) => typeof v === "object" && v !== null)
            ) {
              cell = value.map((obj, idx) => (
                <div
                  key={idx}
                  className="-m-2 p-2 rounded-md bg-[#f4f1f5] bg-opacity-30 mb-2"
                >
                  <NestedTable
                    object={obj}
                    showHeader={false}
                    showBorders={true}
                  />
                </div>
              ))
            } else {
              cell = value.filter((v) => typeof v === "string").join(", ")
            }
          }

          return (
            <tr
              key={key}
              className={
                showBorders
                  ? "border-b border-gray-200 last:border-0"
                  : undefined
              }
            >
              <td className="py-1 pr-4 align-top">
                {formatSnakeCaseToTitleCase(key)}
              </td>
              <td className="py-1 align-top">{cell}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function formatStringIfDate(str) {
  const resultDate = parseISO(str)
  if (!isValid(resultDate)) return str
  return format(resultDate, "M/dd/yyyy")
}

function formatSnakeCaseToTitleCase(str) {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function SidebarItem({
  study,
  name,
  id,
  variables,
  onClick,
  active,
  searchTerm,
  sections,
}) {
  const collection = useCollectionContext()

  const measuresCount = variables?.length || 0
  const cdesCount = sections?.length || 0

  const statsText = []
  if (measuresCount > 0) {
    statsText.push(
      `${measuresCount} ${measuresCount !== 1 ? "measures" : "measure"}`
    )
  }
  if (cdesCount > 0) {
    statsText.push(`${cdesCount} ${cdesCount !== 1 ? "CDEs" : "CDE"}`)
  }

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
            const isBookmarked = collection.studies.has(study)
            collection.studies.toggle(study)
            trackBookmarkClick({
              action: isBookmarked ? "remove" : "add",
              entity: study,
              panelLocation: PANEL_LOCATIONS.STUDIES,
              uiSurface: UI_SURFACES.LEFT_LIST,
              referringSearchTerm: searchTerm,
            })
          }}
        >
          {collection.studies.has(study) ? (
            <Bookmark fontSize="small" sx={{ color: "#4d2862" }} />
          ) : (
            <BookmarkBorder fontSize="small" sx={{ color: "#4d2862" }} />
          )}
        </IconButton>
      </div>
      <p className="text-sm mt-2 text-gray-500">{id}</p>
      {statsText.length > 0 && (
        <p className="text-sm mt-1 text-gray-500">{statsText.join(", ")}</p>
      )}
    </button>
  )
}
