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
import { Card, CardHeader, SectionLabel, StatusDot, TrendDelta } from "./ui"

const RANGES = [
  { value: 1, label: "30 days" },
  { value: 3, label: "3 months" },
  { value: 6, label: "6 months" },
  { value: 12, label: "12 months" },
  { value: "all", label: "All time" },
]

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

  const [months, setMonths] = useState(6)
  const {
    data: summary,
    isLoading,
    error,
  } = useQuery({
    queryKey: `heal-summary-${months}`,
    queryFn: () => fetchSummary(apiBase, months),
  })

  return (
    <div className="container mb-16">
      <TopBar summary={summary} months={months} onRangeChange={setMonths} />

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
          <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <PlatformStatus summary={summary} />
              <div className="mt-2.5">
                <GrowthTrend summary={summary} />
              </div>
              <div className="mt-2.5">
                <StudyBreakdown summary={summary} />
              </div>
            </div>
            <div>
              <HssSection summary={summary} />
              <SectionLabel
                title="Ad-hoc Data Queries"
                desc="Run on-demand queries against the HEAL study database. Results open in a pop-up with a CSV download option."
              />
              <Card>
                <QueryPanel queryApiBase={queryApiBase} />
              </Card>
            </div>
          </div>

          <div className="mt-2.5">
            <OriginBreakdown summary={summary} />
          </div>
          <div className="mt-2.5">
            <RepoPrograms summary={summary} queryApiBase={queryApiBase} />
          </div>
        </>
      )}
    </div>
  )
}

function TopBar({ summary, months, onRangeChange }) {
  const health = summary?.latest?.api_health ?? {}
  const collectedAt = summary?.latest?.collected_at

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-purple px-4 py-3 text-white">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <StatusDot status={health.mds} label="healdata.org" />
        <StatusDot status={health.hss} label="Semantic Search" />
        <StatusDot status={health.healdatafair} label="healdatafair.org" />
        {collectedAt && (
          <span className="text-xs text-white/60">
            Refreshed: {new Date(collectedAt).toLocaleString()}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {RANGES.map((r) => (
          <button
            key={r.value}
            onClick={() => onRangeChange(r.value)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              months === r.value
                ? "bg-white text-purple"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
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
        />
        <MetricCard
          label="Studies with Data linked on HDP"
          value={fmt(pipeline.data_linked_on_platform)}
          sub={<TrendDelta series={timeSeries} dataKey="data_linked" />}
          spark={timeSeries.map((s) => s.data_linked ?? 0)}
          sparkColor={COLORS.purple}
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

function GrowthTrend({ summary }) {
  return (
    <div>
      <SectionLabel
        title="HDP Growth over time"
        desc="Trend of key study milestones over the selected time window. Click a label to highlight a single line."
      />
      <Card>
        <CardHeader
          title="HDP Study counts — rolling trend"
          badge="weekly snapshots"
        />
        <TrendChart timeSeries={summary.time_series ?? []} />
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
