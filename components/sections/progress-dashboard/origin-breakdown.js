import { fmt } from "./lib"
import MetricCard from "./metric-card"
import { Card, SectionLabel } from "./ui"

const ORIGINS = [
  { key: "hdp", label: "HDP", sub: "NIH-funded", inMetrics: true },
  { key: "ctn", label: "CTN", sub: "clinical trials network", inMetrics: true },
  { key: "zia", label: "ZIA", sub: "intramural", inMetrics: true },
  { key: "icpsr", label: "ICPSR", sub: "ICPSR studies", inMetrics: true },
  { key: "other", label: "Other", sub: "no appl_id", inMetrics: true },
  { key: "pdaps", label: "PDAPS", sub: "policy studies", inMetrics: false },
]

function fmtDate(isoStr) {
  if (!isoStr) return "—"
  return new Date(isoStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Live study counts by funding / data source origin
export default function OriginBreakdown({ summary }) {
  const breakdown = summary.latest?.platform?.study_breakdown ?? {}
  const asOf = fmtDate(summary.latest?.collected_at)
  const total = ORIGINS.reduce((sum, o) => sum + (breakdown[o.key] ?? 0), 0)
  const inMetrics = ORIGINS.filter((o) => o.inMetrics).reduce(
    (sum, o) => sum + (breakdown[o.key] ?? 0),
    0
  )

  return (
    <div>
      <SectionLabel
        title="HDP Studies by Types"
        desc="Breakdown of live HEAL studies by funding or data source origin. Studies may enter the platform through multiple pathways."
      />
      <Card>
        <div className="mb-4 space-y-0.5">
          <div className="text-sm text-gray">
            Total studies on HDP as of {asOf}:{" "}
            <span className="font-semibold text-purple">{fmt(total)}</span>
          </div>
          <div className="text-sm text-gray">
            Studies from HDP part of metrics as of {asOf}:{" "}
            <span className="font-semibold text-purple">{fmt(inMetrics)}</span>
            <span className="ml-1.5 text-xs text-gray">(excludes PDAPS)</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ORIGINS.map((o) => (
            <MetricCard
              key={o.key}
              label={o.label}
              value={fmt(breakdown[o.key])}
              sub={o.sub}
              dimmed={!o.inMetrics}
              dimmedNote="not in metrics"
            />
          ))}
        </div>
      </Card>
    </div>
  )
}
