import { sendCustomEvent } from "utils/analytics"
import { buildDownloadedCollectionAnalyticsParams } from "./collectionParams"

export function trackCollectionDownloadClick({
  studies,
  cdes,
  concepts,
  variables,
}) {
  sendCustomEvent(
    "hss_collection_downloaded",
    buildDownloadedCollectionAnalyticsParams({
      studies,
      cdes,
      concepts,
      variables,
    })
  )
}
