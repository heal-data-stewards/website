// Headline number card with optional sub-line and sparkline

function Sparkline({ series, color }) {
  if (!series?.length) return null
  const mn = Math.min(...series)
  const mx = Math.max(...series)
  const range = mx - mn || 1
  return (
    <div className="mt-2 flex h-8 items-end gap-[2px]">
      {series.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${Math.round(30 + ((v - mn) / range) * 70)}%`,
            background: color,
          }}
        />
      ))}
    </div>
  )
}

export default function MetricCard({
  label,
  value,
  sub,
  spark,
  sparkColor,
  small,
}) {
  return (
    <div className="rounded-lg border border-gray-light bg-white p-3 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-gray">
        {label}
      </div>
      <div
        className={`${small ? "text-xl" : "text-3xl"} font-bold text-purple`}
      >
        {value ?? "—"}
      </div>
      {typeof sub === "string" ? (
        <div className="text-xs text-gray">{sub}</div>
      ) : (
        sub
      )}
      {spark && <Sparkline series={spark} color={sparkColor} />}
    </div>
  )
}
