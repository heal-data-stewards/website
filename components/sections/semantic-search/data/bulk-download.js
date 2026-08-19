import { fetchCDEs } from "./cdes"
import { fetchConcepts } from "./concepts"
import { fetchStudies } from "./studies"
import { fetchVariables } from "./variables"

export const BULK_DOWNLOAD_PAGE_SIZE = 5000

// The search API is backed by Elasticsearch's default 10,000 result window —
// asking for anything past it fails, and `total_count` itself tops out there.
export const MAX_DOWNLOADABLE_RESULTS = 10000

const FETCHERS = {
  studies: fetchStudies,
  cdes: fetchCDEs,
  concepts: fetchConcepts,
  variables: fetchVariables,
}

export function bulkDownloadFileName(query, entityType) {
  const slug = String(query ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 60)
    .replace(/^-+|-+$/g, "")

  return `${slug ? `${slug}-` : ""}${entityType}.json`
}

/**
 * Re-runs the panel's search with a very large page size so the whole result
 * set comes back in one or two requests, then saves it as a JSON file.
 */
export async function downloadAllResults({ entityType, query, simpleSearch }) {
  const fetchResults = FETCHERS[entityType]
  if (!fetchResults) throw new Error(`Unknown entity type: ${entityType}`)

  const results = []
  let totalCount = 0

  while (results.length < MAX_DOWNLOADABLE_RESULTS) {
    const offset = results.length
    const json = await fetchResults({
      query,
      limit: Math.min(
        BULK_DOWNLOAD_PAGE_SIZE,
        MAX_DOWNLOADABLE_RESULTS - offset
      ),
      offset,
      simpleSearch,
    })

    const page = json?.results ?? []
    results.push(...page)
    totalCount = json?.metadata?.total_count ?? results.length

    if (page.length === 0 || results.length >= totalCount) break
  }

  const truncated =
    results.length < totalCount || results.length >= MAX_DOWNLOADABLE_RESULTS

  const file = {
    query,
    type: entityType,
    results,
    metadata: {
      total_count: totalCount,
      downloaded_count: results.length,
      truncated,
    },
  }

  const blob = new Blob([JSON.stringify(file, null, 2)], {
    type: "application/json",
  })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = bulkDownloadFileName(query, entityType)
  a.click()
  URL.revokeObjectURL(url)

  return { count: results.length, totalCount, truncated }
}
