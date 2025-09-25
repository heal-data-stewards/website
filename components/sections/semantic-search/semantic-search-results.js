import { styled } from "@mui/material"
import { QueryCacheProvider } from "utils/use-query"
import { useQueryParams } from "utils/use-query-params"
import { useState } from "react"
import { SemanticSearchTabs } from "./components/Tabs"
import { Collection } from "./components/Collection"
import { RelatedSearches } from "./components/RelatedSearches"
import { ContentLayout } from "./components/ContentLayout"
import { StudiesPanel } from "./panels/studies"
import { CDEsPanel } from "./panels/cdes"
import { ConceptsPanel } from "./panels/concepts"
import { VariablesPanel } from "./panels/variables"
import { CollectionContextProvider } from "./context/collection"

const SemanticSearchResults = ({ data }) => {
  const [searchTerm] = useQueryParams(null, "q")
  const [currentTabIndex, setCurrentTabIndex] = useState(0)

  return (
    <QueryCacheProvider>
      <CollectionContextProvider>
        <Container>
          <h2 className="text-2xl font-bold text-[#532565] my-2 sm:ml-0 ml-4">
            Results for &ldquo;{searchTerm}&rdquo;:
          </h2>
          <div className="flex-1 flex w-full max-h-full gap-4 min-h-0">
            <div className="flex-1 flex flex-col min-w-0">
              <SemanticSearchTabs
                currentTabIndex={currentTabIndex}
                setCurrentTabIndex={setCurrentTabIndex}
              />
              <div className="flex-1 border-solid border-[1px] border-t-[3px] border-gray-200 rounded-md rounded-tl-none shadow-md flex min-h-0">
                <TabPanel currentTabIndex={currentTabIndex} index={0}>
                  <StudiesPanel searchTerm={searchTerm} />
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
            <div className="min-w-[150px] max-w-[300px] flex flex-col justify-between gap-4 pt-[48px]">
              <Collection />
              <RelatedSearches searchTerm={searchTerm} />
            </div>
          </div>
        </Container>
      </CollectionContextProvider>
    </QueryCacheProvider>
  )
}

function TabPanel({ children, currentTabIndex, index }) {
  return (
    <div
      role="tabpanel"
      className="w-full overflow-auto"
      hidden={currentTabIndex !== index}
      id={`results-tabpanel-${index}`}
      aria-labelledby={`results-tab-${index}`}
    >
      {currentTabIndex === index && children}
    </div>
  )
}

const Container = styled("div")`
  margin: 0 auto;
  margin-bottom: 3rem;
  width: 100%;
  max-width: 1700px;
  height: calc(100dvh - 150px);
  max-height: calc(100dvh - 150px);
  padding: 0rem 1rem;

  display: flex;
  flex-direction: column;

  @media (max-width: 639px) {
    padding: 0;
  }
`

export default SemanticSearchResults
