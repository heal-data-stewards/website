import { DUG_API_URL } from "./config"

export const fetchCDEs = async ({ query, limit = 100, offset = 0 }) => {
  const res = await fetch(`${DUG_API_URL}/cdes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      limit,
      offset,
    }),
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch CDEs, issue with HTTP request: ${res.statusText}`
    )
  }

  const json = await res.json()
  return json
}
