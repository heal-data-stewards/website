import {
  Assessment,
  Bookmark,
  BookmarkBorder,
  ChevronRight,
  PendingActions,
  SearchOff,
} from "@mui/icons-material"
import { CircularProgress, IconButton } from "@mui/material"
import { fetchVariables } from "../data/variables"
import { useQuery } from "utils/use-query"
import { useCollectionContext } from "../context/collection"
import { Empty } from "./Empty"
import { useState } from "react"
import {
  trackBookmarkClick,
  trackVariableAccordionToggle,
  UI_SURFACES,
} from "../analytics"

export function VariablesList({ study, searchTerm, panelLocation }) {
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

  if (variables.length === 0) {
    if (study.variable_list.length === 0) {
      return (
        <Empty
          icon={<PendingActions />}
          text="Variable Level Metadata not yet available."
        />
      )
    } else {
      return <Empty icon={<Assessment />} text="No related measures found." />
    }
  }
  return (
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
              <BookmarkBorder fontSize="small" sx={{ color: "#4d2862" }} />
            )}
          </IconButton>
          <div className="flex flex-col ml-2">
            <span>{variable.name}</span>
            <span className="text-sm text-gray-400">
              {variable.description}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
