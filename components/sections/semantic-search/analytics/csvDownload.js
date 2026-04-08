// /components/sections/semantic-search/analytics/csvDownload.js

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
  const categoryKey = category === "cdes" ? "cde" : category.slice(0, -1)

  // Dynamic event name based on category
  const eventName = `hss_${categoryKey}_csv_downloaded`

  sendCustomEvent(eventName, {
    // Dynamic parameter names that match your collectionDownload structure
    [`downloaded_collection_${categoryKey}_count`]: count,
    [`downloaded_collection_${categoryKey}_ids`]: stringify(ids),
    [`downloaded_collection_${categoryKey}_labels`]: stringify(labels),
  })
}
