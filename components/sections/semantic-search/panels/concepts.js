import {
  Bookmark,
  BookmarkBorder,
  OpenInNew,
  Search,
} from "@mui/icons-material"
import { IconButton, Tooltip } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ParentStudiesDisplay } from "../components/ParentStudiesDisplay"
import { fetchConcepts } from "../data/concepts"
import { CDEDisplay } from "../components/CDEDisplay"
import { useCollectionContext } from "../context/collection"
import Link from "../../../elements/link"
import { InfiniteScrollList } from "../components/InfiniteScrollList"
import { FiltersPanel } from "../components/FiltersPanel"
import {
  trackBookmarkClick,
  trackOntologyLinkClick,
  PANEL_LOCATIONS,
  UI_SURFACES,
} from "../analytics"

export const ConceptsPanel = ({ searchTerm }) => {
  const collection = useCollectionContext()

  const [filters, setFilters] = useState({
    conceptType: "",
  })

  const [activeSidebarItem, setActiveSidebarItem] = useState(0)
  const [filteredConcepts, setFilteredConcepts] = useState([])
  const [conceptTypesFromApi, setConceptTypesFromApi] = useState({})

  useEffect(() => {
    setActiveSidebarItem(0)
  }, [searchTerm])

  useEffect(() => {
    if (
      filteredConcepts.length > 0 &&
      activeSidebarItem >= filteredConcepts.length
    ) {
      setActiveSidebarItem(0)
    }
  }, [filteredConcepts, activeSidebarItem])

  const filterConfigs = useMemo(
    () => [
      {
        type: "select",
        key: "conceptType",
        label: "Concept Type",
        options: Object.entries(conceptTypesFromApi).map(([type, count]) => ({
          value: type,
          label: `${type} (${count})`,
        })),
      },
    ],
    [conceptTypesFromApi]
  )

  const filterFunction = useCallback((concept, currentFilters) => {
    if (
      currentFilters.conceptType &&
      concept.concept_type !== currentFilters.conceptType
    ) {
      return false
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
          return `${loadedCount}+ concepts found`
        }
        return `${totalCount || loadedCount} concept${
          totalCount !== 1 ? "s" : ""
        } found`
      } else {
        const loaded = hasMore
          ? `${loadedCount}+`
          : `${totalCount || loadedCount}`
        return `Found ${filteredCount} of ${loaded} concept${
          totalCount !== 1 ? "s" : ""
        } matching filters`
      }
    },
    []
  )

  const renderItem = useCallback(
    (concept, key, isActive, onClick) => {
      return (
        <SidebarItem
          key={key}
          concept={concept}
          name={concept.name}
          description={concept.description}
          onClick={onClick}
          active={isActive}
          searchTerm={searchTerm}
        />
      )
    },
    [searchTerm]
  )

  const handleFilteredItemsChange = useCallback((items, fullResponse) => {
    const enhancedConcepts = items.map((concept) => ({
      ...concept,
      parentStudies: Array.from(
        new Set(
          concept.parents
            .map((str) => {
              const match = str.match(/^(HEALDATAPLATFORM:[^:]+):[^:]+$/)
              return match ? match[1] : null
            })
            .filter(Boolean)
        )
      ),
      parentCdes: Array.from(
        new Set(concept.parents.filter((str) => /^HEALCDE:[^:]+$/.test(str)))
      ),
    }))
    setFilteredConcepts(enhancedConcepts)

    if (fullResponse?.concept_types) {
      setConceptTypesFromApi(fullResponse.concept_types)
    }
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

  const activeConcept = filteredConcepts[activeSidebarItem]

  return (
    <div className="flex flex-row max-h-full h-full">
      <InfiniteScrollList
        panelId="concepts"
        fetchFunction={fetchConcepts}
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
      {activeConcept ? (
        <div className="flex-1 p-4 min-h-0 overflow-auto">
          <div className="flex w-full justify-between gap-2 mb-2">
            <div className="flex gap-1 items-center">
              <h2 className="text-2xl font-semibold leading-relaxed text-[#592963]">
                {activeConcept.name}{" "}
              </h2>
              <Link
                href={(() => {
                  const url = new URL(window.location.href)
                  url.searchParams.set("q", activeConcept.name)
                  return url
                })()}
                passHref
              >
                <Tooltip title="Search for this concept" placement="top">
                  <IconButton
                    size="large"
                    component={"a"}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Search fontSize="large" sx={{ color: "#4d2862" }} />
                  </IconButton>
                </Tooltip>
              </Link>
            </div>

            <IconButton
              size="large"
              sx={{ flexShrink: 0 }}
              onClick={() => {
                const isBookmarked = collection.concepts.has(activeConcept)
                collection.concepts.toggle(activeConcept)
                trackBookmarkClick({
                  action: isBookmarked ? "remove" : "add",
                  entity: activeConcept,
                  panelLocation: PANEL_LOCATIONS.CONCEPTS,
                  uiSurface: UI_SURFACES.RIGHT_DETAIL,
                  referringSearchTerm: searchTerm,
                })
              }}
            >
              {collection.concepts.has(activeConcept) ? (
                <Bookmark fontSize="large" sx={{ color: "#4d2862" }} />
              ) : (
                <BookmarkBorder fontSize="large" sx={{ color: "#4d2862" }} />
              )}
            </IconButton>
          </div>
          <div className="mb-2 flex gap-2 flex-wrap">
            <p className="text-gray-600 bg-gray-100 border-[1px] border-gray-200 border-solid px-2 py-1 rounded-lg shadow-sm">
              {activeConcept.action ? (
                <Link
                  to={activeConcept.action ?? ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackOntologyLinkClick({
                      concept: activeConcept,
                      panelLocation: PANEL_LOCATIONS.CONCEPTS,
                      uiSurface: UI_SURFACES.RIGHT_DETAIL,
                      referringSearchTerm: searchTerm,
                    })
                  }
                >
                  <Tooltip title="Concept lookup in Ontology" placement="top">
                    {activeConcept.id}
                    <OpenInNew fontSize="small" />
                  </Tooltip>
                </Link>
              ) : (
                activeConcept.id
              )}
            </p>
            <p className="text-gray-600 bg-gray-100 border-[1px] border-gray-200 border-solid px-2 py-1 rounded-lg shadow-sm">
              {activeConcept.concept_type}
            </p>
          </div>
          <p className="">{activeConcept.description}</p>

          <hr className="my-4" />

          <ParentStudiesDisplay
            conceptId={activeConcept.id}
            searchTerm={searchTerm}
            panelLocation={PANEL_LOCATIONS.CONCEPTS}
            notFoundText={"No studies found for this concept."}
            titleFormatter={(n) =>
              `Studies Referencing this Concept ${
                n > 0 ? ` (${n.toLocaleString()})` : ""
              }`
            }
          />

          <CDEDisplay
            searchTerm={searchTerm}
            conceptId={activeConcept.id}
            panelLocation={PANEL_LOCATIONS.CONCEPTS}
          />
        </div>
      ) : (
        <div className="flex-1 p-4 min-h-0 overflow-auto flex items-center justify-center">
          <span className="text-gray-400 italic">
            Select a concept to view details
          </span>
        </div>
      )}
    </div>
  )
}

function SidebarItem({ concept, name, description, onClick, active }) {
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
        <div className="flex gap-1 items-center">
          <h4 className="font-semibold">{name}</h4>
          <Link
            href={(() => {
              const url = new URL(window.location.href)
              url.searchParams.set("q", name)
              return url
            })()}
            passHref
          >
            <Tooltip title="Search for this concept" placement="top">
              <IconButton
                size="small"
                component={"a"}
                onClick={(e) => e.stopPropagation()}
              >
                <Search fontSize="small" sx={{ color: "#4d2862" }} />
              </IconButton>
            </Tooltip>
          </Link>
        </div>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            const isBookmarked = collection.concepts.has(concept)
            collection.concepts.toggle(concept)

            trackBookmarkClick({
              action: isBookmarked ? "remove" : "add",
              entity: concept,
              panelLocation: PANEL_LOCATIONS.CONCEPTS,
              uiSurface: UI_SURFACES.LEFT_LIST,
              referringSearchTerm: searchTerm,
            })
          }}
        >
          {collection.concepts.has(concept) ? (
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
