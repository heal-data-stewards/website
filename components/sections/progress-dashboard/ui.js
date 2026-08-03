// Small presentational building blocks shared across dashboard sections
import { COLORS, fmt, trendDelta } from "./lib"

export function Card({ className = "", children }) {
  return (
    <div
      className={`rounded-lg border border-gray-light bg-white p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, badge }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <span className="text-sm font-bold text-purple">{title}</span>
      {badge && (
        <span className="rounded-full bg-blue/10 px-2.5 py-0.5 text-xs font-semibold text-blue">
          {badge}
        </span>
      )}
    </div>
  )
}

export function SectionLabel({ title, desc }) {
  return (
    <div className="mb-2 mt-6 first:mt-0">
      <h3 className="text-sm font-bold uppercase tracking-wide text-purple">
        {title}
      </h3>
      {desc && <p className="mt-0.5 text-xs text-gray">{desc}</p>}
    </div>
  )
}

export function Note({ children, className = "" }) {
  return <p className={`mt-2 text-xs text-gray ${className}`}>{children}</p>
}

// Green/amber/red service health indicator
export function StatusDot({ status, label }) {
  const color =
    status === "up"
      ? COLORS.teal
      : status === "degraded"
      ? COLORS.amber
      : status
      ? COLORS.red
      : "rgba(255,255,255,0.4)"
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ background: color }}
      />
      {label}
    </span>
  )
}

// "↑ +12 (4%)" change indicator computed from the time series
export function TrendDelta({ series, dataKey }) {
  const d = trendDelta(series, dataKey)
  if (!d) return <div className="text-xs text-gray">—</div>
  const arrow = d.delta > 0 ? "↑" : d.delta < 0 ? "↓" : "→"
  const sign = d.delta >= 0 ? "+" : ""
  const color =
    d.delta > 0 ? "text-emerald-600" : d.delta < 0 ? "text-coral" : "text-gray"
  return (
    <div className={`text-xs font-semibold ${color}`}>
      {arrow} {sign}
      {fmt(d.delta)} ({sign}
      {d.pct}%)
    </div>
  )
}
