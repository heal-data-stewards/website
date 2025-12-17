import { Bookmark, BookmarkBorder, ChevronRight } from "@mui/icons-material"
import { CircularProgress, Collapse, IconButton } from "@mui/material"
import { fetchVariables } from "../data/variables"
import { useQuery } from "utils/use-query"
import { useCollectionContext } from "../context/collection"
import { useState } from "react"
import { trackBookmarkClick, UI_SURFACES } from "../analytics"

export function VariablesList({ study, searchTerm, panelLocation }) {
  const collection = useCollectionContext()
  const [expanded, setExpanded] = useState()

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
      <div className="mt-6 mb-1">
        <CollapsibleHeading
          expanded={expanded}
          setExpanded={setExpanded}
          numItems={variables.length}
        >
          <h3 className="text-xl font-semibold">
            Related Variables
            {variables.length > 0 && ` (${variables.length.toLocaleString()})`}
          </h3>
        </CollapsibleHeading>
      </div>
      {variables.length === 0 ? (
        <p className="text-gray-400 italic">
          {study.variable_list.length === 0
            ? "Variable Level Metadata not yet available."
            : "No related measures found."}
        </p>
      ) : (
        <Collapse in={expanded}>
          <ul className="flex flex-col gap-2">
            {variables.map((variable) => (
              <li key={variable.id} className="flex">
                <IconButton
                  className="flex-shrink-0"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    const isBookmarked = collection.variables.has(variable)
                    collection.variables.toggle(variable)
                    trackBookmarkClick({
                      action: isBookmarked ? "remove" : "add",
                      entity: variable,
                      panelLocation,
                      uiSurface: UI_SURFACES.VARIABLES_LIST,
                      referringSearchTerm: searchTerm,
                    })
                  }}
                >
                  {collection.variables.has(variable) ? (
                    <Bookmark fontSize="small" sx={{ color: "#4d2862" }} />
                  ) : (
                    <BookmarkBorder
                      fontSize="small"
                      sx={{ color: "#4d2862" }}
                    />
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
        </Collapse>
      )}
    </>
  )
}

function CollapsibleHeading({ expanded, setExpanded, numItems, children }) {
  if (numItems === 0) return children

  return (
    <button
      className="flex align-center gap-1"
      onClick={() => {
        setExpanded((e) => !e)
      }}
    >
      <ChevronRight
        sx={{
          transform: `${
            expanded ? "rotate(90deg)" : "rotate(0deg)"
          } translateY(1px)`,
          transition: "transform 300ms ease-in-out",
        }}
      />
      {children}
    </button>
  )
}
