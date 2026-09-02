import { useEffect, useMemo, useState } from "react"
import { useQuery } from "utils/use-query"
import { PANEL_LOCATIONS } from "../analytics"
import { EntityPanel, PAGE_SIZE } from "../components/EntityPanel"
import { EntitySidebarItem } from "../components/EntitySidebarItem"
import { fetchVariables } from "../data/variables"
import { VariableDetail } from "../details/VariableDetail"

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

export const VariablesPanel = ({ searchTerm, simpleSearch = false }) => {
  const [page, setPage] = useState(1)
  const [filterValues, setFilterValues] = useState({
    cdeOnly: false,
    dataTypes: [],
    measureMapping: "",
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

    if (filterValues.measureMapping === "has_cde_mapping") {
      filters.push({
        field: "metadata.cde_mapping",
        operator: "size_gt",
        value: 0,
      })
    }

    if (filterValues.measureMapping === "used_by_studies") {
      filters.push({
        field: "metadata.study_variable_mappings",
        operator: "size_gt",
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
    simpleSearch,
  }

  const variablesQuery = useQuery({
    queryFn: () => {
      if (!searchTerm) return null
      return fetchVariables(payload)
    },
    queryKey: `variables-${JSON.stringify(payload)}`,
  })

  const hasActiveFilters =
    filterValues.cdeOnly ||
    filterValues.dataTypes.length > 0 ||
    !!filterValues.measureMapping

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
    {
      key: "measureMapping",
      label: "Measure Mapping",
      type: "select",
      options: [
        { value: "has_cde_mapping", label: "Has mapped CDE" },
        { value: "used_by_studies", label: "CDE measures used by studies" },
      ],
    },
  ]

  useEffect(() => {
    setPage(1)
  }, [simpleSearch])

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const variables = variablesQuery.data?.results ?? []
  const totalCount =
    variablesQuery.data?.metadata?.total_count ?? variables.length

  return (
    <EntityPanel
      query={variablesQuery}
      results={variables}
      totalCount={totalCount}
      entityNames={{ singular: "variable", plural: "variables" }}
      page={page}
      onPageChange={setPage}
      filterConfigs={filterConfigs}
      filterValues={filterValues}
      onFilterChange={handleFilterChange}
      hasActiveFilters={hasActiveFilters}
      resetKey={simpleSearch}
      ingestionPanel="variables"
      detailPlaceholder="Select a variable to view details"
      renderSidebarItem={(variable, { active, onClick }) => (
        <EntitySidebarItem
          key={variable.id}
          entity={variable}
          collectionKey="variables"
          panelLocation={PANEL_LOCATIONS.VARIABLES}
          searchTerm={searchTerm}
          onClick={onClick}
          active={active}
          bookmarkSx={{ p: 0 }}
          title={<h4 className="font-semibold break-all">{variable.id}</h4>}
        >
          <p className="text-sm text-gray-500">{variable.description ?? ""}</p>
        </EntitySidebarItem>
      )}
      renderDetail={(variable) => (
        <VariableDetail
          key={variable.id}
          variable={variable}
          searchTerm={searchTerm}
        />
      )}
    />
  )
}
