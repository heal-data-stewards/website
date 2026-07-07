import { OpenInNew, Search } from "@mui/icons-material"
import { IconButton, Tab, Tooltip } from "@mui/material"
import { useState } from "react"
import Link from "../../../elements/link"
import {
  trackNewConceptSearched,
  trackOntologyLinkClick,
  PANEL_LOCATIONS,
  UI_SURFACES,
} from "../analytics"
import { BookmarkButton } from "../components/BookmarkButton"
import { CDEDisplay } from "../components/CDEDisplay"
import { ParentStudiesDisplay } from "../components/ParentStudiesDisplay"
import { a11yProps, PillTabs, TabPanel } from "../components/Tabs"

export function lowercaseFirstLetters(str) {
  return str.replace(/\b\w/g, (char) => char.toLowerCase())
}

export function ConceptDetail({
  concept,
  searchTerm,
  panelLocation = PANEL_LOCATIONS.CONCEPTS,
}) {
  const [currentTabIndex, setCurrentTabIndex] = useState(0)

  return (
    <div className="flex-1 p-4 min-h-0 overflow-auto">
      <div className="flex w-full gap-2">
        <div className="flex gap-1 items-center" style={{ flexGrow: 1 }}>
          <h2 className="text-2xl font-semibold leading-relaxed text-[#592963]">
            {lowercaseFirstLetters(concept.name)}{" "}
          </h2>
          <Tooltip title="Search for this concept" placement="top">
            <IconButton
              size="large"
              component="a"
              href={(() => {
                const url = new URL(window.location.href)
                url.searchParams.set("q", concept.name)
                return url.toString()
              })()}
              onMouseDown={(e) => {
                e.stopPropagation()

                trackNewConceptSearched({
                  concept,
                  panelLocation,
                  uiSurface: UI_SURFACES.RIGHT_DETAIL,
                  referringSearchTerm: searchTerm,
                })
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  trackNewConceptSearched({
                    concept,
                    panelLocation,
                    uiSurface: UI_SURFACES.RIGHT_DETAIL,
                    referringSearchTerm: searchTerm,
                  })
                }
              }}
            >
              <Search fontSize="large" sx={{ color: "#4d2862" }} />
            </IconButton>
          </Tooltip>
        </div>

        <BookmarkButton
          entity={concept}
          collectionKey="concepts"
          panelLocation={panelLocation}
          uiSurface={UI_SURFACES.RIGHT_DETAIL}
          searchTerm={searchTerm}
          size="large"
          sx={{ flexShrink: 0 }}
        />
        <Tooltip title="Search for this concept" placement="top">
          <IconButton
            size="large"
            component="a"
            href={(() => {
              const url = new URL(window.location.href)
              url.searchParams.set("q", concept.name)
              return url.toString()
            })()}
            onClick={(e) => e.stopPropagation()}
          >
            <Search fontSize="large" sx={{ color: "#4d2862" }} />
          </IconButton>
        </Tooltip>
      </div>
      <div className="mb-2 flex gap-2 flex-wrap">
        <p className="text-gray-600 bg-gray-100 border-[1px] border-gray-200 border-solid px-2 py-1 rounded-lg shadow-sm">
          {concept.action ? (
            <Link
              to={concept.action ?? ""}
              target="_blank"
              rel="noopener noreferrer"
              onMouseDown={() =>
                trackOntologyLinkClick({
                  concept,
                  panelLocation,
                  uiSurface: UI_SURFACES.RIGHT_DETAIL,
                  referringSearchTerm: searchTerm,
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  trackOntologyLinkClick({
                    concept,
                    panelLocation,
                    uiSurface: UI_SURFACES.RIGHT_DETAIL,
                    referringSearchTerm: searchTerm,
                  })
                }
              }}
            >
              <Tooltip title="Concept lookup in Ontology" placement="top">
                {concept.id}
                <OpenInNew fontSize="small" />
              </Tooltip>
            </Link>
          ) : (
            concept.id
          )}
        </p>
        <p className="text-gray-600 bg-gray-100 border-[1px] border-gray-200 border-solid px-2 py-1 rounded-lg shadow-sm">
          {concept.concept_type}
        </p>
      </div>
      <p className="">{concept.description}</p>

      <div className="mt-4">
        <PillTabs
          value={currentTabIndex}
          onChange={(e, value) => setCurrentTabIndex(value)}
          aria-label="Concept tabs"
        >
          <Tab label="Related Studies" {...a11yProps(0)} />
          <Tab label="Related CDEs" {...a11yProps(1)} />
        </PillTabs>
      </div>
      <div className="p-2">
        <TabPanel currentTabIndex={currentTabIndex} index={0}>
          <ParentStudiesDisplay
            conceptId={concept.id}
            searchTerm={searchTerm}
            panelLocation={panelLocation}
            notFoundText="No studies found for this concept."
          />
        </TabPanel>
        <TabPanel currentTabIndex={currentTabIndex} index={1}>
          <CDEDisplay
            searchTerm={searchTerm}
            conceptId={concept.id}
            panelLocation={panelLocation}
            emptyText="No CDEs found for this concept."
          />
        </TabPanel>
      </div>
    </div>
  )
}
