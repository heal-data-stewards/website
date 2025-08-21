import { Tab, Tabs } from "@mui/material"
import { useState } from "react"
import { useQueryParams } from "utils/use-query-params"
import { StudiesPanel } from "./panels/studies"
import { VariablesPanel } from "./panels/variables"
import { CDEsPanel } from "./panels/cdes"
import { ConceptsPanel } from "./panels/concepts"

export const Results = ({ queryParam = "q" }) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [excludedStudies, setExcludedStudies] = useState([])
  const [searchTerm] = useQueryParams(null, queryParam)

  return (
    <div className="container">
      <h2 className="text-2xl font-bold text-[#532565]">
        Results for &ldquo;{searchTerm}&rdquo;:
      </h2>

      <div className="my-8">
        <div className="bg-[#f4f1f5] rounded-t-lg">
          <Tabs
            value={currentTabIndex}
            variant="fullWidth"
            onChange={(_, i) => setCurrentTabIndex(i)}
            aria-label="Results tabs"
          >
            <Tab label="Studies" {...a11yProps(0)} />
            <Tab label="CDEs" {...a11yProps(1)} />
            <Tab label="Related Concepts" {...a11yProps(2)} />
            <Tab label="Variables" {...a11yProps(3)} />
          </Tabs>
        </div>

        <TabPanel currentTabIndex={currentTabIndex} index={0}>
          <StudiesPanel
            searchTerm={searchTerm}
            excludedStudies={excludedStudies}
            setExcludedStudies={setExcludedStudies}
          />
        </TabPanel>
        <TabPanel currentTabIndex={currentTabIndex} index={1}>
          <CDEsPanel searchTerm={searchTerm} />
        </TabPanel>
        <TabPanel currentTabIndex={currentTabIndex} index={2}>
          <ConceptsPanel searchTerm={searchTerm} />
        </TabPanel>
        <TabPanel currentTabIndex={currentTabIndex} index={3}>
          <VariablesPanel searchTerm={searchTerm} />
        </TabPanel>
      </div>
    </div>
  )
}

function TabPanel({ children, currentTabIndex, index }) {
  return (
    <div
      role="tabpanel"
      hidden={currentTabIndex !== index}
      id={`results-tabpanel-${index}`}
      aria-labelledby={`results-tab-${index}`}
    >
      {currentTabIndex === index && <div>{children}</div>}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `results-tab-${index}`,
    "aria-controls": `results-tabpanel-${index}`,
  }
}
