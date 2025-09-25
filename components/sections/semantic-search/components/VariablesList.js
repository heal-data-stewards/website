import { Bookmark, BookmarkBorder } from "@mui/icons-material"
import { CircularProgress, IconButton } from "@mui/material"
import { fetchVariables } from "../data/variables"
import { useQuery } from "utils/use-query"
import { useCollectionContext } from "../context/collection"

export function VariablesList({ study, searchTerm }) {
  const collection = useCollectionContext()

  const payload = {
    query: searchTerm,
    parentIds: [study.id],
    limit: 1000,
  }

  const variablesQuery = useQuery({
    queryFn: () => {
      if (!study) return null
      return fetchVariables(payload)
    },
    queryKey: `studies-${JSON.stringify(payload)}`,
  })

  if (variablesQuery.isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  if (variablesQuery.error) {
    return (
      <div className="h-96 flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading results</span>
      </div>
    )
  }

  if (variablesQuery.data === null) {
    return null
  }

  const variables = variablesQuery.data.results

  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-1">
        Related Variables
        {variables.length > 0 && ` (${variables.length.toLocaleString()})`}
      </h3>
      {variables.length === 0 ? (
        <p className="text-gray-400 italic">
          {study.variable_list.length === 0
            ? "VLMD not yet available."
            : "No related measures found."}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {variables.map((variable) => (
            <li key={variable.id} className="flex">
              <IconButton
                className="flex-shrink-0"
                size="small"
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
              <div className="flex flex-col">
                <span>{variable.name}</span>
                <span className="text-sm text-gray-400">
                  {variable.description}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
