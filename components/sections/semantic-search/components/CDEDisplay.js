import { CircularProgress, IconButton } from "@mui/material"
import { useQuery } from "utils/use-query"
import { fetchCDEs } from "../data/cdes"
import Link from "../../../elements/link"
import {
  Bookmark,
  Download,
  BookmarkBorder,
  SearchOff,
} from "@mui/icons-material"
import StyledAccordion from "../accordion"
import { useCollectionContext } from "../context/collection"
import { Empty } from "./Empty"

export function CDEDisplay({
  studyId,
  elementIds,
  conceptId,
  searchTerm,
  emptyText = "No CDEs match your search.",
  emptyIcon = <SearchOff />,
}) {
  const collection = useCollectionContext()

  const payload = {
    query: searchTerm ?? "",
    ...(studyId && { parentIds: [studyId] }),
    ...(elementIds && { elementIds: elementIds }),
    ...(conceptId && { concept: conceptId }),
  }

  const cdesQuery = useQuery({
    queryFn: () => {
      return fetchCDEs(payload)
    },
    queryKey: `cdes-${JSON.stringify(payload)}`,
  })

  if (cdesQuery.isLoading) {
    return (
      <div className="h-56 flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  if (cdesQuery.error) {
    return (
      <div className="h-56 flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading CDEs</span>
      </div>
    )
  }

  const cdes = cdesQuery.data.results

  if (cdes.length === 0) {
    return <Empty icon={emptyIcon} text={emptyText} />
  }
  return (
    <StyledAccordion
      items={cdes.map((cde) => ({
        key: cde.id,
        summary: (
          <div className="flex justify-between items-center w-full">
            <h4>
              {cde.name}&nbsp;
              <span className="text-sm text-gray-500">{cde.id}</span>
            </h4>
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
        ),
        details: (
          <div>
            <Link to={cde.action}>
              {cde.action} <Download fontSize="small" />
            </Link>
            <p className="mt-1">{cde.description}</p>
          </div>
        ),
      }))}
    />
  )
}
