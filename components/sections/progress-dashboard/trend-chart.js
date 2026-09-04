import { Fragment, useState } from "react"
// recharts is pinned to 2.x: v3 depends on @reduxjs/toolkit, whose ESM build
// Amplify's lambda file tracing misses, 500ing every SSR'd page (July 2026)
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { COLORS, fmt } from "./lib"

const SERIES = [
  { key: "total_live", label: "Live studies", color: COLORS.blue },
  { key: "cedar_complete", label: "CEDAR complete", color: COLORS.amber },
  { key: "vlmd_available", label: "VLMD available", color: COLORS.teal },
  { key: "cde_studies", label: "Using CDEs", color: COLORS.coral },
  { key: "data_linked", label: "Data linked", color: COLORS.purple },
  { key: "archived_count", label: "Archived", color: COLORS.gray },
]

const AXIS_TICK = { fontSize: 11, fill: "rgba(83,37,101,0.6)" }
const GRID_STROKE = "rgba(83,37,101,0.08)"

const formatMonthTick = (d) => {
  if (!d) return ""
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  })
}

// Multi-series area chart with a clickable legend that focuses one line
export default function TrendChart({
  timeSeries,
  granularity = "weekly",
  badge,
}) {
  const [focused, setFocused] = useState(null)
  const tickFormatter =
    granularity === "monthly" ? formatMonthTick : (d) => d?.slice(5) ?? ""

  return (
    <div>
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {SERIES.map((s) => {
            const dimmed = focused !== null && focused !== s.key
            return (
              <Fragment key={s.key}>
                {s.key === "cde_studies" && <span className="basis-full" />}
                <button
                  onClick={() => setFocused(focused === s.key ? null : s.key)}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs transition-opacity ${
                    focused === s.key
                      ? "border-purple bg-purple/5 font-semibold"
                      : "border-gray-light"
                  } ${dimmed ? "opacity-40" : ""}`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ background: s.color }}
                  />
                  {s.label}
                </button>
              </Fragment>
            )
          })}
        </div>
        {badge && (
          <span className="shrink-0 rounded-full bg-blue/10 px-2.5 py-0.5 text-xs font-semibold text-blue">
            {badge}
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={timeSeries}>
          <CartesianGrid stroke={GRID_STROKE} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={tickFormatter}
            tick={AXIS_TICK}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={AXIS_TICK}
            tickFormatter={fmt}
            width={48}
          />
          <Tooltip formatter={(value) => fmt(value)} />
          {SERIES.map((s) => {
            const dimmed = focused !== null && focused !== s.key
            return (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={focused === s.key ? 3 : 2}
                strokeOpacity={dimmed ? 0.2 : 1}
                fill={s.color}
                fillOpacity={dimmed ? 0.03 : 0.09}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            )
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
