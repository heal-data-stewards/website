import { CircularProgress, IconButton, Tooltip } from "@mui/material"
import { useQuery } from "utils/use-query"
import { fetchStudies } from "../data/studies"
import Link from "../../../elements/link"
import {
  Bookmark,
  OpenInNew,
  BookmarkBorder,
  SearchOff,
} from "@mui/icons-material"
import StyledAccordion from "../accordion"
import { useCollectionContext } from "../context/collection"
import { Empty } from "./Empty"
import {
  trackBookmarkClick,
  trackStudiesAccordionToggle,
  trackHdpLinkClick,
  PANEL_LOCATIONS,
  UI_SURFACES,
} from "../analytics"

export function ParentStudiesDisplay({
  studyIds,
  conceptId,
  searchTerm,
  notFoundText = "No parents found for this study.",
  notFoundIcon = <SearchOff />,
  panelLocation,
  expandFirstItem = false,
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

  if (studies.length === 0) {
    return <Empty icon={notFoundIcon} text={notFoundText} />
  }
  return (
    <StyledAccordion
      onToggle={({ item, isExpanded }) => {
        trackStudiesAccordionToggle({
          action: isExpanded ? "open" : "close",
          study: item,
          panelLocation,
          referringSearchTerm: searchTerm,
        })
      }}
      items={studies.map((study, index) => ({
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
                <BookmarkBorder fontSize="small" sx={{ color: "#4d2862" }} />
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
                onClick={() =>
                  trackHdpLinkClick({
                    study: study,
                    panelLocation:
                      panelLocation ?? PANEL_LOCATIONS.PARENT_STUDIES,
                    uiSurface: UI_SURFACES.RIGHT_DETAIL,
                    referringSearchTerm: searchTerm,
                  })
                }
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
        defaultExpanded: expandFirstItem && index === 0,
      }))}
    />
  )
}
