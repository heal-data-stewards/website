import { Download } from "@mui/icons-material"
import { styled, Tab } from "@mui/material"
import { useState } from "react"
import {
  trackCdeDownloadClick,
  PANEL_LOCATIONS,
  UI_SURFACES,
} from "../analytics"
import { BookmarkButton } from "../components/BookmarkButton"
import { ParentStudiesDisplay } from "../components/ParentStudiesDisplay"
import { a11yProps, PillTabs, TabPanel } from "../components/Tabs"
import { VariableQuestionDisplay } from "../components/VariableQuestionDisplay"

export function CdeDetail({
  cde,
  searchTerm,
  panelLocation = PANEL_LOCATIONS.CDES,
}) {
  const [currentTabIndex, setCurrentTabIndex] = useState(0)

  return (
    <div className="flex-1 p-4 min-h-0 overflow-auto">
      <div className="flex gap-2">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold leading-relaxed text-[#592963]">
            {cde.name}{" "}
          </h2>
          <p className="text-lg text-gray-500 font-normal">{cde.id}</p>
        </div>
        <BookmarkButton
          entity={cde}
          collectionKey="cdes"
          panelLocation={panelLocation}
          uiSurface={UI_SURFACES.RIGHT_DETAIL}
          searchTerm={searchTerm}
          size="large"
        />
      </div>
      <p className="mt-3">{cde.description}</p>

      <div className="mt-4">
        <PillTabs
          value={currentTabIndex}
          onChange={(e, value) => setCurrentTabIndex(value)}
          aria-label="CDE tabs"
        >
          <Tab label="Measures" {...a11yProps(0)} />
          <Tab label="Usage In Studies" {...a11yProps(1)} />
          <Tab label="Downloads" {...a11yProps(2)} />
        </PillTabs>
      </div>
      <div className="p-2">
        <TabPanel currentTabIndex={currentTabIndex} index={0}>
          <VariableQuestionDisplay variableList={cde.variable_list} />
        </TabPanel>
        <TabPanel currentTabIndex={currentTabIndex} index={1}>
          <ParentStudiesDisplay
            studyIds={cde.parents}
            searchTerm={searchTerm}
            panelLocation={panelLocation}
            notFoundText={"No studies found for this CDE."}
          />
        </TabPanel>
        <TabPanel currentTabIndex={currentTabIndex} index={2}>
          {cde.metadata?.urls?.length === 0 ? (
            <p className="text-gray-400 italic">
              No downloads found for this CDE
            </p>
          ) : (
            <div className="flex flex-col gap-5">
              {cde.metadata?.urls?.map((url) => {
                const handleDownload = () => {
                  trackCdeDownloadClick({
                    cde,
                    file: url,
                    panelLocation,
                    uiSurface: UI_SURFACES.CDE_DOWNLOAD_CARD,
                    referringSearchTerm: searchTerm,
                  })
                }

                return (
                  <DownloadCard
                    className="p-4 flex gap-1 shadow-md transition-all duration-150 rounded-md border-[1px] border-gray-200"
                    key={url.filename}
                    href={url.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseDown={handleDownload}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleDownload()
                      }
                    }}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-500 mb-1">
                        {url.filename}
                      </p>
                      <p>{url.description}</p>
                    </div>
                    <Download />
                  </DownloadCard>
                )
              })}
            </div>
          )}
        </TabPanel>
      </div>
    </div>
  )
}

const DownloadCard = styled("a")`
  &:hover {
    background-color: #fafafa;
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`
