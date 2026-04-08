import { sendCustomEvent } from "utils/analytics"

function stringify(value) {
  return JSON.stringify(value)
}

export function trackCsvCollectionDownloadClick({
  category,
  ids,
  labels,
  count,
}) {
  const categoryMap = {
    studies: "study",
    cdes: "cde",
    concepts: "concept",
    variables: "variable",
  }

  const singularCategory = categoryMap[category] || category

  const eventName = `hss_${category}_csv_downloaded`

  sendCustomEvent(eventName, {
    [`downloaded_collection_${singularCategory}_count`]: count,
    [`downloaded_collection_${singularCategory}_ids`]: stringify(ids),
    [`downloaded_collection_${singularCategory}_labels`]: stringify(labels),
  })
}
