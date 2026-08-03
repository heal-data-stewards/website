import { CircularProgress, IconButton, Tooltip } from "@mui/material"
import { useQuery } from "utils/use-query"
import { fetchStudies } from "../data/studies"
import { ENTITY_TYPES } from "../data/entity"
import Link from "../../../elements/link"
import { OpenInNew, ReadMore, SearchOff } from "@mui/icons-material"
import StyledAccordion from "../accordion"
import { useEntityModal } from "../context/entity-modal"
import { BookmarkButton } from "./BookmarkButton"
import { Empty } from "./Empty"
import {
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
  const modal = useEntityModal()

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
            <h4>
              {study.name}
              {study.metadata?.["Data Availability"] === "available" && (
                <span className="inline-block bg-[#982568] text-white rounded-md px-2 py-1 flex-shrink-0 mx-2">
                  Data available
                </span>
              )}
            </h4>
            <div className="flex items-center flex-shrink-0">
              <BookmarkButton
                entity={study}
                collectionKey="studies"
                panelLocation={panelLocation ?? PANEL_LOCATIONS.PARENT_STUDIES}
                uiSurface={UI_SURFACES.RIGHT_DETAIL}
                searchTerm={searchTerm}
                size="small"
              />
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
                        uiSurface: UI_SURFACES.RIGHT_DETAIL,
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
              <Link
                to={study.action}
                target="_blank"
                rel="noopener noreferrer"
                onMouseDown={() =>
                  trackHdpLinkClick({
                    study,
                    panelLocation:
                      panelLocation ?? PANEL_LOCATIONS.PARENT_STUDIES,
                    uiSurface: UI_SURFACES.RIGHT_DETAIL,
                    referringSearchTerm: searchTerm,
                  })
                }
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
        defaultExpanded: expandFirstItem && index === 0,
      }))}
    />
  )
}
