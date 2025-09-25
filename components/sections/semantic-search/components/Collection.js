import { Bookmarks, Download } from "@mui/icons-material"
import { Button } from "@mui/material"
import { useCollectionContext } from "../context/collection"

export function Collection() {
  const collection = useCollectionContext()

  return (
    <div className="border-solid border-[1px] border-gray-200 shadow-md p-4 rounded-md">
      <div className="flex items-center gap-2 text-[#4d2862]">
        <Bookmarks fontSize="medium" />
        <h3 className="text-lg font-semibold">Collection</h3>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-2">
        <div>
          <h4 className="mb-2 uppercase text-sm font-medium text-gray-500">
            Studies ({collection.studies.list.length})
          </h4>
          <ul className="list-disc list-inside text-xs">
            {collection.studies.list.map((study) => (
              <li key={study.id}>{study.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-2 uppercase text-sm font-medium text-gray-500">
            Concepts ({collection.concepts.list.length})
          </h4>
          <ul className="list-disc list-inside text-xs">
            {collection.concepts.list.map((concept) => (
              <li key={concept.id}>{concept.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-2 uppercase text-sm font-medium text-gray-500">
            Variables ({collection.variables.list.length})
          </h4>
          <ul className="list-disc list-inside text-xs">
            {collection.variables.list.map((variable) => (
              <li key={variable.id}>{variable.name}</li>
            ))}
          </ul>
        </div>
      </div>
      <hr className="my-4" />
      <Button
        variant="contained"
        fullWidth
        endIcon={<Download />}
        onClick={collection.downloadAll}
      >
        Download JSON
      </Button>
    </div>
  )
}
