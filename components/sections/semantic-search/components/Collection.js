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

      <div className="flex flex-col gap-2 overflow-auto flex-1 min-h-0">
        <div>
          <h4 className="mb-2 uppercase text-sm font-medium text-gray-500">
            Studies ({collection.studies.list.length})
          </h4>
          <CollectionList collection={collection.studies} />
        </div>
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-500">
            CDEs ({collection.cdes.list.length})
          </h4>
          <CollectionList collection={collection.cdes} />
        </div>
        <div>
          <h4 className="mb-2 uppercase text-sm font-medium text-gray-500">
            Concepts ({collection.concepts.list.length})
          </h4>
          <CollectionList collection={collection.concepts} />
        </div>
        <div>
          <h4 className="mb-2 uppercase text-sm font-medium text-gray-500">
            Variables ({collection.variables.list.length})
          </h4>
          <CollectionList collection={collection.variables} />
        </div>
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
        onClick={() => {
          trackCollectionDownloadClick({
            studies,
            cdes,
            concepts,
            variables,
          })

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
