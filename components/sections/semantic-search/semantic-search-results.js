import { styled } from "@mui/material"
import { QueryCacheProvider } from "utils/use-query"
import { useQueryParam } from "utils/use-query-params"
import { SemanticSearchTabs } from "./components/Tabs"
import { Collection } from "./components/Collection"
import { RelatedSearches } from "./components/RelatedSearches"
import { ContentLayout } from "./components/ContentLayout"
import { StudiesPanel } from "./panels/studies"
import { CDEsPanel } from "./panels/cdes"
import { ConceptsPanel } from "./panels/concepts"
import { VariablesPanel } from "./panels/variables"
import { CollectionContextProvider } from "./context/collection"
import { IntegratedSearchBar } from "./components/IntegratedSearchBar"

const TAB_NAMES = ["studies", "cdes", "concepts", "variables"]

const SemanticSearchResults = ({ data }) => {
  const [searchTerm] = useQueryParam(null, "q")
  const [currentTab, setCurrentTab] = useQueryParam("studies", "tab")

  const currentTabIndex = Math.max(0, TAB_NAMES.indexOf(currentTab))
  const setCurrentTabIndex = (index) => setCurrentTab(TAB_NAMES[index])

  return (
    <QueryCacheProvider>
      <CollectionContextProvider>
        <Container>
          <IntegratedSearchBar
            buttonText={data.button_text}
            redirectUrl={data.redirect_url}
            redirectQueryParam={data.query_param}
            guideText={data.guide_text}
          />

          {/* <h2 className="text-2xl font-bold text-[#532565] sm:ml-0 ml-4">
            Results for &ldquo;{searchTerm}&rdquo;:
          </h2> */}

          <div className="flex-1 flex w-full max-h-full gap-4 min-h-0 p-4">
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

            <div className="min-w-[150px] max-w-[300px] flex flex-col gap-4 pt-[48px]">
              <RelatedSearches searchTerm={searchTerm} />
              <Collection />
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
  width: 100%;
  height: 100%;
  max-height: 100%;

  display: flex;
  flex-direction: column;
`

export default SemanticSearchResults
