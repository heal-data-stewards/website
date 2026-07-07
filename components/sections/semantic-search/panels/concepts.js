import { Search } from "@mui/icons-material"
import { IconButton, Tooltip } from "@mui/material"
import { useMemo, useState } from "react"
import { useQuery } from "utils/use-query"
import {
  trackNewConceptSearched,
  PANEL_LOCATIONS,
  UI_SURFACES,
} from "../analytics"
import { EntityPanel, PAGE_SIZE } from "../components/EntityPanel"
import { EntitySidebarItem } from "../components/EntitySidebarItem"
import { fetchConcepts } from "../data/concepts"
import { ConceptDetail, lowercaseFirstLetters } from "../details/ConceptDetail"

export const ConceptsPanel = ({ searchTerm }) => {
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
  }

  const concepts = conceptsQuery.data?.results ?? []
  const totalCount =
    conceptsQuery.data?.metadata?.total_count ?? concepts.length

  return (
    <EntityPanel
      query={conceptsQuery}
      results={concepts}
      totalCount={totalCount}
      entityNames={{ singular: "concept", plural: "concepts" }}
      page={page}
      onPageChange={setPage}
      filterConfigs={filterConfigs}
      filterValues={filterValues}
      onFilterChange={handleFilterChange}
      hasActiveFilters={hasActiveFilters}
      detailPlaceholder="Select a concept to view details"
      renderSidebarItem={(concept, { active, onClick }) => (
        <ConceptSidebarItem
          key={concept.id}
          concept={concept}
          onClick={onClick}
          active={active}
          searchTerm={searchTerm}
        />
      )}
      renderDetail={(concept) => (
        <ConceptDetail
          key={concept.id}
          concept={concept}
          searchTerm={searchTerm}
        />
      )}
    />
  )
}

function ConceptSidebarItem({ concept, onClick, active, searchTerm }) {
  const name = lowercaseFirstLetters(concept.name)

  return (
    <EntitySidebarItem
      entity={concept}
      collectionKey="concepts"
      panelLocation={PANEL_LOCATIONS.CONCEPTS}
      searchTerm={searchTerm}
      onClick={onClick}
      active={active}
      title={
        <div className="flex gap-1 items-center">
          <h4 className="font-semibold">{name}</h4>
          <Tooltip title="Search for this concept" placement="top">
            <IconButton
              size="small"
              component="a"
              href={(() => {
                const url = new URL(window.location.href)
                url.searchParams.set("q", name)
                return url.toString()
              })()}
              onMouseDown={(e) => {
                e.stopPropagation()

                trackNewConceptSearched({
                  concept: concept,
                  panelLocation: PANEL_LOCATIONS.CONCEPTS,
                  uiSurface: UI_SURFACES.LEFT_LIST,
                  referringSearchTerm: searchTerm,
                })
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  trackNewConceptSearched({
                    concept: concept,
                    panelLocation: PANEL_LOCATIONS.CONCEPTS,
                    uiSurface: UI_SURFACES.LEFT_LIST,
                    referringSearchTerm: searchTerm,
                  })
                }
              }}
            >
              <Search fontSize="small" sx={{ color: "#4d2862" }} />
            </IconButton>
          </Tooltip>
        </div>
      }
    >
      <p className="text-sm text-gray-500">{concept.description}</p>
    </EntitySidebarItem>
  )
}
