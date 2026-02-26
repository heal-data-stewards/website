import { Bookmark, BookmarkBorder, MenuBook, Tune } from "@mui/icons-material"
import {
  Badge,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  Pagination,
  Tab,
} from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useQuery } from "utils/use-query"
import { CDEDisplay } from "../components/CDEDisplay"
import { FiltersPanel } from "../components/FiltersPanel"
import { ParentStudiesDisplay } from "../components/ParentStudiesDisplay"
import { useCollectionContext } from "../context/collection"
import { trackBookmarkClick, PANEL_LOCATIONS, UI_SURFACES } from "../analytics"
import { fetchVariables } from "../data/variables"
import { a11yProps, PillTabs, TabPanel } from "../components/Tabs"
import { Empty } from "../components/Empty"

const PAGE_SIZE = 50

const DATA_TYPE_OPTIONS = [
  "boolean",
  "string",
  "datetime",
  "time",
  "integer",
  "number",
  "enum",
  "date",
  "text",
]

export const VariablesPanel = ({ searchTerm }) => {
  const collection = useCollectionContext()
  const [activeSidebarItem, setActiveSidebarItem] = useState(0)
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [filterValues, setFilterValues] = useState({
    cdeOnly: false,
    dataTypes: [],
  })

  const apiFilters = useMemo(() => {
    const filters = []

    if (filterValues.cdeOnly) {
      filters.push({
        field: "is_cde",
        operator: "eq",
        value: true,
      })
    }

    if (filterValues.dataTypes.length > 0) {
      filters.push({
        field: "data_type",
        operator: "in",
        value: filterValues.dataTypes,
      })
    }

    return filters
  }, [filterValues])

  const payload = {
    query: searchTerm,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    filters: apiFilters,
  }

  const variablesQuery = useQuery({
    queryFn: () => {
      if (!searchTerm) return null
      return fetchVariables(payload)
    },
    queryKey: `variables-${JSON.stringify(payload)}`,
  })

  const hasActiveFilters =
    filterValues.cdeOnly || filterValues.dataTypes.length > 0

  const filterConfigs = [
    {
      key: "cdeOnly",
      label: "CDE Only",
      type: "checkbox",
    },
    {
      key: "dataTypes",
      label: "Data Type",
      type: "multiselect",
      options: DATA_TYPE_OPTIONS,
    },
  ]

  useEffect(() => {
    setCurrentTabIndex(0)
  }, [activeSidebarItem])

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
    setPage(1)
    setActiveSidebarItem(0)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
    setActiveSidebarItem(0)
  }
  if (variablesQuery.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }
  if (variablesQuery.error) {
    return (
      <div className="h-full flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading results</span>
      </div>
    )
  }
  if (variablesQuery.data === null) {
    return null
  }
  const variables = variablesQuery.data.results
  const totalCount =
    variablesQuery.data.metadata?.total_count ?? variables.length
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  if (variables.length === 0)
    return (
      <div className="flex flex-row max-h-full h-full">
        <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0 overflow-auto border-r border-gray-200">
          <div className="border-b border-gray-200 sticky top-0 bg-white isolate z-10">
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="italic text-gray-500">0 variables found.</span>
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
  const activeVariable = variables[activeSidebarItem]
  const variableHasPermissibleValues =
    activeVariable.metadata?.permissible_values?.length > 0

  const tabs = [
    ...(variableHasPermissibleValues
      ? [{ label: "Permissible Values", key: "permissible_values" }]
      : []),
    {
      label: activeVariable?.is_cde ? "CDEs" : "Usage In Studies",
      key: "usage",
    },
    { label: "References", key: "references" },
  ]

  return (
    <div className="flex flex-row max-h-full h-full">
      <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0 border-r border-gray-200">
        <div className="flex-1 overflow-auto min-h-0">
          <div className="border-b border-gray-200 sticky top-0 bg-white isolate z-10">
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="italic text-gray-500">
                {totalCount} {totalCount !== 1 ? "variables" : "variable"}{" "}
                found.
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
          {variables.map((variable, index) => (
            <SidebarItem
              variable={variable}
              key={variable.id}
              name={variable.id}
              description={variable.description ?? ""}
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
      {activeVariable ? (
        <div className="flex-1 p-4 min-h-0 overflow-auto">
          <div className="flex gap-2">
            <div className="flex-1">
              <h2 className="flex-1 text-2xl font-semibold leading-relaxed text-[#592963]">
                {activeVariable.name === "None"
                  ? activeVariable.id
                  : activeVariable.name}
              </h2>
              <p className="text-lg text-gray-500 font-normal">
                {activeVariable.id}
              </p>
            </div>
            <IconButton
              size="large"
              sx={{ flexShrink: 0 }}
              onClick={() => {
                const isBookmarked = collection.variables.has(activeVariable)
                collection.variables.toggle(activeVariable)
                trackBookmarkClick({
                  action: isBookmarked ? "remove" : "add",
                  entity: activeVariable,
                  panelLocation: PANEL_LOCATIONS.VARIABLES,
                  uiSurface: UI_SURFACES.RIGHT_DETAIL,
                  referringSearchTerm: searchTerm,
                })
              }}
            >
              {collection.variables.has(activeVariable) ? (
                <Bookmark fontSize="large" sx={{ color: "#4d2862" }} />
              ) : (
                <BookmarkBorder fontSize="large" sx={{ color: "#4d2862" }} />
              )}
            </IconButton>
          </div>
          <p className="mt-3">{activeVariable.description}</p>

          <div className="mt-4">
            <PillTabs
              value={currentTabIndex}
              onChange={(e, value) => setCurrentTabIndex(value)}
              aria-label="Variable tabs"
            >
              {tabs.map((tab, index) => (
                <Tab key={tab.key} label={tab.label} {...a11yProps(index)} />
              ))}
            </PillTabs>
          </div>
          <div className="p-2">
            {tabs.map((tab, index) => (
              <TabPanel
                key={tab.key}
                currentTabIndex={currentTabIndex}
                index={index}
              >
                {tab.key === "permissible_values" && (
                  <>
                    <h3 className="text-l font-semibold mt-1 mb-1">
                      {activeVariable.metadata?.crf_name}
                    </h3>
                    {activeVariable.metadata?.question_text !== "None" && (
                      <p>{activeVariable.metadata.question_text}</p>
                    )}

                    {variableHasPermissibleValues && (
                      <ul className="flex my-4 border-[#bfb9c5] border-[1px] rounded-md overflow-auto">
                        {activeVariable.metadata.permissible_values.map(
                          (pv) => (
                            <li
                              key={pv.value}
                              className="px-3 py-2 rounded-md odd:bg-[#f1eff3] flex-1"
                            >
                              <div className="flex flex-col">
                                <span>{pv.value}</span>
                                {pv.description && (
                                  <span className="text-gray-500 text-sm">
                                    {pv.description}
                                  </span>
                                )}
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    )}
                  </>
                )}
                {tab.key === "usage" &&
                  (activeVariable.is_cde ? (
                    <CDEDisplay
                      searchTerm={searchTerm}
                      panelLocation={PANEL_LOCATIONS.VARIABLES}
                      expandFirstItem
                      emptyText={"No CDEs found for this variable."}
                      elementIds={activeVariable.parents.map((p) =>
                        p.replace("HEALCDE:", "")
                      )}
                    />
                  ) : (
                    <ParentStudiesDisplay
                      studyIds={activeVariable.parents}
                      notFoundText={"No studies found for this variable."}
                      searchTerm={searchTerm}
                      expandFirstItem
                      panelLocation={PANEL_LOCATIONS.VARIABLES}
                    />
                  ))}
                {tab.key === "references" ? (
                  activeVariable.metadata?.references &&
                  activeVariable.metadata.references !== "None" ? (
                    <p>{activeVariable.metadata.references}</p>
                  ) : (
                    <Empty
                      icon={<MenuBook />}
                      text="No references found for this variable."
                    />
                  )
                ) : null}
              </TabPanel>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 p-4 min-h-0 overflow-auto flex items-center justify-center">
          <span className="text-gray-400 italic">
            Select a variable to view details
          </span>
        </div>
      )}
    </div>
  )
}

function SidebarItem({
  variable,
  name,
  description,
  onClick,
  active,
  searchTerm,
}) {
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
        <h4 className="font-semibold break-all">{name}</h4>
        <IconButton
          size="small"
          sx={{ p: 0 }}
          onClick={(e) => {
            e.stopPropagation()
            const isBookmarked = collection.variables.has(variable)
            collection.variables.toggle(variable)
            trackBookmarkClick({
              action: isBookmarked ? "remove" : "add",
              entity: variable,
              panelLocation: PANEL_LOCATIONS.VARIABLES,
              uiSurface: UI_SURFACES.LEFT_LIST,
              referringSearchTerm: searchTerm,
            })
          }}
        >
          {collection.variables.has(variable) ? (
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
