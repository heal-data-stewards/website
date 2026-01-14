import { Bookmark, Download, BookmarkBorder, FileDownloadOff } from "@mui/icons-material"
import { IconButton, styled, Tab } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { VariableQuestionDisplay } from "../components/VariableQuestionDisplay"
import { fetchCDEs } from "../data/cdes"
import { ParentStudiesDisplay } from "../components/ParentStudiesDisplay"
import { useCollectionContext } from "../context/collection"
import { InfiniteScrollList } from "../components/InfiniteScrollList"
import { FiltersPanel } from "../components/FiltersPanel"
import { a11yProps, PillTabs, TabPanel } from "../components/Tabs"
import { Empty } from "../components/Empty"

export const CDEsPanel = ({ searchTerm }) => {
  const collection = useCollectionContext()

  const [filters, setFilters] = useState({
    cdeTypes: [],
  })

  const [activeSidebarItem, setActiveSidebarItem] = useState(0)
  const [filteredCdes, setFilteredCdes] = useState([])
  const [currentCdeTabIndex, setCurrentCdeTabIndex] = useState(0)

  useEffect(() => {
    setActiveSidebarItem(0)
    setCurrentCdeTabIndex(0)
  }, [searchTerm])

  useEffect(() => {
    if (filteredCdes.length > 0 && activeSidebarItem >= filteredCdes.length) {
      setActiveSidebarItem(0)
      setCurrentCdeTabIndex(0)
    }
  }, [filteredCdes, activeSidebarItem])

  const filterConfigs = useMemo(
    () => [
      {
        type: "multiselect",
        key: "cdeTypes",
        label: "CDE Type",
        options: ["Supplemental", "All Core"],
      },
    ],
    []
  )

  const filterFunction = useCallback((cde, currentFilters) => {
    if (currentFilters.cdeTypes && currentFilters.cdeTypes.length > 0) {
      const categories = cde.metadata?.categories || []
      const hasMatchingType = currentFilters.cdeTypes.some((type) =>
        categories.includes(type)
      )
      if (!hasMatchingType) {
        return false
      }
    }

    return true
  }, [])

  const handleFilterChange = useCallback((filterKey, newValue) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: newValue,
    }))
  }, [])

  const getCountDisplay = useCallback(
    (filteredCount, loadedCount, totalCount, hasMore, hasFilters) => {
      if (!hasFilters) {
        if (hasMore) {
          return `${loadedCount}+ CDEs found`
        }
        return `${totalCount || loadedCount} CDE${
          totalCount !== 1 ? "s" : ""
        } found`
      } else {
        const loaded = hasMore
          ? `${loadedCount}+`
          : `${totalCount || loadedCount}`
        return `Found ${filteredCount} of ${loaded} CDE${
          totalCount !== 1 ? "s" : ""
        } matching filters`
      }
    },
    []
  )

  const renderItem = useCallback((cde, key, isActive, onClick) => {
    return (
      <SidebarItem
        key={key}
        cde={cde}
        name={cde.name}
        description={cde.description}
        onClick={onClick}
        active={isActive}
      />
    )
  }, [])

  const handleFilteredItemsChange = useCallback((items, fullResponse) => {
    setFilteredCdes(items)
  }, [])

  const renderFilters = useCallback(
    () => (
      <FiltersPanel
        filterConfigs={filterConfigs}
        filterValues={filters}
        onFilterChange={handleFilterChange}
      />
    ),
    [filterConfigs, filters, handleFilterChange]
  )

  const activeCde = filteredCdes[activeSidebarItem]

  return (
    <div className="flex flex-row max-h-full h-full">
      <InfiniteScrollList
        panelId="cdes"
        fetchFunction={fetchCDEs}
        searchTerm={searchTerm}
        renderItem={renderItem}
        filterFunction={filterFunction}
        filters={filters}
        activeItemIndex={activeSidebarItem}
        onActiveItemChange={setActiveSidebarItem}
        getCountDisplay={getCountDisplay}
        onFilteredItemsChange={handleFilteredItemsChange}
        renderFilters={renderFilters}
      />
      {activeCde ? (
        <div className="flex-1 p-4 min-h-0 overflow-auto">
          <div className="flex gap-2">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold leading-relaxed text-[#592963]">
                {activeCde.name}{" "}
              </h2>
              <p className="text-lg text-gray-500 font-normal">
                {activeCde.id}
              </p>
            </div>
            <IconButton
              size="large"
              onClick={() => {
                collection.cdes.toggle(activeCde)
              }}
            >
              {collection.cdes.has(activeCde) ? (
                <Bookmark fontSize="large" sx={{ color: "#4d2862" }} />
              ) : (
                <BookmarkBorder fontSize="large" sx={{ color: "#4d2862" }} />
              )}
            </IconButton>
          </div>
          <p className="mt-4">{activeCde.description}</p>

          <div className="mt-4">
            <PillTabs
              value={currentCdeTabIndex}
              onChange={(e, value) => setCurrentCdeTabIndex(value)}
              aria-label="CDE tabs"
            >
              <Tab label="Measures" {...a11yProps(0)} />
              <Tab label="Usage In Studies" {...a11yProps(1)} />
              <Tab label="Downloads" {...a11yProps(2)} />
            </PillTabs>
          </div>
          <div className="p-2">
            <TabPanel currentTabIndex={currentCdeTabIndex} index={0}>
              <VariableQuestionDisplay variableList={activeCde.variable_list} />
            </TabPanel>
            <TabPanel currentTabIndex={currentCdeTabIndex} index={1}>
              <ParentStudiesDisplay
                studyIds={activeCde.parents}
                notFoundText="No studies found using this CDE."
              />
            </TabPanel>
            <TabPanel currentTabIndex={currentCdeTabIndex} index={2}>
              {activeCde.metadata?.urls?.length === 0 ? (
                <Empty
                  icon={<FileDownloadOff />}
                  text="No downloads found for this CDE."
                />
              ) : (
                <div className="flex flex-col gap-5">
                  {activeCde.metadata?.urls?.map((url) => (
                    <DownloadCard
                      className="p-4 flex gap-1 shadow-md transition-all duration-150 rounded-md border-[1px] border-gray-200"
                      key={url.filename}
                      href={url.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-500 mb-1">
                          {url.filename}
                        </p>
                        <p>{url.description}</p>
                      </div>
                      <Download />
                    </DownloadCard>
                  ))}
                </div>
              )}
            </TabPanel>
          </div>

        </div>
      ) : (
        <div className="flex-1 p-4 min-h-0 overflow-auto flex items-center justify-center">
          <span className="text-gray-400 italic">
            Select a CDE to view details
          </span>
        </div>
      )}
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

function SidebarItem({ cde, name, description, onClick, active }) {
  const collection = useCollectionContext()

  return (
    <button
      onClick={onClick}
      className={
        `p-4 border-b border-gray-200 cursor-pointer text-left` +
        (active ? " bg-[#eeecf0]" : "")
      }
    >
      <div className="flex gap-2 items-start justify-between">
        <h4 className="font-semibold">{name}</h4>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            collection.cdes.toggle(cde)
          }}
        >
          {collection.cdes.has(cde) ? (
            <Bookmark fontSize="small" sx={{ color: "#4d2862" }} />
          ) : (
            <BookmarkBorder fontSize="small" sx={{ color: "#4d2862" }} />
          )}
        </IconButton>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </button>
  )
}
