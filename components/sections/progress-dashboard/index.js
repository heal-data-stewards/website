import { useState } from "react"
import { QueryCacheProvider, useQuery } from "utils/use-query"
import { PercentBar } from "./bars"
import HssSection from "./hss-section"
import {
  COLORS,
  DEFAULT_API_BASE,
  DEFAULT_QUERY_API_BASE,
  fetchSummary,
  fmt,
} from "./lib"
import MetricCard from "./metric-card"
import OriginBreakdown from "./origin-breakdown"
import QueryPanel from "./query-panel"
import RepoPrograms from "./repo-programs"
import TrendChart from "./trend-chart"
import { Card, SectionLabel, TrendDelta } from "./ui"

// "all" uses a sentinel start date well before the earliest snapshot (Dec 2024);
// the API just clips list_range() to whatever snapshots actually exist.
const RANGES = [
  { label: "30 days", days: 30 },
  { label: "6 months", days: 182 },
  { label: "12 months", days: 365 },
  { label: "All time", days: null },
]

const todayISO = () => new Date().toISOString().slice(0, 10)

const subDays = (days) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

const presetRange = (range) => ({
  start: range.days == null ? "2000-01-01" : subDays(range.days),
  end: todayISO(),
})

export default function ProgressDashboard({ data }) {
  return (
    <QueryCacheProvider>
      <Dashboard data={data} />
    </QueryCacheProvider>
  )
}

function Dashboard({ data }) {
  // Endpoints are editable in Strapi; fall back to the deployed AWS URLs
  const apiBase = (data?.apiBase || DEFAULT_API_BASE).replace(/\/+$/, "")
  const queryApiBase = data?.queryApiBase || DEFAULT_QUERY_API_BASE

  // filter is always a { start, end } date range; presets just populate it
  const [filter, setFilter] = useState(() => presetRange(RANGES[1]))
  const filterKey = `${filter.start}-${filter.end}`

  const {
    data: summary,
    isLoading,
    error,
  } = useQuery({
    queryKey: `heal-summary-${filterKey}`,
    queryFn: () => fetchSummary(apiBase, filter),
  })

  return (
    <div className="container mb-16">
      <TopBar summary={summary} filter={filter} onFilterChange={setFilter} />

      {isLoading && (
        <div className="py-16 text-center text-gray">Loading HEAL metrics…</div>
      )}
      {error && (
        <div className="rounded-lg border border-coral bg-coral-light/30 p-4 text-sm text-red">
          Could not load data: {error}
        </div>
      )}

      {summary && (
        <>
          <PlatformStatus summary={summary} />
          <div className="mt-2.5 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <GrowthTrend summary={summary} />
            <StudyBreakdown summary={summary} />
          </div>
          <div className="mt-2.5">
            <OriginBreakdown summary={summary} />
          </div>

          <div className="mt-2.5">
            <HssSection summary={summary} />
          </div>

          <div className="mt-2.5">
            <SectionLabel
              title="Query the MySQL Database"
              desc="Run on-demand queries against the HEAL study database. Results open in a pop-up with a CSV download option."
            />
            <Card>
              <QueryPanel
                queryApiBase={queryApiBase}
                repositories={summary.latest?.platform?.repositories ?? []}
              />
            </Card>
          </div>

          <div className="mt-2.5">
            <RepoPrograms summary={summary} queryApiBase={queryApiBase} />
          </div>
        </>
      )}
    </div>
  )
}

