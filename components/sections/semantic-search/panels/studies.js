import { IconButton, Tooltip } from "@mui/material"
import { fetchStudies } from "../data/studies"
import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "../../../elements/link"
import { Bookmark, BookmarkBorder, OpenInNew } from "@mui/icons-material"
import { format, isValid, parseISO } from "date-fns"
import { VariablesList } from "../components/VariablesList"
import { CDEDisplay } from "../components/CDEDisplay"
import { useCollectionContext } from "../context/collection"
import { InfiniteScrollList } from "../components/InfiniteScrollList"
import { FiltersPanel } from "../components/FiltersPanel"

const RESEARCH_NETWORKS = [
  {
    key: "HEAL Research Program",
    doc_count: 850,
  },
  {
    key: "HEAL Studies",
    doc_count: 150,
  },
  {
    key: "Small Business Programs",
    doc_count: 150,
  },
  {
    key: "Focusing Medication Development to Prevent and Treat Opioid Use Disorder and Overdose",
    doc_count: 139,
  },
  {
    key: "Discovery and Validation of Novel Targets for Safe and Effective Treatment of Pain",
    doc_count: 83,
  },
  {
    key: "Training the Next Generation of Researchers in HEAL",
    doc_count: 49,
  },
  {
    key: "Preventing Opioid Use Disorder",
    doc_count: 46,
  },
  {
    key: "Development and Optimization of Non-Addictive Therapies to Treat Pain",
    doc_count: 43,
  },
  {
    key: "Clinical Trials Network",
    doc_count: 41,
  },
  {
    key: "Translating Discoveries into Effective Devices to Treat Pain",
    doc_count: 31,
  },
]

