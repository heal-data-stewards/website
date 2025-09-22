import { BookmarkBorder } from "@mui/icons-material"
import { CircularProgress, IconButton } from "@mui/material"
import { useState } from "react"
import { useQuery } from "utils/use-query"
import { fetchVariables } from "../data/variables"
import { CDEDisplay } from "../components/CDEDisplay"
import { ParentStudiesDisplay } from "../components/ParentStudiesDisplay"

export const VariablesPanel = ({ searchTerm }) => {
  const payload = {
    query: searchTerm,
  }

  const variablesQuery = useQuery({
    queryFn: () => {
      if (!searchTerm) return null
      return fetchVariables(payload)
    },
    queryKey: `variables-${JSON.stringify(payload)}`,
  })

  const [activeSidebarItem, setActiveSidebarItem] = useState(0)

  if (variablesQuery.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  if (variablesQuery.error) {
    return (
      <div className="h-full flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading results</span>
      </div>
    )
  }

  if (variablesQuery.data === null) {
    return null
  }

  const variables = variablesQuery.data.results
  if (variables.length === 0) return "VLMD not yet available."
  const activeVariable = variables[activeSidebarItem]

  return (
    <div className="flex flex-row max-h-full">
      <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0 overflow-auto">
        {variables.map((variable, index) => (
          <SidebarItem
            key={variable.id}
            name={variable.id}
            numValues={
              Array.from(variable.metadata.permissible_values ?? []).length
            }
            onClick={() => setActiveSidebarItem(index)}
            active={activeSidebarItem === index}
          />
        ))}
      </div>
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
          <IconButton size="large">
            <BookmarkBorder fontSize="large" />
          </IconButton>
        </div>

        <hr className="my-4" />

        <p className="italic">{activeVariable.description}</p>

        {activeVariable.metadata.references && (
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
          <ParentStudiesDisplay studyIds={activeVariable.parents} />
        )}

        <h3 className="text-xl font-semibold mt-6 mb-1">
          {activeVariable.metadata.crf_name}
        </h3>
        {activeVariable.metadata.question_text !== "None" && (
          <p>{activeVariable.metadata.question_text}</p>
        )}

        {activeVariable.metadata.permissible_values?.length > 0 && (
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
    </div>
  )
}

function SidebarItem({ name, numValues, onClick, active }) {
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
          onClick={(e) => e.stopPropagation()}
        >
          <BookmarkBorder fontSize="small" />
        </IconButton>
      </div>
      <span className="text-sm text-gray-500">
        {`${numValues} ${numValues === 1 ? "value" : "values"}`}
      </span>
    </button>
  )
}
