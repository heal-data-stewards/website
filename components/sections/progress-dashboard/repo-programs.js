import { useState } from "react"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import Tooltip from "@mui/material/Tooltip"
import { useQuery } from "utils/use-query"
import { CountBar } from "./bars"
import { BAR_COLORS, fetchQuery, fmt } from "./lib"
import MetricCard from "./metric-card"
import { Card, Note, SectionLabel, TrendDelta } from "./ui"

// Repository selections, research programs, and research networks
export default function RepoPrograms({ summary, queryApiBase }) {
  const [tab, setTab] = useState("repo")

  const platform = summary.latest?.platform ?? {}
  const repos = platform.repositories ?? []
  const programs = platform.programs ?? []
  const timeSeries = summary.time_series ?? []
  const totalSelected = repos.reduce((sum, r) => sum + r.count, 0)
  const dataLinked = platform.pipeline?.data_linked_on_platform ?? 0

  return (
    <div>
      <SectionLabel
        title="Repository & NIH Research Program"
        desc="Which repositories HEAL studies have selected for data deposit, and breakdown by NIH research program and steward-defined research network."
      />
      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Studies with repo selected"
          value={fmt(totalSelected)}
          sub={<TrendDelta series={timeSeries} dataKey="repo_selected" />}
        />
        <MetricCard
          label="Repositories in use"
          value={repos.length}
          sub="across all HEAL studies"
        />
        <MetricCard
          label="Data linked on platform"
          value={fmt(dataLinked)}
          sub={<TrendDelta series={timeSeries} dataKey="data_linked" />}
        />
        <MetricCard
          label="NIH Research programs"
          value={programs.length}
          sub="from MDS metadata"
        />
      </div>

      <Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-bold text-purple">Study breakdown</span>
          <Tabs
            value={tab}
            onChange={(e, value) => setTab(value)}
            sx={{ minHeight: 0, "& .MuiTab-root": { minHeight: 0, py: 1 } }}
          >
            <Tab label="By Repository" value="repo" />
            <Tooltip
              title="NIH-identified research initiatives that studies are associated with, sourced from MDS metadata."
              arrow
            >
              <Tab label="By NIH Research Program" value="prog" />
            </Tooltip>
            <Tooltip
              title="Groupings defined by HEAL Data Stewards to help organise and track related studies."
              arrow
            >
              <Tab label="By Research Network" value="resnet" />
            </Tooltip>
          </Tabs>
        </div>
        {tab === "repo" && (
          <>
            <BarList
              rows={repos.map((r) => ({ name: r.name, count: r.count }))}
            />
            <Note className="text-center">
              Bar width proportional to number of studies that selected this
              repository · from progress tracker
            </Note>
          </>
        )}
        {tab === "prog" && (
          <>
            <BarList
              rows={programs.map((p) => ({ name: p.name, count: p.count }))}
            />
            <Note className="text-center">
              Bar width proportional to number of studies in each NIH research
              program · from MDS metadata · registered studies only
            </Note>
          </>
        )}
        {tab === "resnet" && <ResearchNetworks queryApiBase={queryApiBase} />}
      </Card>
    </div>
  )
}

function BarList({ rows }) {
  if (!rows.length) return <Note>No data.</Note>
  const max = Math.max(...rows.map((r) => r.count))
  return (
    <div>
      {rows.map((r, i) => (
        <CountBar
          key={r.name ?? i}
          name={r.name || "—"}
          count={r.count}
          max={max}
          color={BAR_COLORS[i % BAR_COLORS.length]}
        />
      ))}
    </div>
  )
}

// Fetched lazily from the query API the first time the tab is opened
function ResearchNetworks({ queryApiBase }) {
  const { data, isLoading, error } = useQuery({
    queryKey: "heal-adhoc-research_network_freq",
    queryFn: () => fetchQuery(queryApiBase, "research_network_freq"),
  })

  if (isLoading) return <Note>Loading…</Note>
  if (error) return <Note className="text-red">Error: {error}</Note>
  return (
    <>
      <BarList
        rows={(data ?? []).map((r) => ({
          name: r.research_network,
          count: r.count,
        }))}
      />
      <Note className="text-center">
        Study count per research network · from study database
      </Note>
    </>
  )
}
