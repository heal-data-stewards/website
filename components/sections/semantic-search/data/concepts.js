import { DUG_API_URL } from "./config"

export const fetchConcepts = async ({
  query,
  conceptTypes,
  limit = 100,
  offset = 0,
  filters = [],
  aggs = {},
}) => {
  const res = await fetch(`${DUG_API_URL}/concepts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      ...(typeof query === "string" && query !== "" && { query }),
      ...(conceptTypes &&
        conceptTypes.length > 0 && { concept_types: conceptTypes }),
      ...(filters.length > 0 && { filters }),
      ...(Object.keys(aggs).length > 0 && { aggs }),
      size: limit,
      offset,
    }),
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch concepts, issue with HTTP request: ${res.statusText}`
    )
  }

  const json = await res.json()
  return json
}
