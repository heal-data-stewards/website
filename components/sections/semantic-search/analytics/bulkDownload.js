import { sendCustomEvent } from "utils/analytics"

export function trackBulkResultsDownloadClick({
  entityType,
  searchTerm,
  simpleSearch,
  count,
  totalCount,
  truncated,
}) {
  sendCustomEvent(`hss_${entityType}_bulk_downloaded`, {
    downloaded_entity_type: entityType,
    downloaded_result_count: count,
    total_result_count: totalCount,
    downloaded_results_truncated: Boolean(truncated),
    search_term: searchTerm,
    simple_search: Boolean(simpleSearch),
  })
}
