import { CircularProgress, IconButton } from "@mui/material"
import { useQuery } from "utils/use-query"
import { fetchStudies } from "../data/studies"
import { useState } from "react"
import Link from "../../../elements/link"
import { Bookmark, BookmarkBorder, OpenInNew } from "@mui/icons-material"
import { format, isValid, parseISO } from "date-fns"
import { VariablesList } from "../components/VariablesList"
import { CDEDisplay } from "../components/CDEDisplay"
import { useCollectionContext } from "../context/collection"

export const StudiesPanel = ({ searchTerm }) => {
  const collection = useCollectionContext()

  const payload = {
    query: searchTerm,
  }

  const studiesQuery = useQuery({
    queryFn: () => {
      if (!searchTerm) return null
      return fetchStudies(payload)
    },
    queryKey: `studies-${JSON.stringify(payload)}`,
  })

  const [activeSidebarItem, setActiveSidebarItem] = useState(0)

  if (studiesQuery.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  if (studiesQuery.error) {
    return (
      <div className="h-full flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading results</span>
      </div>
    )
  }

  if (studiesQuery.data === null) {
    return null
  }

  const studies = studiesQuery.data.results
  if (studies.length < 1)
    return (
      <div className="w-full h-full flex items-center justify-center p-2">
        <span className="italic">No results for the requested query.</span>
      </div>
    )
  const activeStudy = studies[activeSidebarItem]

  return (
    <div className="flex flex-row max-h-full">
      <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0 overflow-auto">
        {studies.map((study, index) => (
          <SidebarItem
            study={study}
            key={study.id}
            name={study.name}
            id={study.id}
            variables={study.variable_list}
            onClick={() => setActiveSidebarItem(index)}
            active={activeSidebarItem === index}
          />
        ))}
      </div>
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
        <Link to={activeStudy.action}>
          {activeStudy.id} <OpenInNew fontSize="small" />
        </Link>
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
      <p className="text-sm mt-1 text-gray-500">
        {variables.length} {variables.length !== 1 ? "measures" : "measure"}
      </p>
    </button>
  )
}
