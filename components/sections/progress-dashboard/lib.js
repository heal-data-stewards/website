// Shared constants and helpers for the progress dashboard

export const DEFAULT_API_BASE =
  "https://ukx8knp2oa.execute-api.us-east-1.amazonaws.com"

export const DEFAULT_QUERY_API_BASE =
  "https://opzv7se6o6fpwzfpgt4uqne6rm0fnqtu.lambda-url.us-east-1.on.aws/"

export const COLORS = {
  blue: "#0044B3",
  teal: "#1D9E75",
  purple: "#532565",
  amber: "#EF9F27",
  red: "#BF362E",
  pink: "#982568",
  coral: "#C45D8C",
  indigo: "#441d4f",
  gray: "#818a91",
}

export const BAR_COLORS = [
  COLORS.purple,
  COLORS.pink,
  COLORS.blue,
  COLORS.coral,
  COLORS.teal,
  COLORS.amber,
  COLORS.indigo,
  "#8B5E9E",
  COLORS.gray,
]

// Ad-hoc queries served by the query Lambda (?name=<key>)
export const QUERIES = [
  {
    key: "research_network_freq",
    label: "Research Network Frequencies",
    desc: "Number of studies per research network",
  },
  {
    key: "ended_studies",
    label: "Studies Past End Date",
    desc: "Studies whose project end date has passed",
  },
  {
    key: "funding_ic_freq",
    label: "Funding IC Frequencies",
    desc: "Number of studies by administering IC",
  },
]

export const fmt = (n) => (n ?? 0).toLocaleString()

// Elasticsearch caps some counts (e.g. variables at 10,000)
export const fmtCapped = (n, cap) =>
  n >= cap ? n.toLocaleString() + "+" : fmt(n)

export const pct = (a, b) => (b ? Math.round((a / b) * 100) + "%" : "—")

// Compare the earliest non-zero value to the latest in the time series
export function trendDelta(timeSeries, key) {
  if (!timeSeries || timeSeries.length < 2) return null
  const vals = timeSeries.map((s) => s[key] ?? 0)
  const last = vals[vals.length - 1]
  const first = vals.find((v) => v > 0)
  if (!first) return null
  const delta = last - first
  const p = Math.round((Math.abs(delta) / first) * 100)
  return { delta, pct: delta >= 0 ? p : -p }
}

export function fmtColHeader(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export async function fetchSummary(apiBase, months) {
  const res = await fetch(`${apiBase}/api/metrics/summary?months=${months}`)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export async function fetchQuery(queryApiBase, name) {
  const res = await fetch(`${queryApiBase}?name=${encodeURIComponent(name)}`)
  if (!res.ok) throw new Error(`API returned ${res.status}`)
  const data = await res.json()
  return data.results ?? []
}
