import { CircularProgress, IconButton } from "@mui/material"
import { useQuery } from "utils/use-query"
import { fetchStudies } from "../data/studies"
import { useState } from "react"
import Link from "../../../elements/link"
import { BookmarkBorder, OpenInNew } from "@mui/icons-material"
import { format, isValid, parseISO } from "date-fns"
import { VariablesList } from "../components/VariablesList"
import { CDEDisplay } from "../components/CDEDisplay"

export const StudiesPanel = ({ searchTerm }) => {
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

  const {
    data: { results: studies },
  } = studiesQuery
  const activeStudy = studies[activeSidebarItem]

  return (
    <div className="flex flex-row max-h-full">
      <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0 overflow-auto">
        {studies.map((study, index) => (
          <SidebarItem
            key={study.id}
            name={study.name}
            id={study.id}
            onClick={() => setActiveSidebarItem(index)}
            active={activeSidebarItem === index}
          />
        ))}
      </div>
      <div className="flex-1 p-4 min-h-0 overflow-auto">
        <div className="flex gap-2">
          <h2 className="text-2xl font-semibold leading-relaxed mb-2 text-[#592963]">
            {activeStudy.name}
          </h2>
          <IconButton size="large">
            <BookmarkBorder fontSize="large" />
          </IconButton>
        </div>
        <Link to={activeStudy.action}>
          {activeStudy.id} <OpenInNew fontSize="small" />
        </Link>
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
                <td className="py-1">{formatStringIfDate(value)}</td>
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

function SidebarItem({ name, id, onClick, active }) {
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
        <IconButton size="small" onClick={(e) => e.stopPropagation()}>
          <BookmarkBorder fontSize="small" />
        </IconButton>
      </div>
      <p className="text-sm mt-2 text-gray-500">{id}</p>
    </button>
  )
}

{
  /*

  <Accordion
    items={flattenedStudies.map((study, index) => ({
      key: study.c_name,
      summary: (
        <div className="flex flex-1" key={index}>
          <div className="flex flex-col flex-1">
            <span>{study.c_name}</span>
            <div>
              <Chip variant="outlined" size="small" label={study.type} />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={study.c_link}
                className="ml-2 text-blue-600 hover:underline"
              >
                {study.c_id}
              </a>
            </div>
          </div>
          <span className="text-gray-500">
            {study.elements.length}{" "}
            {study.elements.length > 1 ? "elements" : "element"}
          </span>
        </div>
      ),
      details: <pre>{JSON.stringify(study.elements, null, 2)}</pre>,
    }))}
  />

*/
}
