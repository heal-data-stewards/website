import { sendCustomEvent } from "utils/analytics"

export function trackCollectionClearedClick({
  totalCount,
  studiesCount,
  cdesCount,
  conceptsCount,
  variablesCount,
}) {
  sendCustomEvent("hss_collection_cleared", {
    cleared_collection_total_count: totalCount,
    cleared_collection_studies_count: studiesCount,
    cleared_collection_cdes_count: cdesCount,
    cleared_collection_concepts_count: conceptsCount,
    cleared_collection_variables_count: variablesCount,
  })
}
