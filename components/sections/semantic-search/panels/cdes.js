import { useEffect, useMemo, useState } from "react"
import { useQuery } from "utils/use-query"
import { PANEL_LOCATIONS } from "../analytics"
import { EntityPanel, PAGE_SIZE } from "../components/EntityPanel"
import { EntitySidebarItem } from "../components/EntitySidebarItem"
import { fetchCDEs } from "../data/cdes"
import { CdeDetail } from "../details/CdeDetail"

export const CDEsPanel = ({ searchTerm, simpleSearch = false }) => {
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
    simpleSearch,
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

  useEffect(() => {
    setPage(1)
  }, [simpleSearch])

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const cdes = cdesQuery.data?.results ?? []
  const totalCount = cdesQuery.data?.metadata?.total_count ?? cdes.length

  return (
    <EntityPanel
      query={cdesQuery}
      results={cdes}
      totalCount={totalCount}
      entityType="cdes"
      entityNames={{ singular: "CDE", plural: "CDEs" }}
      searchTerm={searchTerm}
      simpleSearch={simpleSearch}
      page={page}
      onPageChange={setPage}
      filterConfigs={filterConfigs}
      filterValues={filterValues}
      onFilterChange={handleFilterChange}
      hasActiveFilters={hasActiveFilters}
      resetKey={simpleSearch}
      detailPlaceholder="Select a CDE to view details"
      renderSidebarItem={(cde, { active, onClick }) => (
        <EntitySidebarItem
          key={cde.id}
          entity={cde}
          collectionKey="cdes"
          panelLocation={PANEL_LOCATIONS.CDES}
          searchTerm={searchTerm}
          onClick={onClick}
          active={active}
          title={<h4 className="font-semibold">{cde.name}</h4>}
        >
          <p className="text-sm text-gray-500">{cde.description}</p>
        </EntitySidebarItem>
      )}
      renderDetail={(cde) => (
        <CdeDetail key={cde.id} cde={cde} searchTerm={searchTerm} />
      )}
    />
  )
}
