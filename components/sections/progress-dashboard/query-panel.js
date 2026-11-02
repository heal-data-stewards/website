import { useMemo, useState } from "react"
import Autocomplete from "@mui/material/Autocomplete"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"
import TextField from "@mui/material/TextField"
import CloseIcon from "@mui/icons-material/Close"
import DownloadIcon from "@mui/icons-material/Download"
import { CSVLink } from "react-csv"
import { useQuery } from "utils/use-query"
import { fetchQuery, fmtColHeader, QUERIES } from "./lib"

const currentMonth = () => new Date().toISOString().slice(0, 7) // "YYYY-MM"

// Sentinel filter value for "this field is empty" — a plain "" filter value
// means "no filter applied" (see filteredResults below), so blanks need a
// distinct, selectable value to be filterable at all.
const BLANK_LABEL = "(Blank)"

// "YYYY-MM" -> "YYYY-MM-DD" for the 1st of the *following* month, used as an
// exclusive upper bound so the whole selected month is included in results.
function monthToBeforeDate(monthStr) {
  const [y, m] = monthStr.split("-").map(Number)
  return new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 10)
}

// List of runnable ad-hoc queries; results open in a modal with CSV download
export default function QueryPanel({ queryApiBase, repositories = [] }) {
  const [activeQuery, setActiveQuery] = useState(null)
  const [activeParams, setActiveParams] = useState({})
  const [dateInputs, setDateInputs] = useState({})
  const [selectInputs, setSelectInputs] = useState({})

  const repoNames = [
    ...new Set(repositories.map((r) => r.name).filter(Boolean)),
  ]
  repoNames.sort((a, b) => a.localeCompare(b))

  const runQuery = (q) => {
    setActiveQuery(q)
    if (q.dateFilter) {
      setActiveParams({
        [q.dateFilter.param]: monthToBeforeDate(
          dateInputs[q.key] || currentMonth()
        ),
      })
    } else if (q.selectFilter) {
      setActiveParams({
        [q.selectFilter.param]: selectInputs[q.key] || repoNames[0],
      })
    } else {
      setActiveParams({})
    }
  }

  return (
    <>
      <div className="divide-y divide-gray-light/60">
        {QUERIES.map((q) => {
          const disabled = q.selectFilter && repoNames.length === 0
          return (
            <div
              key={q.key}
              className="flex items-center justify-between gap-3 py-2.5"
            >
              <div>
                <div className="text-sm font-semibold text-gray-dark">
                  {q.label}
                </div>
                <div className="text-xs text-gray">{q.desc}</div>
              </div>
              <div className="flex items-center gap-2">
                {q.dateFilter && (
                  <label className="flex items-center gap-1.5 text-xs text-gray">
                    {q.dateFilter.label}
                    <input
                      type="month"
                      value={dateInputs[q.key] || currentMonth()}
                      onChange={(e) =>
                        setDateInputs((prev) => ({
                          ...prev,
                          [q.key]: e.target.value,
                        }))
                      }
                      className="rounded border border-gray-light px-2 py-1 text-xs text-gray-dark"
                    />
                  </label>
                )}
                {q.selectFilter && (
                  <label className="flex items-center gap-1.5 text-xs text-gray">
                    {q.selectFilter.label}
                    <select
                      value={selectInputs[q.key] || repoNames[0] || ""}
                      onChange={(e) =>
                        setSelectInputs((prev) => ({
                          ...prev,
                          [q.key]: e.target.value,
                        }))
                      }
                      disabled={disabled}
                      className="rounded border border-gray-light px-2 py-1 text-xs text-gray-dark"
                    >
                      {repoNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  disabled={disabled}
                  onClick={() => runQuery(q)}
                >
                  Run
                </Button>
              </div>
            </div>
          )
        })}
      </div>
      {activeQuery && (
        <QueryResultsModal
          query={activeQuery}
          params={activeParams}
          queryApiBase={queryApiBase}
          onClose={() => setActiveQuery(null)}
        />
      )}
    </>
  )
}

function QueryResultsModal({ query, params, queryApiBase, onClose }) {
  const paramKey = Object.keys(params).length ? JSON.stringify(params) : ""
  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    queryKey: `heal-adhoc-${query.key}-${paramKey}`,
    queryFn: () => fetchQuery(queryApiBase, query.key, params),
  })

  const columns = useMemo(
    () => (results?.length ? Object.keys(results[0]) : []),
    [results]
  )
  const [filters, setFilters] = useState({})

  // Distinct values per column, used as Autocomplete suggestions. Computed
  // from the full result set (not the filtered rows) so narrowing one
  // column's filter doesn't shrink another column's suggestion list.
  const columnOptions = useMemo(() => {
    const opts = {}
    for (const col of columns) {
      const values = [
        ...new Set(
          (results ?? [])
            .map((r) => r[col])
            .filter((v) => v !== null && v !== undefined && v !== "")
            .map(String)
        ),
      ].sort()
      opts[col] = [BLANK_LABEL, ...values]
    }
    return opts
  }, [results, columns])

  const filteredResults = useMemo(() => {
    if (!results) return results
    const active = Object.entries(filters).filter(([, v]) => v)
    if (!active.length) return results
    return results.filter((row) =>
      active.every(([col, val]) => {
        const cell = row[col]
        if (val === BLANK_LABEL) {
          return cell === null || cell === undefined || cell === ""
        }
        return String(cell ?? "")
          .toLowerCase()
          .startsWith(val.toLowerCase())
      })
    )
  }, [results, filters])

  return (
    <Dialog open onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", gap: 1, pr: 1 }}
      >
        <span className="flex-1 text-lg font-bold text-purple">
          {query.label}
        </span>
        {filteredResults?.length > 0 && (
          <CSVLink
            data={filteredResults}
            filename={`${query.key}_${new Date()
              .toISOString()
              .slice(0, 10)}.csv`}
          >
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
            >
              CSV
            </Button>
          </CSVLink>
        )}
        <IconButton onClick={onClose} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {isLoading && <p className="py-8 text-center text-gray">Loading…</p>}
        {error && <p className="py-8 text-center text-red">Error: {error}</p>}
        {results &&
          (results.length ? (
            <ResultsTable
              columns={columns}
              rows={filteredResults}
              totalCount={results.length}
              filters={filters}
              onFilterChange={setFilters}
              columnOptions={columnOptions}
            />
          ) : (
            <p className="py-8 text-center text-gray">No results returned.</p>
          ))}
      </DialogContent>
    </Dialog>
  )
}

function ResultsTable({
  columns,
  rows,
  totalCount,
  filters,
  onFilterChange,
  columnOptions,
}) {
  const hasActiveFilters = Object.values(filters).some(Boolean)

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-emerald-600">
          {rows.length === totalCount
            ? `${totalCount} row${totalCount !== 1 ? "s" : ""}`
            : `${rows.length} of ${totalCount} rows`}
        </p>
        {hasActiveFilters && (
          <button
            onClick={() => onFilterChange({})}
            className="text-xs text-purple underline"
          >
            Clear filters
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-purple/20 text-left">
              {columns.map((c) => (
                <th
                  key={c}
                  className="whitespace-nowrap py-2 pr-4 font-semibold text-purple"
                >
                  {fmtColHeader(c)}
                </th>
              ))}
            </tr>
            <tr className="border-b border-gray-light/60">
              {columns.map((c) => (
                <th key={c} className="pb-2 pr-4 font-normal">
                  <Autocomplete
                    freeSolo
                    size="small"
                    options={columnOptions[c] || []}
                    inputValue={filters[c] || ""}
                    onInputChange={(e, newValue) =>
                      onFilterChange((prev) => ({
                        ...prev,
                        [c]: newValue,
                      }))
                    }
                    sx={{ minWidth: 130 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Filter by"
                        variant="outlined"
                        sx={{
                          "& .MuiInputBase-root": {
                            fontSize: "0.75rem",
                            fontWeight: 400,
                            py: "1px !important",
                          },
                        }}
                      />
                    )}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-light/60">
                {columns.map((c) => (
                  <td
                    key={c}
                    className="whitespace-nowrap py-1.5 pr-4 text-gray-dark"
                  >
                    {row[c] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && (
        <p className="py-8 text-center text-gray">
          No rows match the current filters.
        </p>
      )}
    </>
  )
}
