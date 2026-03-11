import { useQuery } from "utils/use-query"
import { CircularProgress, IconButton } from "@mui/material"
import { fetchCDEs } from "../data/cdes"
import { useCollectionContext } from "../context/collection"
import { Bookmark, BookmarkBorder } from "@mui/icons-material"

export function MappedCDEMeasure({ cdeMappings }) {
  const collection = useCollectionContext()

  const payload = {
    query: "",
    elementIds: [cdeMappings.cde],
  }

  const cdeQuery = useQuery({
    queryFn: () => {
      return fetchCDEs(payload)
    },
    queryKey: `mapped-cde-measure-${JSON.stringify(payload)}`,
  })

  if (cdeQuery.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }
  if (
    cdeQuery.error ||
    !Array.isArray(cdeQuery.data?.results) ||
    cdeQuery.data.results.length === 0
  ) {
    return (
      <div className="h-full flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading results</span>
      </div>
    )
  }

  const cde = cdeQuery.data.results[0]

  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-semibold leading-relaxed text-[#592963]">
          {cdeMappings.measure}
        </h3>
        <p>{cde.name}</p>
        <p className="text-sm mt-2 text-gray-600">{cde.description}</p>
      </div>

      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation()
          collection.cdes.toggle(cde)
        }}
      >
        {collection.cdes.has(cde) ? (
          <Bookmark fontSize="small" sx={{ color: "#4d2862" }} />
        ) : (
          <BookmarkBorder fontSize="small" sx={{ color: "#4d2862" }} />
        )}
      </IconButton>
    </div>
  )
}
