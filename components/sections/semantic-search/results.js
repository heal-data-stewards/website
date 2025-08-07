import { Chip, CircularProgress, Tab, Tabs } from "@mui/material"
import { useState } from "react"
import Accordion from "./accordion"
import { useQuery } from "utils/use-query"

export const Results = ({ searchTerm }) => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [excludedStudies, setExcludedStudies] = useState([])

  const studiesQuery = useQuery({
    queryFn: async () => {
      setExcludedStudies([]) // Reset excluded studies on new search
      const res = await fetch("https://heal.renci.org/search-api/search_var", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchTerm,
          index: "variables_index",
          concept: "",
          offset: 0,
          size: 1000,
        }),
      })
      if (!res.ok) {
        throw new Error("Server returned an error")
      }
      return res.json()
    },
    queryKey: `studies-${searchTerm}`,
  })

  if (studiesQuery.isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  if (studiesQuery.error) {
    return (
      <div className="h-96 flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading results</span>
      </div>
    )
  }

  return (
    <div className="container">
      <h2 className="text-2xl font-bold text-[#532565]">
        Results for &ldquo;{"Chronic Pain"}&rdquo;
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
          <div
            className="p-3 flex flex-wrap gap-2"
            style={{
              borderLeft: "1px solid rgba(0, 0, 0, .125)",
              borderRight: "1px solid rgba(0, 0, 0, .125)",
            }}
          >
            {Object.entries(studiesQuery.data.result).map(([type, items]) => (
              <Chip
                onClick={() => {
                  setExcludedStudies((prev) =>
                    prev.includes(type)
                      ? prev.filter((t) => t !== type)
                      : [...prev, type]
                  )
                }}
                variant="outlined"
                style={{
                  backgroundColor: excludedStudies.includes(type)
                    ? "transparent"
                    : "#ebe8ec",
                  borderRadius: "16px",
                  border: "1px solid rgb(0 0 0 / 0.125)",
                }}
                label={`${type} (${items.length})`}
                key={type}
                size="medium"
              />
            ))}
          </div>
          <Accordion
            studies={studiesQuery.data.result}
            selectedStudyFilters={excludedStudies}
          />
        </TabPanel>
        <TabPanel currentTabIndex={currentTabIndex} index={1}>
          CDEs.
        </TabPanel>
        <TabPanel currentTabIndex={currentTabIndex} index={2}>
          Concepts.
        </TabPanel>
        <TabPanel currentTabIndex={currentTabIndex} index={3}>
          Variables.
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
