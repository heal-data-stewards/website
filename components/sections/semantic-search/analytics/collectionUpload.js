import { sendCustomEvent } from "utils/analytics"

function stringify(value) {
  return JSON.stringify(value)
}

export function trackCollectionUploadClick({
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

  sendCustomEvent("hss_collection_uploaded", {
    uploaded_collection_study_ids: stringify(studies.ids),
    uploaded_collection_study_labels: stringify(studies.labels),
    uploaded_collection_study_count: studies.count,

    uploaded_collection_cde_ids: stringify(cdes.ids),
    uploaded_collection_cde_labels: stringify(cdes.labels),
    uploaded_collection_cde_count: cdes.count,

    uploaded_collection_concept_ids: stringify(concepts.ids),
    uploaded_collection_concept_labels: stringify(concepts.labels),
    uploaded_collection_concept_count: concepts.count,

    uploaded_collection_variable_ids: stringify(variables.ids),
    uploaded_collection_variable_labels: stringify(variables.labels),
    uploaded_collection_variable_count: variables.count,

    uploaded_collection_snapshot: stringify(collectionSnapshot),
  })
}
