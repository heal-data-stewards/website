import { sendCustomEvent } from "utils/analytics"

function stringifyArray(value) {
  return JSON.stringify(value)
}

export function trackCollectionDownloadClick({
  studies,
  cdes,
  concepts,
  variables,
}) {
  sendCustomEvent("hss_collection_downloaded", {
    downloaded_collection_study_ids: stringifyArray(studies.ids),
    downloaded_collection_study_labels: stringifyArray(studies.labels),
    downloaded_collection_study_count: studies.count,

    downloaded_collection_cde_ids: stringifyArray(cdes.ids),
    downloaded_collection_cde_labels: stringifyArray(cdes.labels),
    downloaded_collection_cde_count: cdes.count,

    downloaded_collection_concept_ids: stringifyArray(concepts.ids),
    downloaded_collection_concept_labels: stringifyArray(concepts.labels),
    downloaded_collection_concept_count: concepts.count,

    downloaded_collection_variable_ids: stringifyArray(variables.ids),
    downloaded_collection_variable_labels: stringifyArray(variables.labels),
    downloaded_collection_variable_count: variables.count,
  })
}
