import { Bookmarks, Close, Delete, Download } from "@mui/icons-material"
import { Button, IconButton } from "@mui/material"
import { useCollectionContext } from "../context/collection"
import {
  trackCollectionDownloadClick,
  trackCollectionClearedClick,
} from "../analytics"

export function Collection() {
  const collection = useCollectionContext()

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

  return (
    <div className="border-solid border-[1px] border-gray-200 shadow-md p-4 rounded-md flex flex-col min-h-0">
      <div className="flex items-center gap-2 text-[#4d2862]">
        <Bookmarks fontSize="medium" />
        <h3 className="text-lg font-semibold">Bookmarks</h3>
      </div>

      <hr className="my-4" />

      <div className="flex flex-col gap-3 overflow-auto flex-1 min-h-0">
        {[
          { title: "Studies", c: collection.studies },
          { title: "CDEs", c: collection.cdes },
          { title: "Concepts", c: collection.concepts },
          { title: "Variables", c: collection.variables },
        ].map(({ title, c }) => (
          <div key={title}>
            <div className="flex justify-between mb-1 items-center">
              <h4 className="uppercase text-sm font-medium text-gray-500">
                {title} ({c.list.length})
              </h4>
              {c.list.length > 0 && (
                <button
                  className="text-sm text-[#4d2862] hover:text-[#982568] transition-colors duration-75 flex items-center gap-1"
                  onClick={() => {
                    c.downloadCsv(title)
                  }}
                >
                  CSV
                  <Download fontSize="small" />
                </button>
              )}
            </div>
            <CollectionList collection={c} />
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
    </div>
  )
}

function CollectionList({ collection }) {
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
          {item.name}
        </li>
      ))}
    </ul>
  )
}
