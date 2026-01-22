import { CircularProgress, IconButton, Tooltip } from "@mui/material"
import { useQuery } from "utils/use-query"
import { fetchStudies } from "../data/studies"
import Link from "../../../elements/link"
import { Bookmark, OpenInNew, BookmarkBorder } from "@mui/icons-material"
import StyledAccordion from "../accordion"
import { useCollectionContext } from "../context/collection"
import {
  trackBookmarkClick,
  trackStudiesAccordionToggle,
  trackHdpLinkClick,
  PANEL_LOCATIONS,
  UI_SURFACES,
} from "../analytics"

export function ParentStudiesDisplay({
  studyIds,
  titleFormatter,
  notFoundText,
  conceptId,
  searchTerm,
  panelLocation,
}) {
  const collection = useCollectionContext()

  const payload = conceptId
    ? {
        query: searchTerm,
        concept: conceptId,
      }
    : {
        query: "",
        elementIds: studyIds,
      }

  const studiesQuery = useQuery({
    queryFn: () => {
      return fetchStudies(payload)
    },
    queryKey: `studies-${JSON.stringify(payload)}`,
  })

  if (studiesQuery.isLoading) {
    return (
      <div className="h-56 flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  if (studiesQuery.error) {
    return (
      <div className="h-56 flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading studies</span>
      </div>
    )
  }

  const studies = studiesQuery.data.results

  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-1">
        {titleFormatter ? (
          titleFormatter(studies.length)
        ) : (
          <>
            Parent Studies
            {studies.length > 0 && ` (${studies.length.toLocaleString()})`}
          </>
        )}
      </h3>
      {studies.length === 0 ? (
        <p className="text-gray-400 italic">
          {notFoundText ?? "No parents found for this study."}
        </p>
      ) : (
        <StyledAccordion
          onToggle={({ item, isExpanded }) => {
            trackStudiesAccordionToggle({
              action: isExpanded ? "open" : "close",
              study: item,
              panelLocation,
              referringSearchTerm: searchTerm,
            })
          }}
          items={studies.map((study) => ({
            key: study.id,
            summary: (
              <div className="flex justify-between items-center w-full">
                <h4>{study.name}</h4>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    const isBookmarked = collection.studies.has(study)
                    collection.studies.toggle(study)
                    trackBookmarkClick({
                      action: isBookmarked ? "remove" : "add",
                      entity: study,
                      panelLocation:
                        panelLocation ?? PANEL_LOCATIONS.PARENT_STUDIES,
                      uiSurface: UI_SURFACES.RIGHT_DETAIL,
                      referringSearchTerm: searchTerm,
                    })
                  }}
                >
                  {collection.studies.has(study) ? (
                    <Bookmark fontSize="small" sx={{ color: "#4d2862" }} />
                  ) : (
                    <BookmarkBorder
                      fontSize="small"
                      sx={{ color: "#4d2862" }}
                    />
                  )}
                </IconButton>
              </div>
            ),
            details: (
              <div>
                <p>
                  Study ID:{" "}
                  <Link
                    to={study.action}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseDown={() => {
                      trackHdpLinkClick({
                        study,
                        panelLocation:
                          panelLocation ?? PANEL_LOCATIONS.PARENT_STUDIES,
                        uiSurface: UI_SURFACES.RIGHT_DETAIL,
                        referringSearchTerm: searchTerm,
                      })
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        trackHdpLinkClick({
                          study,
                          panelLocation:
                            panelLocation ?? PANEL_LOCATIONS.PARENT_STUDIES,
                          uiSurface: UI_SURFACES.RIGHT_DETAIL,
                          referringSearchTerm: searchTerm,
                        })
                      }
                    }}
                  >
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
      )}
    </>
  )
}
