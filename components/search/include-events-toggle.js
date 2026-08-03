// Algolia filter applied when calendar events should be excluded. Events are
// tagged `type:event` by the crawler; non-event records have no `type` (or
// `type:page`), so `NOT type:event` still returns them.

// Ensure `type:event` is set in the Aloglia index config as "filter only".
export const EVENTS_EXCLUDED_FILTER = "NOT type:event"

// Query param value used for filter
export const EVENTS_PARAM_VALUE = "included"

export function IncludeEventsToggle({
  checked,
  onChange,
  id = "include-events",
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 text-sm text-gray-dark cursor-pointer select-none"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-purple"
      />
      Include calendar events
    </label>
  )
}
