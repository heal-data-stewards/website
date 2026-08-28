import { useEffect, useMemo, useState } from "react"
import { useQuery } from "utils/use-query"
import { PANEL_LOCATIONS } from "../analytics"
import { EntityPanel, PAGE_SIZE } from "../components/EntityPanel"
import { EntitySidebarItem } from "../components/EntitySidebarItem"
import { fetchStudies } from "../data/studies"
import {
  PROJECT_END_DATE_SORT,
  PROJECT_START_DATE_SORT,
  RELEVANCE_SORT,
  useSort,
} from "../data/sort"
import { StudyDetail } from "../details/StudyDetail"

const SORT_OPTIONS = [
  RELEVANCE_SORT,
  PROJECT_START_DATE_SORT,
  PROJECT_END_DATE_SORT,
]

export const StudiesPanel = ({ searchTerm, simpleSearch = false }) => {
  const [page, setPage] = useState(1)
  const { sortValue, setSortValue, sort } = useSort(SORT_OPTIONS)
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
    sort,
    aggs: { "programs.keyword": 50 },
    simpleSearch,
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
    const researchNetworkOptions = (
      studiesQuery.data?.aggregations?.["programs.keyword"]?.map(
        (bucket) => bucket.key
      ) || []
    ).sort()

    return [
      {
        key: "researchNetworks",
        label: "Research Programs",
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

  useEffect(() => {
    setPage(1)
  }, [simpleSearch])

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleSortChange = (value) => {
    setSortValue(value)
    setPage(1)
  }

  const studies = studiesQuery.data?.results ?? []
  const totalCount = studiesQuery.data?.metadata?.total_count ?? studies.length

  return (
    <EntityPanel
      query={studiesQuery}
      results={studies}
      totalCount={totalCount}
      entityNames={{ singular: "study", plural: "studies" }}
      page={page}
      onPageChange={setPage}
      filterConfigs={filterConfigs}
      filterValues={filterValues}
      onFilterChange={handleFilterChange}
      hasActiveFilters={hasActiveFilters}
      sortOptions={SORT_OPTIONS}
      sortValue={sortValue}
      onSortChange={handleSortChange}
      resetKey={simpleSearch}
      detailPlaceholder="Select a study to view details"
      renderSidebarItem={(study, { active, onClick }) => (
        <StudySidebarItem
          key={study.id}
          study={study}
          onClick={onClick}
          active={active}
          searchTerm={searchTerm}
        />
      )}
      renderDetail={(study) => (
        <StudyDetail key={study.id} study={study} searchTerm={searchTerm} />
      )}
    />
  )
}

function StudySidebarItem({ study, onClick, active, searchTerm }) {
  const id = study.id.split(":")?.[1] ?? study.id
  const measuresCount = study.variable_list?.length || 0
  const cdesCount = study.section_list?.length || 0

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
    <EntitySidebarItem
      entity={study}
      collectionKey="studies"
      panelLocation={PANEL_LOCATIONS.STUDIES}
      searchTerm={searchTerm}
      onClick={onClick}
      active={active}
      title={<h4 className="font-semibold">{study.name}</h4>}
    >
      <p className="text-sm mt-2 text-gray-500">
        {study.metadata?.["Data Availability"] === "available" && (
          <span className="bg-[#982568] text-white rounded-md px-2 py-1 flex-shrink-0 ml-[-0.5rem] mr-1">
            Data available
          </span>
        )}
        {id}
      </p>
      {statsText.length > 0 && (
        <p className="text-sm mt-1 text-gray-500">{statsText.join(", ")}</p>
      )}
    </EntitySidebarItem>
  )
}
