import { DUG_API_URL } from "./config"

export const fetchConcepts = async ({
  query,
  conceptTypes,
  limit = 100,
  offset = 0,
}) => {
  const res = await fetch(`${DUG_API_URL}/concepts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      query,
      conceptTypes,
      limit,
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
