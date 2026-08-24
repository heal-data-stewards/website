import { useMemo, useState } from "react"

/**
 * Sort options for the v2 search endpoints. An option without a `field` sorts
 * by relevance: the API applies ES score when no sort keys are sent.
 *
 * `field` must name a sortable ES field on the index being queried — a missing
 * mapping makes the whole request fail, so only offer an option on a panel
 * whose index actually maps that field.
 */
export const RELEVANCE_SORT = {
  key: "relevance",
  label: "Relevance",
}

export const PROJECT_START_DATE_SORT = {
  key: "projectStartDate",
  label: "Project Start Date",
  field: "metadata.Project Start Date",
}

export const PROJECT_END_DATE_SORT = {
  key: "projectEndDate",
  label: "Project End Date",
  field: "metadata.Project End Date",
}

export const DEFAULT_SORT = { key: RELEVANCE_SORT.key, order: "desc" }

export const buildSortPayload = (options, value) => {
  const option = options?.find((o) => o.key === value?.key)
  if (!option?.field) return []
  return [{ field: option.field, order: value.order }]
}

/**
 * Sort state for a result panel. `sort` is the request payload; `sortValue` and
 * `setSortValue` drive the <SortControl />.
 */
export const useSort = (options) => {
  const [sortValue, setSortValue] = useState(DEFAULT_SORT)

  const sort = useMemo(
    () => buildSortPayload(options, sortValue),
    [options, sortValue]
  )

  return { sortValue, setSortValue, sort }
}
