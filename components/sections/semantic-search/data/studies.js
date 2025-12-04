import { DUG_API_URL } from "./config"

export const fetchStudies = async ({
  query,
  parentIds,
  elementIds,
  concept,
  limit = 100,
  offset = 0,
}) => {
  const res = await fetch(`${DUG_API_URL}/studies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...(typeof query === "string" && { query }),
      ...(parentIds && parentIds.length > 0 && { parent_ids: parentIds }),
      ...(elementIds && elementIds.length > 0 && { element_ids: elementIds }),
      ...(typeof concept === "string" && { concept }),
      size: limit,
      offset,
    }),
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch studies, issue with HTTP request: ${res.statusText}`
    )
  }

  const json = await res.json()
  return json
}