export const StudiesPanel = ({ searchTerm }) => {
  const collection = useCollectionContext()

  const [filters, setFilters] = useState({
    researchNetworks: [],
    vlmdAvailability: "",
    dataAvailability: "",
  })

  const [activeSidebarItem, setActiveSidebarItem] = useState(0)
  const [filteredStudies, setFilteredStudies] = useState([])

  useEffect(() => {
    setActiveSidebarItem(0)
  }, [searchTerm])

  useEffect(() => {
    if (
      filteredStudies.length > 0 &&
      activeSidebarItem >= filteredStudies.length
    ) {
      setActiveSidebarItem(0)
    }
  }, [filteredStudies, activeSidebarItem])

  const filterConfigs = useMemo(
    () => [
      {
        type: "multiselect",
        key: "researchNetworks",
        label: "Research Networks",
        options: RESEARCH_NETWORKS.map((network) => network.key),
      },
      {
        type: "select",
        key: "vlmdAvailability",
        label: "VLMD Availability",
        options: [
          { value: "available", label: "Available" },
          { value: "not_available", label: "Not Available" },
        ],
      },
      {
        type: "select",
        key: "dataAvailability",
        label: "Data Availability",
        options: [
          { value: "available", label: "Available" },
          { value: "not_available", label: "Not Available" },
        ],
      },
    ],
    []
  )

  const filterFunction = useCallback((study, currentFilters) => {
    if (
      currentFilters.researchNetworks &&
      currentFilters.researchNetworks.length > 0
    ) {
      const hasMatchingNetwork = currentFilters.researchNetworks.some(
        (network) => study.programs.includes(network)
      )
      if (!hasMatchingNetwork) {
        return false
      }
    }

    if (currentFilters.vlmdAvailability) {
      if (currentFilters.vlmdAvailability === "available") {
        if (study.variable_list.length === 0) {
          return false
        }
      } else if (currentFilters.vlmdAvailability === "not_available") {
        if (study.variable_list.length > 0) {
          return false
        }
      }
    }

    if (currentFilters.dataAvailability) {
      const availability = study.metadata?.data_availability
      if (currentFilters.dataAvailability === "available") {
        if (availability !== "all" && availability !== "some") {
          return false
        }
      }
      if (currentFilters.dataAvailability === "not_available") {
        if (availability !== "none") {
          return false
        }
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
          return `${loadedCount}+ studies found`
        }
        return `${totalCount || loadedCount} ${
          totalCount !== 1 ? "studies" : "study"
        } found`
      } else {
        const loaded = hasMore
          ? `${loadedCount}+`
          : `${totalCount || loadedCount}`
        return `Found ${filteredCount} of ${loaded} ${
          totalCount !== 1 ? "studies" : "study"
        } matching filters`
      }
    },
    []
  )

  const renderItem = useCallback((study, key, isActive, onClick) => {
    return (
      <SidebarItem
        key={key}
        study={study}
        name={study.name}
        id={study.id.split(":")?.[1] ?? study.id}
        variables={study.variable_list}
        onClick={onClick}
        active={isActive}
      />
    )
  }, [])

  const handleFilteredItemsChange = useCallback((items, fullResponse) => {
    setFilteredStudies(items)
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

  const activeStudy = filteredStudies[activeSidebarItem]

  return (
    <div className="flex flex-row max-h-full h-full">
      <InfiniteScrollList
        panelId="studies"
        fetchFunction={fetchStudies}
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
      {activeStudy ? (
        <div className="flex-1 p-4 min-h-0 overflow-auto">
          <div className="flex gap-2 justify-between">
            <h2 className="text-2xl font-semibold leading-relaxed mb-2 text-[#592963]">
              {activeStudy.name}
            </h2>
            <IconButton
              size="large"
              onClick={() => {
                collection.studies.toggle(activeStudy)
              }}
            >
              {collection.studies.has(activeStudy) ? (
                <Bookmark fontSize="large" sx={{ color: "#4d2862" }} />
              ) : (
                <BookmarkBorder fontSize="large" sx={{ color: "#4d2862" }} />
              )}
            </IconButton>
          </div>
          <span>
            Study ID:{" "}
            <Link to={activeStudy.action}>
              <Tooltip
                title="Open study in the HEAL Data Platform"
                placement="right"
              >
                {activeStudy.id.split(":")?.[1] ?? activeStudy.id}{" "}
                <OpenInNew fontSize="small" />
              </Tooltip>
            </Link>
          </span>
          <div className="flex flex-col gap-1 mt-2">
            {activeStudy.programs.map((prog) => (
              <p key={prog} className="uppercase text-gray-500 text-sm">
                {prog}
              </p>
            ))}
          </div>
          <hr className="my-4" />
          <p className="">{activeStudy.description}</p>

          <h3 className="text-xl font-semibold mt-6 mb-1">Information</h3>
          <table className="w-full table-auto border-collapse">
            <thead className="border-b border-gray-200 mb-2">
              <tr>
                <th className="text-left font-semibold py-1 pr-4">Field</th>
                <th className="text-left font-semibold py-1 ">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(activeStudy.metadata).map(([key, value]) => (
                <tr key={key}>
                  <td className="py-1 pr-4">{key}</td>
                  <td className="py-1">
                    {Array.isArray(value)
                      ? value.join(", ")
                      : formatStringIfDate(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <VariablesList study={activeStudy} searchTerm={searchTerm} />

          <CDEDisplay studyId={activeStudy.id} />
        </div>
      ) : (
        <div className="flex-1 p-4 min-h-0 overflow-auto flex items-center justify-center">
          <span className="text-gray-400 italic">
            Select a study to view details
          </span>
        </div>
      )}
    </div>
  )
}

function formatStringIfDate(str) {
  const resultDate = parseISO(str)
  if (!isValid(resultDate)) return str
  return format(resultDate, "M/dd/yyyy")
}

function SidebarItem({ study, name, id, variables, onClick, active }) {
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
            collection.studies.toggle(study)
          }}
        >
          {collection.studies.has(study) ? (
            <Bookmark fontSize="small" sx={{ color: "#4d2862" }} />
          ) : (
            <BookmarkBorder fontSize="small" sx={{ color: "#4d2862" }} />
          )}
        </IconButton>
      </div>
      <p className="text-sm mt-2 text-gray-500">{id}</p>
      {Boolean(variables.length) && (
        <p className="text-sm mt-1 text-gray-500">
          {variables.length} {variables.length !== 1 ? "measures" : "measure"}
        </p>
      )}
    </button>
  )
}
