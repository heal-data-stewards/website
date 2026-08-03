import { useRef, useState } from "react"
import { Bookmarks, Close, Delete, Download, Upload } from "@mui/icons-material"
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Tooltip,
} from "@mui/material"
import { useCollectionContext } from "../context/collection"
import { collectionUploadSchema } from "../context/upload-schema"
import { useEntityModal } from "../context/entity-modal"
import {
  trackCsvCollectionDownloadClick,
  trackCollectionDownloadClick,
  trackCollectionUploadClick,
  trackCollectionClearedClick,
  UI_SURFACES,
} from "../analytics"

export function Collection() {
  const collection = useCollectionContext()
  const fileInputRef = useRef(null)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [pendingUpload, setPendingUpload] = useState(null)

  const getEntityAnalytics = (list) => ({
    ids: list.map((item) => item.id),
    labels: list.map((item) => item.name),
    count: list.length,
  })

  const studies = getEntityAnalytics(collection.studies.list)
  const cdes = getEntityAnalytics(collection.cdes.list)
  const concepts = getEntityAnalytics(collection.concepts.list)
  const variables = getEntityAnalytics(collection.variables.list)

  const totalCount =
    studies.ids.length +
    cdes.ids.length +
    concepts.ids.length +
    variables.ids.length

  const applyUpload = async ({ data, fileName, count }) => {
    const validated = await collection.uploadAll(data)

    trackCollectionUploadClick({
      studies: getEntityAnalytics(validated.studies),
      cdes: getEntityAnalytics(validated.cdes),
      concepts: getEntityAnalytics(validated.concepts),
      variables: getEntityAnalytics(validated.variables),
    })
    setUploadStatus({
      severity: "success",
      message: `Loaded ${count} bookmark${
        count === 1 ? "" : "s"
      } from "${fileName}"`,
    })
  }

  const handleUploadFile = async (event) => {
    const file = event.target.files?.[0]
    // reset so selecting the same file again re-triggers onChange
    event.target.value = ""
    if (!file) return

    try {
      const data = await collectionUploadSchema.validate(
        JSON.parse(await file.text())
      )
      const count =
        data.studies.length +
        data.cdes.length +
        data.concepts.length +
        data.variables.length

      if (count === 0) {
        setUploadStatus({
          severity: "info",
          message: `No bookmarks found in "${file.name}"`,
        })
        return
      }

      const upload = { data, fileName: file.name, count }
      if (collection.hasItems) {
        setPendingUpload(upload)
      } else {
        await applyUpload(upload)
      }
    } catch (error) {
      setUploadStatus({
        severity: "error",
        message:
          error.name === "ValidationError"
            ? `"${file.name}" doesn't look like a bookmarks file (${error.message})`
            : `Couldn't read "${file.name}" — it isn't valid JSON`,
      })
    }
  }

  return (
    <div className="border-solid border-[1px] border-gray-200 shadow-md p-4 rounded-md flex flex-col min-h-0">
      <div className="flex items-center gap-2 text-[#4d2862]">
        <Bookmarks fontSize="medium" />
        <h3 className="text-lg font-semibold">Bookmarks</h3>
      </div>

      <hr className="my-4" />

      <div className="flex flex-col gap-3 overflow-auto flex-1 min-h-0">
        {[
          { title: "Studies", entityType: "studies", c: collection.studies },
          { title: "CDEs", entityType: "cdes", c: collection.cdes },
          { title: "Concepts", entityType: "concepts", c: collection.concepts },
          {
            title: "Variables",
            entityType: "variables",
            c: collection.variables,
          },
        ].map(({ title, entityType, c }) => (
          <div key={title}>
            <div className="flex justify-between mb-1 items-center">
              <h4 className="uppercase text-sm font-medium text-gray-500">
                {title} ({c.list.length})
              </h4>
              {c.list.length > 0 && (
                <button
                  className="text-sm text-[#4d2862] hover:text-[#982568] transition-colors duration-75 flex items-center gap-1"
                  onClick={() => {
                    const categoryData = getEntityAnalytics(c.list)

                    trackCsvCollectionDownloadClick({
                      category: title.toLowerCase(),
                      ids: categoryData.ids,
                      labels: categoryData.labels,
                      count: categoryData.count,
                    })
                    c.downloadCsv(title)
                  }}
                >
                  CSV
                  <Download fontSize="small" />
                </button>
              )}
            </div>
            <CollectionList collection={c} entityType={entityType} />
          </div>
        ))}
      </div>

      <hr className="my-4" />

      {collection.hasItems && (
        <Button
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          endIcon={<Delete />}
          onClick={() => {
            trackCollectionClearedClick({
              totalCount,
              studiesCount: collection.studies.list.length,
              cdesCount: collection.cdes.list.length,
              conceptsCount: collection.concepts.list.length,
              variablesCount: collection.variables.list.length,
            })

            collection.clearAll()
          }}
        >
          Clear Bookmarks
        </Button>
      )}
      <div className="flex items-center gap-1">
        <Button
          variant="contained"
          fullWidth
          endIcon={<Download />}
          onMouseDown={() => {
            trackCollectionDownloadClick({
              studies,
              cdes,
              concepts,
              variables,
            })
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              trackCollectionDownloadClick({
                studies,
                cdes,
                concepts,
                variables,
              })
            }
          }}
          onClick={() => {
            collection.downloadAll()
          }}
        >
          Download JSON
        </Button>
        <Tooltip title="Upload bookmarks file">
          <IconButton
            aria-label="Upload bookmarks file"
            sx={{ color: "#4d2862" }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload />
          </IconButton>
        </Tooltip>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleUploadFile}
        />
      </div>

      <Dialog
        open={Boolean(pendingUpload)}
        onClose={() => setPendingUpload(null)}
      >
        <DialogTitle>Replace existing bookmarks?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Uploading &quot;{pendingUpload?.fileName}&quot; will replace your{" "}
            {totalCount} current bookmark{totalCount === 1 ? "" : "s"} with the{" "}
            {pendingUpload?.count} bookmark
            {pendingUpload?.count === 1 ? "" : "s"} from the file. This cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingUpload(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              const upload = pendingUpload
              setPendingUpload(null)
              await applyUpload(upload)
            }}
          >
            Replace
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(uploadStatus)}
        autoHideDuration={5000}
        onClose={(_, reason) => {
          if (reason !== "clickaway") setUploadStatus(null)
        }}
      >
        <Alert
          severity={uploadStatus?.severity}
          onClose={() => setUploadStatus(null)}
        >
          {uploadStatus?.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

function CollectionList({ collection, entityType }) {
  const modal = useEntityModal()

  return (
    <ul className="text-xs flex flex-col gap-1">
      {collection.list.map((item) => (
        <li key={item.id} className="flex items-start">
          <IconButton
            sx={{ width: "14px", height: "14px", mr: "2px" }}
            onClick={() => {
              collection.remove(item)
            }}
          >
            <Close sx={{ width: "14px", height: "14px" }} />
          </IconButton>
          {modal ? (
            <button
              className="text-left hover:text-[#982568] hover:underline transition-colors duration-75"
              onClick={() =>
                modal.openEntity({
                  type: entityType,
                  id: item.id,
                  entity: item,
                  uiSurface: UI_SURFACES.BOOKMARKS_SIDEBAR,
                })
              }
            >
              {item.name}
            </button>
          ) : (
            item.name
          )}
        </li>
      ))}
    </ul>
  )
}
