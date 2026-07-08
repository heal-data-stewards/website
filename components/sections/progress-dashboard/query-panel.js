import { useState } from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import DownloadIcon from "@mui/icons-material/Download"
import { CSVLink } from "react-csv"
import { useQuery } from "utils/use-query"
import { fetchQuery, fmtColHeader, QUERIES } from "./lib"

// List of runnable ad-hoc queries; results open in a modal with CSV download
export default function QueryPanel({ queryApiBase }) {
  const [activeQuery, setActiveQuery] = useState(null)

  return (
    <>
      <div className="divide-y divide-gray-light/60">
        {QUERIES.map((q) => (
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
            <Button
              variant="outlined"
              size="small"
              onClick={() => setActiveQuery(q)}
            >
              Run
            </Button>
          </div>
        ))}
      </div>
      {activeQuery && (
        <QueryResultsModal
          query={activeQuery}
          queryApiBase={queryApiBase}
          onClose={() => setActiveQuery(null)}
        />
      )}
    </>
  )
}

function QueryResultsModal({ query, queryApiBase, onClose }) {
  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    queryKey: `heal-adhoc-${query.key}`,
    queryFn: () => fetchQuery(queryApiBase, query.key),
  })

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", gap: 1, pr: 1 }}
      >
        <span className="flex-1 text-lg font-bold text-purple">
          {query.label}
        </span>
        {results?.length > 0 && (
          <CSVLink
            data={results}
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
            <ResultsTable results={results} />
          ) : (
            <p className="py-8 text-center text-gray">No results returned.</p>
          ))}
      </DialogContent>
    </Dialog>
  )
}

function ResultsTable({ results }) {
  const cols = Object.keys(results[0])
  return (
    <>
      <p className="mb-2 text-xs font-semibold text-emerald-600">
        {results.length} row{results.length !== 1 ? "s" : ""}
      </p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-purple/20 text-left">
            {cols.map((c) => (
              <th key={c} className="py-2 pr-4 font-semibold text-purple">
                {fmtColHeader(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((row, i) => (
            <tr key={i} className="border-b border-gray-light/60">
              {cols.map((c) => (
                <td key={c} className="py-1.5 pr-4 text-gray-dark">
                  {row[c] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
