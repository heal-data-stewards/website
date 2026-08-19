import { useState } from "react"
import { Download } from "@mui/icons-material"
import {
  Alert,
  CircularProgress,
  IconButton,
  Snackbar,
  Tooltip,
} from "@mui/material"
import { trackBulkResultsDownloadClick } from "../analytics"
import {
  MAX_DOWNLOADABLE_RESULTS,
  downloadAllResults,
} from "../data/bulk-download"

export function BulkDownloadButton({
  entityType,
  entityNames,
  searchTerm,
  simpleSearch,
}) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [status, setStatus] = useState(null)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const { count, totalCount, truncated } = await downloadAllResults({
        entityType,
        query: searchTerm,
        simpleSearch,
      })

      trackBulkResultsDownloadClick({
        entityType,
        searchTerm,
        simpleSearch,
        count,
        totalCount,
        truncated,
      })

      if (truncated) {
        setStatus({
          severity: "warning",
          message: `Downloaded the first ${count.toLocaleString()} ${
            entityNames.plural
          } — the search API can't return more than ${MAX_DOWNLOADABLE_RESULTS.toLocaleString()} results for one query.`,
        })
      }
    } catch (e) {
      setStatus({
        severity: "error",
        message: `Couldn't download all ${entityNames.plural} for this search. Please try again.`,
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <>
      <Tooltip
        title={`Download all ${entityNames.plural} matching this search as JSON. The filters and sorting on this panel are not applied.`}
      >
        {/* span keeps the tooltip working while the button is disabled */}
        <span>
          <IconButton
            size="small"
            aria-label={`Download all ${entityNames.plural} as JSON`}
            disabled={isDownloading}
            onClick={handleDownload}
            sx={{ color: "#4d2862" }}
          >
            {isDownloading ? (
              <CircularProgress size={18} sx={{ color: "#4d2862" }} />
            ) : (
              <Download fontSize="small" />
            )}
          </IconButton>
        </span>
      </Tooltip>

      <Snackbar
        open={Boolean(status)}
        autoHideDuration={6000}
        onClose={(_, reason) => {
          if (reason !== "clickaway") setStatus(null)
        }}
      >
        <Alert severity={status?.severity} onClose={() => setStatus(null)}>
          {status?.message}
        </Alert>
      </Snackbar>
    </>
  )
}
