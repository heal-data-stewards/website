import { PercentBar } from "./bars"
import { COLORS, fmt, fmtCapped } from "./lib"
import MetricCard from "./metric-card"
import { MiniTrendChart } from "./trend-chart"
import { Card, CardHeader, Note, SectionLabel, TrendDelta } from "./ui"

// HEAL Semantic Search (Dug) index stats and study coverage
export default function HssSection({ summary }) {
  const hss = summary.latest?.hss ?? {}
  const timeSeries = summary.time_series ?? []
  const studiesIndexed = hss.studies_indexed || 1

  return (
    <div>
      <SectionLabel
        title="HEAL Semantic Search Status"
        desc="Counts from the HEAL Semantic Search (Dug) index. Variables are capped at 10,000 by Elasticsearch default."
      />
      <Card className="mb-3">
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            small
            label="Studies in HSS"
            value={fmt(hss.studies_indexed)}
            sub="of total"
          />
          <MetricCard
            small
            label="CDEs indexed"
            value={fmt(hss.cdes_indexed)}
            sub={<TrendDelta series={timeSeries} dataKey="cdes_indexed" />}
          />
          <MetricCard
            small
            label="Variables indexed"
            value={fmtCapped(hss.variables_indexed ?? 0, 10000)}
            sub={<TrendDelta series={timeSeries} dataKey="variables_indexed" />}
          />
          <MetricCard
            small
            label="Concepts"
            value={fmt(hss.concepts)}
            sub={<TrendDelta series={timeSeries} dataKey="concepts" />}
          />
        </div>
        <div className="mt-3">
          <MiniTrendChart
            timeSeries={timeSeries}
            dataKey="variables_indexed"
            label="Variables in HSS"
            color={COLORS.purple}
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="HSS ingested elements' breakdown" badge="live" />
        <PercentBar
          label="Data available"
          value={hss.studies_with_data_available}
          base={studiesIndexed}
          color={COLORS.blue}
          showPct={false}
        />
        <PercentBar
          label="Studies with VLMD"
          value={hss.studies_with_vlmd}
          base={studiesIndexed}
          color={COLORS.purple}
          showPct={false}
        />
        <PercentBar
          label="CDE instruments linked"
          value={hss.studies_with_cde_sections}
          base={studiesIndexed}
          color={COLORS.pink}
          showPct={false}
        />
        <PercentBar
          label="Studies with Variable mapped to CDE measures"
          value={hss.studies_with_cde_mapping}
          base={studiesIndexed}
          color={COLORS.coral}
          showPct={false}
        />
        <Note>of {fmt(hss.studies_indexed)} studies indexed in HSS</Note>
      </Card>
    </div>
  )
}
