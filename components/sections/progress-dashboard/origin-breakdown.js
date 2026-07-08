import { fmt } from "./lib"
import MetricCard from "./metric-card"
import { Card, CardHeader, SectionLabel } from "./ui"

const ORIGINS = [
  { key: "pdaps", label: "PDAPS", sub: "policy studies" },
  { key: "ctn", label: "CTN", sub: "clinical trials network" },
  { key: "zia", label: "ZIA", sub: "intramural" },
  { key: "icpsr", label: "ICPSR", sub: "ICPSR studies" },
  { key: "hdp", label: "HDP", sub: "NIH-funded" },
  { key: "other", label: "Other", sub: "no appl_id" },
]

// Live study counts by funding / data source origin
export default function OriginBreakdown({ summary }) {
  const breakdown = summary.latest?.platform?.study_breakdown ?? {}
  const total = ORIGINS.reduce((sum, o) => sum + (breakdown[o.key] ?? 0), 0)

  return (
    <div>
      <SectionLabel
        title="HDP Studies by Types"
        desc="Breakdown of live HEAL studies by funding or data source origin. Studies may enter the platform through multiple pathways."
      />
      <Card>
        <CardHeader
          title={`Latest study counts by origin — ${fmt(total)} total`}
          badge="live"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ORIGINS.map((o) => (
            <MetricCard
              key={o.key}
              label={o.label}
              value={fmt(breakdown[o.key])}
              sub={o.sub}
            />
          ))}
        </div>
      </Card>
    </div>
  )
}
