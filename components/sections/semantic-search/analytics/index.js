import { sendCustomEvent } from "utils/analytics"

export * from "./bookmark"
export * from "./cdeAccordion"
export * from "./cdeDownload"
export * from "./collectionCleared"
export * from "./collectionDownload"
export * from "./collectionUpload"
export * from "./constants"
export * from "./csvDownload"
export * from "./entityModal"
export * from "./hdp-link"
export * from "./leftList"
export * from "./newConceptSearch"
export * from "./ontology-link"
export * from "./studiesAccordion"
export * from "./variableAccordion"

function getFilterValueCount(value) {
  if (Array.isArray(value)) {
    return value.length
  }

  if (typeof value === "boolean") {
    return value ? 1 : 0
  }

  return value ? 1 : 0
}

function getFilterValueSummary(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "(none)"
    }

    return value.length === 1 ? String(value[0]) : `${value.length} selected`
  }

  if (typeof value === "boolean") {
    return value ? "checked" : "unchecked"
  }

  return value ? String(value) : "(none)"
}

export function trackFilterChanged({
  filterKey,
  value,
  panelLocation,
  uiSurface,
  referringSearchTerm,
}) {
  const filterValueCount = getFilterValueCount(value)

  sendCustomEvent("hss_filter_changed", {
    action: filterValueCount > 0 ? "apply" : "clear",
    filter_key: filterKey,
    filter_value: getFilterValueSummary(value),
    filter_value_count: filterValueCount,
    panel_location: `${panelLocation} panel`,
    ui_surface: uiSurface,
    referring_search_term: referringSearchTerm ?? "(none)",
  })
}

export function trackFilterPanelToggled({
  action,
  panelLocation,
  uiSurface,
  referringSearchTerm,
  hasActiveFilters,
  hasActiveSort,
}) {
  sendCustomEvent("hss_filter_panel_toggled", {
    action,
    panel_location: `${panelLocation} panel`,
    ui_surface: uiSurface,
    referring_search_term: referringSearchTerm ?? "(none)",
    has_active_filters: hasActiveFilters,
    has_active_sort: hasActiveSort,
  })
}

export function trackSortChanged({
  action,
  sortKey,
  sortOrder,
  panelLocation,
  uiSurface,
  referringSearchTerm,
}) {
  sendCustomEvent("hss_sort_changed", {
    action,
    sort_key: sortKey,
    sort_order: sortOrder,
    panel_location: `${panelLocation} panel`,
    ui_surface: uiSurface,
    referring_search_term: referringSearchTerm ?? "(none)",
  })
}
