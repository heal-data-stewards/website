import {
  Bookmark,
  BookmarkBorder,
  OpenInNew,
  Search,
  Tune,
} from "@mui/icons-material"
import {
  Badge,
  CircularProgress,
  Collapse,
  IconButton,
  Pagination,
  Tooltip,
} from "@mui/material"
import { useMemo, useState } from "react"
import { useQuery } from "utils/use-query"
import Link from "../../../elements/link"
import { CDEDisplay } from "../components/CDEDisplay"
import { FiltersPanel } from "../components/FiltersPanel"
import { ParentStudiesDisplay } from "../components/ParentStudiesDisplay"
import { useCollectionContext } from "../context/collection"
import { fetchConcepts } from "../data/concepts"

const PAGE_SIZE = 10

export const ConceptsPanel = ({ searchTerm }) => {
  const collection = useCollectionContext()
  const [activeSidebarItem, setActiveSidebarItem] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [filterValues, setFilterValues] = useState({
    conceptTypes: [],
  })

  const apiFilters = useMemo(() => {
    const filters = []

    if (filterValues.conceptTypes.length > 0) {
      filters.push({
        field: "concept_type",
        operator: "in",
        value: filterValues.conceptTypes,
      })
    }

    return filters
  }, [filterValues])

  const payload = {
    query: searchTerm,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    filters: apiFilters,
    aggs: { concept_type: 25 },
  }

  const conceptsQuery = useQuery({
    queryFn: () => {
      if (!searchTerm) return null
      return fetchConcepts(payload)
    },
    queryKey: `concepts-${JSON.stringify(payload)}`,
  })

  const hasActiveFilters = filterValues.conceptTypes.length > 0

  const filterConfigs = useMemo(() => {
    const conceptTypeOptions =
      conceptsQuery.data?.aggregations?.["concept_type"]?.map((bucket) => ({
        value: bucket.key,
        label: `${bucket.key} (${bucket.count.toLocaleString()})`,
      })) || []

    return [
      {
        key: "conceptTypes",
        label: "Concept Type",
        type: "multiselect",
        options: conceptTypeOptions,
      },
    ]
  }, [conceptsQuery.data?.aggregations])

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
    setPage(1)
    setActiveSidebarItem(0)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
    setActiveSidebarItem(0)
  }
  if (conceptsQuery.isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }
  if (conceptsQuery.error) {
    return (
      <div className="h-96 flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading results</span>
      </div>
    )
  }
  if (conceptsQuery.data === null) {
    return null
  }
  const concepts = conceptsQuery.data.results.map((concept) => ({
    ...concept,
    parentStudies: Array.from(
      new Set(
        concept.parents
          .map((str) => {
            const match = str.match(/^(HEALDATAPLATFORM:[^:]+):[^:]+$/)
            return match ? match[1] : null
          })
          .filter(Boolean)
      )
    ),
    parentCdes: Array.from(
      new Set(concept.parents.filter((str) => /^HEALCDE:[^:]+$/.test(str)))
    ),
  }))
  const totalCount = conceptsQuery.data.metadata?.total_count ?? concepts.length
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  if (concepts.length < 1)
    return (
      <div className="flex flex-row max-h-full h-full">
        <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0 border-r border-gray-200 overflow-auto">
          <div className="border-b border-gray-200 sticky top-0 bg-white isolate z-10">
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="italic text-gray-500">0 concepts found.</span>
              <IconButton
                size="small"
                onClick={() => setFiltersOpen((prev) => !prev)}
              >
                <Badge
                  color="primary"
                  variant="dot"
                  invisible={!hasActiveFilters}
                  sx={{ "& .MuiBadge-badge": { backgroundColor: "#4d2862" } }}
                >
                  <Tune fontSize="small" sx={{ color: "#4d2862" }} />
                </Badge>
              </IconButton>
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
  const activeConcept = concepts[activeSidebarItem]

  return (
    <div className="flex flex-row max-h-full h-full">
      <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0 border-r border-gray-200">
        <div className="flex-1 overflow-auto min-h-0">
          <div className="border-b border-gray-200 sticky top-0 bg-white isolate z-10">
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="italic text-gray-500">
                {totalCount} {totalCount !== 1 ? "concepts" : "concept"} found.
              </span>
              <IconButton
                size="small"
                onClick={() => setFiltersOpen((prev) => !prev)}
              >
                <Badge
                  color="primary"
                  variant="dot"
                  invisible={!hasActiveFilters}
                  sx={{ "& .MuiBadge-badge": { backgroundColor: "#4d2862" } }}
                >
                  <Tune fontSize="small" sx={{ color: "#4d2862" }} />
                </Badge>
              </IconButton>
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
          {concepts.map((concept, index) => (
            <SidebarItem
              concept={concept}
              key={concept.id}
              name={concept.name}
              description={concept.description}
              parentStudies={concept.parentStudies}
              parentCdes={concept.parentCdes}
              onClick={() => setActiveSidebarItem(index)}
              active={activeSidebarItem === index}
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
      {activeConcept ? (
        <div className="flex-1 p-4 min-h-0 overflow-auto">
          <div className="flex w-full justify-between gap-2 mb-2">
            <div className="flex gap-1 items-center">
              <h2 className="text-2xl font-semibold leading-relaxed text-[#592963]">
                {activeConcept.name}{" "}
              </h2>
              <Link
                href={(() => {
                  const url = new URL(window.location.href)
                  url.searchParams.set("q", activeConcept.name)
                  return url
                })()}
                passHref
              >
                <Tooltip title="Search for this concept" placement="top">
                  <IconButton
                    size="large"
                    component={"a"}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Search fontSize="large" sx={{ color: "#4d2862" }} />
                  </IconButton>
                </Tooltip>
              </Link>
            </div>

            <IconButton
              size="large"
              sx={{ flexShrink: 0 }}
              onClick={() => {
                collection.concepts.toggle(activeConcept)
              }}
            >
              {collection.concepts.has(activeConcept) ? (
                <Bookmark fontSize="large" sx={{ color: "#4d2862" }} />
              ) : (
                <BookmarkBorder fontSize="large" sx={{ color: "#4d2862" }} />
              )}
            </IconButton>
          </div>
          <div className="mb-2 flex gap-2 flex-wrap">
            <p className="text-gray-600 bg-gray-100 border-[1px] border-gray-200 border-solid px-2 py-1 rounded-lg shadow-sm">
              {activeConcept.action ? (
                <Link
                  to={activeConcept.action ?? ""}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Tooltip title="Concept lookup in Ontology" placement="top">
                    {activeConcept.id}
                    <OpenInNew fontSize="small" />
                  </Tooltip>
                </Link>
              ) : (
                activeConcept.id
              )}
            </p>
            <p className="text-gray-600 bg-gray-100 border-[1px] border-gray-200 border-solid px-2 py-1 rounded-lg shadow-sm">
              {activeConcept.concept_type}
            </p>
          </div>
          <p className="">{activeConcept.description}</p>

          <hr className="my-4" />

          <ParentStudiesDisplay
            conceptId={activeConcept.id}
            searchTerm={searchTerm}
            notFoundText={"No studies found for this concept."}
            titleFormatter={(n) =>
              `Studies Referencing this Concept ${
                n > 0 ? ` (${n.toLocaleString()})` : ""
              }`
            }
          />

          <CDEDisplay searchTerm={searchTerm} conceptId={activeConcept.id} />
        </div>
      ) : (
        <div className="flex-1 p-4 min-h-0 overflow-auto flex items-center justify-center">
          <span className="text-gray-400 italic">
            Select a concept to view details
          </span>
        </div>
      )}
    </div>
  )
}

function SidebarItem({ concept, name, description, onClick, active }) {
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
        <div className="flex gap-1 items-center">
          <h4 className="font-semibold">{name}</h4>
          <Link
            href={(() => {
              const url = new URL(window.location.href)
              url.searchParams.set("q", name)
              return url
            })()}
            passHref
          >
            <Tooltip title="Search for this concept" placement="top">
              <IconButton
                size="small"
                component={"a"}
                onClick={(e) => e.stopPropagation()}
              >
                <Search fontSize="small" sx={{ color: "#4d2862" }} />
              </IconButton>
            </Tooltip>
          </Link>
        </div>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            collection.concepts.toggle(concept)
          }}
        >
          {collection.concepts.has(concept) ? (
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
