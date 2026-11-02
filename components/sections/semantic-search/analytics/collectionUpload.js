import { sendCustomEvent } from "utils/analytics"
import { buildCollectionAnalyticsParams } from "./collectionParams"

export function trackCollectionUploadClick({
  studies,
  cdes,
  concepts,
  variables,
}) {
  sendCustomEvent(
    "hss_collection_uploaded",
    buildCollectionAnalyticsParams({ studies, cdes, concepts, variables })
  )
}
