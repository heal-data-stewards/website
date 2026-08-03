import { OpenInNew } from "@mui/icons-material"
import { Divider, Tab, Tooltip } from "@mui/material"
import { format, isValid, parseISO } from "date-fns"
import { useState } from "react"
import Link from "../../../elements/link"
import { trackHdpLinkClick, PANEL_LOCATIONS, UI_SURFACES } from "../analytics"
import { BookmarkButton } from "../components/BookmarkButton"
import { CDEDisplay } from "../components/CDEDisplay"
import { a11yProps, PillTabs, TabPanel } from "../components/Tabs"
import { VariablesList } from "../components/VariablesList"

export function StudyDetail({
  study,
  searchTerm,
  panelLocation = PANEL_LOCATIONS.STUDIES,
  scrollContainerId = "studyScrollContainer",
}) {
  const [currentTabIndex, setCurrentTabIndex] = useState(0)

  return (
    <div
      className="flex-1 p-4 min-h-0 overflow-auto"
      id={scrollContainerId} // for variable tab infinite scroll
    >
      <div className="flex gap-2 justify-between">
        <h2 className="text-2xl font-semibold leading-relaxed mb-2 text-[#592963]">
          {study.name}
          {study.metadata?.["Data Availability"] === "available" && (
            <span className="inline-block bg-[#982568] text-white rounded-md px-2 py-1 flex-shrink-0 mx-2 font-normal text-sm align-middle">
              Data available
            </span>
          )}
        </h2>
        <BookmarkButton
          entity={study}
          collectionKey="studies"
          panelLocation={panelLocation}
          uiSurface={UI_SURFACES.RIGHT_DETAIL}
          searchTerm={searchTerm}
          size="large"
        />
      </div>
      <span>
        Study ID:{" "}
        <Link
          to={study.action}
          target="_blank"
          rel="noopener noreferrer"
          onMouseDown={() =>
            trackHdpLinkClick({
              study,
              panelLocation,
              uiSurface: UI_SURFACES.RIGHT_DETAIL,
              referringSearchTerm: searchTerm,
            })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              trackHdpLinkClick({
                study,
                panelLocation,
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
      </span>
      <div className="flex flex-col gap-1 mt-2">
        {study.programs.map((prog) => (
          <p key={prog} className="uppercase text-gray-500 text-sm">
            {prog}
          </p>
        ))}
      </div>
      <div className="mt-4">
        <PillTabs
          value={currentTabIndex}
          onChange={(e, value) => setCurrentTabIndex(value)}
          aria-label="Study tabs"
        >
          <Tab label="Details" {...a11yProps(0)} />
          <Tab label="Variables" {...a11yProps(1)} />
          <Tab label="CDEs" {...a11yProps(2)} />
        </PillTabs>
      </div>
      <div className="p-2">
        <TabPanel currentTabIndex={currentTabIndex} index={0}>
          <p>{study.description}</p>
          <Divider sx={{ my: 2 }} />
          <NestedTable object={study.metadata} showHeader={false} />
        </TabPanel>
        <TabPanel currentTabIndex={currentTabIndex} index={1}>
          <VariablesList
            study={study}
            searchTerm={searchTerm}
            panelLocation={panelLocation}
            scrollContainerId={scrollContainerId}
          />
        </TabPanel>
        <TabPanel currentTabIndex={currentTabIndex} index={2}>
          <CDEDisplay
            studyId={study.id}
            panelLocation={panelLocation}
            emptyText="No CDEs found for this study."
          />
        </TabPanel>
      </div>
    </div>
  )
}

function NestedTable({ object, showHeader = true, showBorders = false }) {
  return (
    <table className={`w-full table-auto border-collapse align-top`}>
      {showHeader && (
        <thead className="border-b border-gray-200 mb-2">
          <tr>
            <th className="text-left font-semibold py-1 pr-4">Field</th>
            <th className="text-left font-semibold py-1 ">Value</th>
          </tr>
        </thead>
      )}
      <tbody>
        {Object.entries(object).map(([key, value]) => {
          let cell = null

          if (typeof value === "string") {
            cell = formatString(value)
          } else if (Array.isArray(value)) {
            if (value.length === 0) {
              cell = <span className="italic text-gray-500">No values</span>
            } else if (
              value.every((v) => typeof v === "object" && v !== null)
            ) {
              cell = value.map((obj, idx) => (
                <div
                  key={idx}
                  className="-m-2 p-2 rounded-md bg-[#f4f1f5] bg-opacity-30 mb-2"
                >
                  <NestedTable
                    object={obj}
                    showHeader={false}
                    showBorders={true}
                  />
                </div>
              ))
            } else {
              cell = value
                .filter((v) => typeof v === "string")
                .map(formatString)
                .reduce((prev, curr) => [prev, ", ", curr])
            }
          }

          return (
            <tr
              key={key}
              className={
                showBorders
                  ? "border-b border-gray-200 last:border-0"
                  : undefined
              }
            >
              <td className="py-1 pr-4 align-top text-primary font-bold">
                {formatSnakeCaseToTitleCase(key)}
              </td>
              <td className="py-1 align-top">{cell}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function formatString(str) {
  const resultDate = parseISO(str)
  if (isValid(resultDate)) {
    return format(resultDate, "M/dd/yyyy")
  }

  const urlRegex = /(https?:\/\/\S+\.\S+)/gi
  const parts = str.split(urlRegex)

  if (parts.length === 1) {
    return str
  }

  return parts.map((part, index) => {
    if (part.match(/^https?:\/\//i)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#982568] font-semibold hover:underline"
        >
          {part}
        </a>
      )
    }
    return part
  })
}

function formatSnakeCaseToTitleCase(str) {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
