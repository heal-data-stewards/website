import { useQuery } from "utils/use-query"
import { CircularProgress, IconButton, Tooltip } from "@mui/material"
import StyledAccordion from "../accordion"
import { fetchStudies } from "../data/studies"
import { Bookmark, BookmarkBorder, OpenInNew } from "@mui/icons-material"
import Link from "../../../elements/link"
import { useCollectionContext } from "../context/collection"

export function StudyVariableMappings({ studyMappings }) {
  const collection = useCollectionContext()

  const payload = {
    query: "",
    elementIds: Object.keys(studyMappings),
  }
  const studies = useQuery({
    queryFn: () => {
      return fetchStudies(payload)
    },
    queryKey: `study-variable-mappings-${JSON.stringify(payload)}`,
  })

  if (studies.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }
  if (studies.error || !Array.isArray(studies.data?.results)) {
    return (
      <div className="h-full flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading results</span>
      </div>
    )
  }

  return (
    <StyledAccordion
      items={studies.data.results.map((study) => ({
        key: study.id,
        summary: (
          <div className="flex justify-between items-center w-full">
            <h4>
              {study.name}{" "}
              <span className="text-sm text-gray-500">
                {studyMappings[study.id]?.join(", ") ?? "No mapped variables"}
              </span>
            </h4>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                collection.studies.toggle(study)
              }}
            >
              {collection.studies.has(study) ? (
                <Bookmark fontSize="small" sx={{ color: "#4d2862" }} />
              ) : (
                <BookmarkBorder fontSize="small" sx={{ color: "#4d2862" }} />
              )}
            </IconButton>
          </div>
        ),
        details: (
          <div>
            <p>
              Study ID:{" "}
              <Link to={study.action} target="_blank" rel="noopener noreferrer">
                <Tooltip
                  title="Open study in the HEAL Data Platform"
                  placement="right"
                >
                  {study.id.split(":")?.[1] ?? study.id}{" "}
                  <OpenInNew fontSize="small" />
                </Tooltip>
              </Link>
            </p>
            <p className="mt-1">{study.description}</p>
          </div>
        ),
      }))}
    />
  )
}
