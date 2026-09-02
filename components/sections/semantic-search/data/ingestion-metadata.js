import { useQuery } from "utils/use-query"
import { DUG_API_URL } from "./config"

// Maps each results panel to its corresponding key in the ingestion metadata
// `indices` object.
export const INGESTION_INDEX_KEYS = {
  studies: "studies",
  cdes: "sections",
  concepts: "concepts",
  variables: "variables",
}

export const fetchIngestionMetadata = async () => {
  const res = await fetch(`${DUG_API_URL}/ingestion_metadata`, {
    method: "GET",
    headers: { Accept: "application/json" },
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch ingestion metadata, issue with HTTP request: ${res.statusText}`
    )
  }

  const json = await res.json()
  return json
}

/**
 * Fetches the ingestion metadata once (cached via QueryCacheProvider) and returns
 * the ISO ingestion timestamp for the given panel, e.g. "cdes" -> sections index.
 */
export const useIngestionDate = (panel) => {
  const { data } = useQuery({
    queryFn: fetchIngestionMetadata,
    queryKey: "ingestion-metadata",
  })

  const key = INGESTION_INDEX_KEYS[panel]
  return data?.indices?.[key]?.ingested_at ?? null
}
