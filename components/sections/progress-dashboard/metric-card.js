// Headline number card with optional sub-line and sparkline

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import Tooltip from "@mui/material/Tooltip"

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
  dimmed,
  dimmedNote,
  note,
}) {
  return (
    <div
      className={`rounded-lg border p-3 shadow-sm ${
        dimmed
          ? "border-gray-light bg-gray-50 opacity-60"
          : "border-gray-light bg-white"
      }`}
    >
      <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-gray">
        <span>{label}</span>
        {note && (
          <Tooltip title={note} arrow>
            <InfoOutlinedIcon
              sx={{ fontSize: 13 }}
              className="cursor-help text-gray-400"
            />
          </Tooltip>
        )}
        {dimmed && dimmedNote && (
          <span className="rounded bg-gray-100 px-1 py-0.5 text-[9px] font-normal normal-case text-gray">
            {dimmedNote}
          </span>
        )}
      </div>
      <div
        className={`${small ? "text-xl" : "text-3xl"} font-bold ${
          dimmed ? "text-gray" : "text-purple"
        }`}
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
