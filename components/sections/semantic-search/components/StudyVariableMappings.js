import { useQuery } from "utils/use-query"
import { CircularProgress, IconButton, Tooltip } from "@mui/material"
import StyledAccordion from "../accordion"
import { fetchStudies } from "../data/studies"
import { ENTITY_TYPES } from "../data/entity"
import {
  Bookmark,
  BookmarkBorder,
  OpenInNew,
  ReadMore,
} from "@mui/icons-material"
import Link from "../../../elements/link"
import { useCollectionContext } from "../context/collection"
import { useEntityModal } from "../context/entity-modal"
import { UI_SURFACES } from "../analytics"

export function StudyVariableMappings({ studyMappings }) {
  const collection = useCollectionContext()
  const modal = useEntityModal()

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
              {study.metadata?.["Data Availability"] === "available" && (
                <span className="inline-block bg-[#982568] text-white rounded-md px-2 py-1 flex-shrink-0 mx-2">
                  Data available
                </span>
              )}
              <span className="text-sm text-gray-500">
                {studyMappings[study.id]?.join(", ") ?? "No mapped variables"}
              </span>
            </h4>
            <div className="flex items-center flex-shrink-0">
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
              {modal && (
                <Tooltip title="View study details">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation()
                      modal.openEntity({
                        type: ENTITY_TYPES.STUDIES,
                        id: study.id,
                        entity: study,
                        uiSurface: UI_SURFACES.STUDY_MAPPINGS_ROW,
                      })
                    }}
                  >
                    <ReadMore fontSize="small" sx={{ color: "#4d2862" }} />
                  </IconButton>
                </Tooltip>
              )}
            </div>
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
