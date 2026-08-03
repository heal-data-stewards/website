import { fmt, pct } from "./lib"

// Label + horizontal fill bar sized as a percentage of `base`
export function PercentBar({ label, value, base, color, showPct = true }) {
  const width = pct(value, base)
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-44 shrink-0 text-sm leading-snug text-gray-dark">
        {label}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-light/40">
        <div
          className="h-full rounded-full"
          style={{ width: width === "—" ? 0 : width, background: color }}
        />
      </div>
      <span
        className="w-24 shrink-0 text-right text-sm font-semibold"
        style={{ color }}
      >
        {showPct ? `${fmt(value)} (${width})` : fmt(value)}
      </span>
    </div>
  )
}

// Label + bar sized relative to the largest count in the group
export function CountBar({ name, count, max, color }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-48 shrink-0 text-sm leading-snug text-gray-dark">
        {name}
      </span>
      <div className="h-4 flex-1 overflow-hidden rounded bg-gray-light/40">
        <div
          className="h-full rounded"
          style={{
            width: `${max ? Math.round((count / max) * 100) : 0}%`,
            background: color,
            opacity: 0.85,
          }}
        />
      </div>
      <span className="w-14 shrink-0 text-right text-sm font-bold text-gray-dark">
        {fmt(count)}
      </span>
    </div>
  )
}
