import { MenuBook } from "@mui/icons-material"
import { Tab } from "@mui/material"
import { useState } from "react"
import { PANEL_LOCATIONS, UI_SURFACES } from "../analytics"
import { BookmarkButton } from "../components/BookmarkButton"
import { CDEDisplay } from "../components/CDEDisplay"
import { Empty } from "../components/Empty"
import { MappedCDEMeasure } from "../components/MappedCDEMeasure"
import { ParentStudiesDisplay } from "../components/ParentStudiesDisplay"
import { StudyVariableMappings } from "../components/StudyVariableMappings"
import { a11yProps, PillTabs, TabPanel } from "../components/Tabs"

export function VariableDetail({
  variable,
  searchTerm,
  panelLocation = PANEL_LOCATIONS.VARIABLES,
}) {
  const [currentTabIndex, setCurrentTabIndex] = useState(0)

  const studyMappings = variable.metadata?.study_variable_mappings
  const cdeMappings = variable.metadata?.cde_mapping

  const variableHasPermissibleValues =
    Object.entries(variable.metadata?.permissible_values || {}).length > 0

  const tabs = [
    ...(variableHasPermissibleValues
      ? [{ label: "Permissible Values", key: "permissible_values" }]
      : []),
    {
      label: variable?.is_cde ? "CDEs" : "Parent Study",
      key: "usage",
    },
    ...(cdeMappings
      ? [{ label: "Mapped CDE Measure", key: "mapped_cde_measure" }]
      : []),
    ...(studyMappings
      ? [
          {
            label: "Studies Using This Measure",
            key: "study_variable_mappings",
          },
        ]
      : []),
    { label: "References", key: "references" },
  ]

  return (
    <div className="flex-1 p-4 min-h-0 overflow-auto">
      <div className="flex gap-2">
        <div className="flex-1">
          <h2 className="flex-1 text-2xl font-semibold leading-relaxed text-[#592963]">
            {variable.name === "None" ? variable.id : variable.name}
          </h2>
          <p className="text-lg text-gray-500 font-normal">{variable.id}</p>
        </div>
        <BookmarkButton
          entity={variable}
          collectionKey="variables"
          panelLocation={panelLocation}
          uiSurface={UI_SURFACES.RIGHT_DETAIL}
          searchTerm={searchTerm}
          size="large"
          sx={{ flexShrink: 0 }}
        />
      </div>
      <p className="mt-3">{variable.description}</p>

      <div className="mt-4">
        <PillTabs
          value={currentTabIndex}
          onChange={(e, value) => setCurrentTabIndex(value)}
          aria-label="Variable tabs"
        >
          {tabs.map((tab, index) => (
            <Tab key={tab.key} label={tab.label} {...a11yProps(index)} />
          ))}
        </PillTabs>
      </div>
      <div className="p-2">
        {tabs.map((tab, index) => (
          <TabPanel
            key={tab.key}
            currentTabIndex={currentTabIndex}
            index={index}
          >
            {tab.key === "permissible_values" && (
              <>
                {variable.metadata?.question_text !== "None" && (
                  <p className="mt-1">{variable.metadata.question_text}</p>
                )}

                {variableHasPermissibleValues && (
                  <ul className="flex my-4 border-[#bfb9c5] border-[1px] rounded-md overflow-auto">
                    {Object.entries(
                      variable.metadata.permissible_values || {}
                    ).map(([key, pv]) => (
                      <li
                        key={key}
                        className="px-3 py-2 rounded-md odd:bg-[#f1eff3] flex-1"
                      >
                        <div className="flex flex-col">
                          <span>{key}</span>
                          {pv && (
                            <span className="text-gray-500 text-sm">{pv}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            {tab.key === "usage" &&
              (variable.is_cde ? (
                <CDEDisplay
                  panelLocation={panelLocation}
                  expandFirstItem
                  emptyText={"No CDEs found for this variable."}
                  elementIds={variable.parents.map((p) =>
                    p.replace("HEALCDE:", "")
                  )}
                />
              ) : (
                <ParentStudiesDisplay
                  studyIds={variable.parents}
                  notFoundText={"No studies found for this variable."}
                  searchTerm={searchTerm}
                  expandFirstItem
                  panelLocation={panelLocation}
                />
              ))}
            {tab.key === "mapped_cde_measure" ? (
              <MappedCDEMeasure cdeMappings={cdeMappings} />
            ) : null}
            {tab.key === "study_variable_mappings" ? (
              <StudyVariableMappings studyMappings={studyMappings} />
            ) : null}
            {tab.key === "references" ? (
              variable.metadata?.references &&
              variable.metadata.references !== "None" ? (
                <p>{variable.metadata.references}</p>
              ) : (
                <Empty
                  icon={<MenuBook />}
                  text="No references found for this variable."
                />
              )
            ) : null}
          </TabPanel>
        ))}
      </div>
    </div>
  )
}