function TopBar({ summary, filter, onFilterChange }) {
  const collectedAt = summary?.latest?.collected_at

  const [start, setStart] = useState(filter.start)
  const [end, setEnd] = useState(filter.end)

  const activePreset = RANGES.find((r) => {
    const p = presetRange(r)
    return p.start === start && p.end === end
  })

  const handlePreset = (r) => {
    const { start: s, end: e } = presetRange(r)
    setStart(s)
    setEnd(e)
    onFilterChange({ start: s, end: e })
  }

  const handleStartChange = (value) => {
    setStart(value)
    if (value && end) onFilterChange({ start: value, end })
  }

  const handleEndChange = (value) => {
    setEnd(value)
    if (start && value) onFilterChange({ start, end: value })
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-purple px-4 py-3 text-white">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex flex-wrap items-center gap-1">
          {RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => handlePreset(r)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                activePreset?.label === r.label
                  ? "bg-white text-purple"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <input
            type="date"
            value={start}
            onChange={(e) => handleStartChange(e.target.value)}
            className="rounded border border-white/30 bg-white/10 px-2 py-0.5 text-xs text-white [color-scheme:dark]"
          />
          <span className="text-xs text-white/60">to</span>
          <input
            type="date"
            value={end}
            onChange={(e) => handleEndChange(e.target.value)}
            className="rounded border border-white/30 bg-white/10 px-2 py-0.5 text-xs text-white [color-scheme:dark]"
          />
        </div>
      </div>
      {collectedAt && (
        <span className="text-xs text-white/60">
          Refreshed: {new Date(collectedAt).toLocaleString()}
        </span>
      )}
    </div>
  )
}

function PlatformStatus({ summary }) {
  const studies = summary.latest?.platform?.studies ?? {}
  const pipeline = summary.latest?.platform?.pipeline ?? {}
  const timeSeries = summary.time_series ?? []

  return (
    <div>
      <SectionLabel
        title="HEAL Data Platform(HDP) Status"
        desc="Live study counts and key data sharing milestones pulled directly from the HEAL Data Platform."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard
          label="Live HEAL studies on HDP"
          value={fmt(studies.total_live)}
          sub={`${fmt(studies.unregistered)} unregistered`}
          spark={timeSeries.map((s) => s.total_live ?? 0)}
          sparkColor={COLORS.blue}
          note="This count excludes PDAPS studies, matching HEAL Stewards' tracked metrics. See the HDP Studies by Types breakdown below for the full platform total, which includes PDAPS."
        />
        <MetricCard
          label="Studies with Data linked on HDP"
          value={fmt(pipeline.data_linked_on_platform)}
          sub={<TrendDelta series={timeSeries} dataKey="data_linked" />}
          spark={timeSeries.map((s) => s.data_linked ?? 0)}
          sparkColor={COLORS.purple}
          note="This count excludes PDAPS studies, matching HEAL Stewards' tracked metrics. See the HDP Studies by Types breakdown below for the full platform total, which includes PDAPS."
        />
        <MetricCard
          label="Studies with VLMD available on HDP"
          value={fmt(pipeline.vlmd_available)}
          sub={<TrendDelta series={timeSeries} dataKey="vlmd_available" />}
          spark={timeSeries.map((s) => s.vlmd_available ?? 0)}
          sparkColor={COLORS.amber}
        />
      </div>
    </div>
  )
}

// Beyond ~3 months of weekly snapshots the chart gets too busy; fall back to
// one point per month (the last snapshot in each month) for longer ranges.
const MONTHLY_THRESHOLD_DAYS = 90

function toMonthlyPoints(timeSeries) {
  const byMonth = new Map()
  for (const point of timeSeries) byMonth.set(point.date.slice(0, 7), point)
  return Array.from(byMonth.values())
}

function GrowthTrend({ summary }) {
  const raw = summary.time_series ?? []
  const spanDays =
    raw.length > 1
      ? (new Date(raw[raw.length - 1].date) - new Date(raw[0].date)) / 86400000
      : 0
  const monthly = spanDays > MONTHLY_THRESHOLD_DAYS
  const points = monthly ? toMonthlyPoints(raw) : raw

  return (
    <div>
      <SectionLabel
        title="HDP Growth over time"
        desc="Trend of key study milestones over the selected time window. Click a label to highlight a single line."
      />
      <Card>
        <TrendChart
          timeSeries={points}
          granularity={monthly ? "monthly" : "weekly"}
          badge={monthly ? "monthly snapshots" : "weekly snapshots"}
        />
      </Card>
    </div>
  )
}

function StudyBreakdown({ summary }) {
  const studies = summary.latest?.platform?.studies ?? {}
  const pipeline = summary.latest?.platform?.pipeline ?? {}
  const base = studies.total_live || 1

  const rows = [
    { label: "Registered", value: studies.registered, color: COLORS.teal },
    { label: "Unregistered", value: studies.unregistered, color: COLORS.pink },
    {
      label: "Data linked on platform",
      value: pipeline.data_linked_on_platform,
      color: COLORS.blue,
    },
    {
      label: "VLMD available",
      value: pipeline.vlmd_available,
      color: COLORS.teal,
    },
    {
      label: "CEDAR form >50% complete",
      value: summary.latest?.platform?.cedar_complete ?? 0,
      color: COLORS.amber,
    },
    {
      label: "Reported use of CDEs",
      value: summary.latest?.platform?.cde_studies ?? 0,
      color: COLORS.coral,
    },
    {
      label: "Not sharing data",
      value: pipeline.not_sharing_data,
      color: COLORS.red,
    },
  ]

  return (
    <div>
      <SectionLabel
        title="Study registration and data sharing status"
        desc="All percentages are of live HEAL studies on HDP. Use this to gauge overall data sharing progress."
      />
      <Card>
        {rows.map((row) => (
          <PercentBar key={row.label} base={base} {...row} />
        ))}
      </Card>
    </div>
  )
}
