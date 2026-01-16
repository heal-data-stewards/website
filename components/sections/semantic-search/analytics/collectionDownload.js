import { sendCustomEvent } from "utils/analytics"

function stringify(value) {
  return JSON.stringify(value)
}

export function trackCollectionDownloadClick({
  studies,
  cdes,
  concepts,
  variables,
}) {
  const collectionSnapshot = {
    studies,
    cdes,
    concepts,
    variables,
  }

  sendCustomEvent("hss_collection_downloaded", {
    downloaded_collection_study_ids: stringify(studies.ids),
    downloaded_collection_study_labels: stringify(studies.labels),
    downloaded_collection_study_count: studies.count,

    downloaded_collection_cde_ids: stringify(cdes.ids),
    downloaded_collection_cde_labels: stringify(cdes.labels),
    downloaded_collection_cde_count: cdes.count,

    downloaded_collection_concept_ids: stringify(concepts.ids),
    downloaded_collection_concept_labels: stringify(concepts.labels),
    downloaded_collection_concept_count: concepts.count,

    downloaded_collection_variable_ids: stringify(variables.ids),
    downloaded_collection_variable_labels: stringify(variables.labels),
    downloaded_collection_variable_count: variables.count,

    downloaded_collection_snapshot: stringify(collectionSnapshot),
  })
}
