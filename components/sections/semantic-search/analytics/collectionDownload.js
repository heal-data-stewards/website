import { sendCustomEvent } from "utils/analytics"
import { buildCollectionAnalyticsParams } from "./collectionParams"

export function trackCollectionDownloadClick({
  studies,
  cdes,
  concepts,
  variables,
}) {
  sendCustomEvent(
    "hss_collection_downloaded",
    buildCollectionAnalyticsParams({ studies, cdes, concepts, variables })
  )
}
