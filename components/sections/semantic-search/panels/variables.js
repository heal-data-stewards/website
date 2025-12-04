import { Bookmark, BookmarkBorder } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import { fetchVariables } from "../data/variables"
import { CDEDisplay } from "../components/CDEDisplay"
import { ParentStudiesDisplay } from "../components/ParentStudiesDisplay"
import { useCollectionContext } from "../context/collection"
import { InfiniteScrollList } from "../components/InfiniteScrollList"
import { FiltersPanel } from "../components/FiltersPanel"

export const VariablesPanel = ({ searchTerm }) => {
  const collection = useCollectionContext()

  const [filters, setFilters] = useState({
    isCde: false,
    dataTypes: [],
  })

  const [activeSidebarItem, setActiveSidebarItem] = useState(0)
  const [filteredVariables, setFilteredVariables] = useState([])

  useEffect(() => {
    setActiveSidebarItem(0)
  }, [searchTerm])

  useEffect(() => {
    if (
      filteredVariables.length > 0 &&
      activeSidebarItem >= filteredVariables.length
    ) {
      setActiveSidebarItem(0)
    }
  }, [filteredVariables, activeSidebarItem])

  const filterConfigs = useMemo(
    () => [
      {
        type: "checkbox",
        key: "isCde",
        label: "CDE only",
      },
      {
        type: "multiselect",
        key: "dataTypes",
        label: "Data Type",
        options: [
          "boolean",
          "string",
          "datetime",
          "time",
          "integer",
          "number",
          "enum",
          "date",
        ],
      },
    ],
    []
  )

  const filterFunction = useCallback((variable, currentFilters) => {
    if (currentFilters.isCde && !variable.is_cde) {
      return false
    }

    if (
      currentFilters.dataTypes &&
      currentFilters.dataTypes.length > 0 &&
      !currentFilters.dataTypes.includes(variable.data_type)
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
          return `${loadedCount}+ variables found`
        }
        return `${totalCount || loadedCount} variable${
          totalCount !== 1 ? "s" : ""
        } found`
      } else {
        const loaded = hasMore
          ? `${loadedCount}+`
          : `${totalCount || loadedCount}`
        return `Found ${filteredCount} of ${loaded} variable${
          totalCount !== 1 ? "s" : ""
        } matching filters`
      }
    },
    []
  )

  const renderItem = useCallback((variable, key, isActive, onClick) => {
    return (
      <SidebarItem
        key={key}
        variable={variable}
        name={variable.id}
        description={variable.description ?? ""}
        onClick={onClick}
        active={isActive}
      />
    )
  }, [])

  const handleFilteredItemsChange = useCallback((items, fullResponse) => {
    setFilteredVariables(items)
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

  const activeVariable = filteredVariables[activeSidebarItem]

  return (
    <div className="flex flex-row max-h-full">
      <InfiniteScrollList
        panelId="variables"
        fetchFunction={fetchVariables}
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
      {activeVariable ? (
        <div className="flex-1 p-4 min-h-0 overflow-auto">
          <div className="flex gap-2">
            <div className="flex-1">
              <h2 className="flex-1 text-2xl font-semibold leading-relaxed mb-2 text-[#592963]">
                {activeVariable.name === "None"
                  ? activeVariable.id
                  : activeVariable.name}
              </h2>
              <p className="text-lg text-gray-500 font-normal">
                {activeVariable.id}
              </p>
            </div>
            <IconButton
              size="large"
              sx={{ flexShrink: 0 }}
              onClick={() => {
                collection.variables.toggle(activeVariable)
              }}
            >
              {collection.variables.has(activeVariable) ? (
                <Bookmark fontSize="large" sx={{ color: "#4d2862" }} />
              ) : (
                <BookmarkBorder fontSize="large" sx={{ color: "#4d2862" }} />
              )}
            </IconButton>
          </div>

          <hr className="my-4" />

          <p className="italic">{activeVariable.description}</p>

          {activeVariable.metadata?.references && (
            <>
              <h3 className="text-xl font-semibold mt-6 mb-1">References</h3>
              {activeVariable.metadata.references === "None" ? (
                <p className="text-gray-400 italic">
                  No references found for this study.
                </p>
              ) : (
                <p>{activeVariable.metadata.references}</p>
              )}
            </>
          )}

          {activeVariable.is_cde ? (
            <CDEDisplay elementIds={activeVariable.parents} />
          ) : (
            <ParentStudiesDisplay
              studyIds={activeVariable.parents}
              notFoundText={"No studies found for this variable."}
            />
          )}

          <h3 className="text-xl font-semibold mt-6 mb-1">
            {activeVariable.metadata?.crf_name}
          </h3>
          {activeVariable.metadata?.question_text !== "None" && (
            <p>{activeVariable.metadata.question_text}</p>
          )}

          {activeVariable.metadata?.permissible_values?.length > 0 && (
            <ul className="flex flex-col my-4">
              {activeVariable.metadata.permissible_values.map((pv) => (
                <li
                  key={pv.value}
                  className="px-3 py-2 rounded-md odd:bg-gray-100"
                >
                  <div className="flex flex-col">
                    <span>{pv.value}</span>
                    {pv.description && (
                      <span className="text-gray-500 text-sm">
                        {pv.description}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="flex-1 p-4 min-h-0 overflow-auto flex items-center justify-center">
          <span className="text-gray-400 italic">
            Select a variable to view details
          </span>
        </div>
      )}
    </div>
  )
}

function SidebarItem({ variable, name, description, onClick, active }) {
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
        <h4 className="font-semibold break-all">{name}</h4>
        <IconButton
          size="small"
          sx={{ p: 0 }}
          onClick={(e) => {
            e.stopPropagation()
            collection.variables.toggle(variable)
          }}
        >
          {collection.variables.has(variable) ? (
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
