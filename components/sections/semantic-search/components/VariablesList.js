import { useState, useMemo, useCallback, useEffect } from "react"
import {
  Assessment,
  Bookmark,
  BookmarkBorder,
  PendingActions,
  Search,
} from "@mui/icons-material"
import {
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
} from "@mui/material"
import { fetchVariables } from "../data/variables"
import { useQuery } from "utils/use-query"
import { useCollectionContext } from "../context/collection"
import { Empty } from "./Empty"
import { trackBookmarkClick, UI_SURFACES } from "../analytics"
import { useLunrSearch } from "utils/use-lunr-search"
import { useDebounce } from "use-debounce"
import Highlighter from "react-highlight-words"
import InfiniteScroll from "react-infinite-scroll-component"

const VIRTUAL_PAGE_SIZE = 50

export function VariablesList({ study, searchTerm, panelLocation }) {
  const collection = useCollectionContext()
  const [showOnlyRelated, setShowOnlyRelated] = useState(false)
  const [search, setSearch] = useState("")
  const [visibleCount, setVisibleCount] = useState(VIRTUAL_PAGE_SIZE)

  const allVariablesPayload = useMemo(
    () => ({
      query: "",
      parentIds: [study.id],
      // For the purposes of frontend searching, need to fetch all results ahead of time instead of paginating
      limit: 10000,
    }),
    [study.id]
  )

  const relatedVariablesPayload = useMemo(
    () => ({
      query: searchTerm,
      parentIds: [study.id],
      limit: 10000,
    }),
    [study.id, searchTerm]
  )

  const allVariablesQuery = useQuery({
    queryFn: () => {
      if (!study) return null
      return fetchVariables(allVariablesPayload)
    },
    queryKey: `variables-all-${JSON.stringify(allVariablesPayload)}`,
  })

  const relatedVariablesQuery = useQuery({
    queryFn: () => {
      if (!study) return null
      return fetchVariables(relatedVariablesPayload)
    },
    queryKey: `variables-related-${JSON.stringify(relatedVariablesPayload)}`,
  })

  const activeQuery = showOnlyRelated
    ? relatedVariablesQuery
    : allVariablesQuery

  const lunrConfig = useMemo(
    () => ({
      docs: activeQuery.data?.results
        ? activeQuery.data.results.map(({ id, name, description }) => ({
            id,
            name,
            description,
          }))
        : [],
      index: {
        ref: "id",
        fields: ["name", "description"],
      },
    }),
    [activeQuery.data]
  )
  const { index, lexicalSearch } = useLunrSearch(lunrConfig)

  const [variableSource, highlightTokens] = useMemo(() => {
    const variables = activeQuery.data?.results
    if (!variables) return [[], []]
    if (search.length < 3) return [variables, []]

    const { hits, tokens } = lexicalSearch(search, { fuzziness: 0 })
    const hitIds = hits.map(({ ref }) => ref)
    const matchedVariables = variables.filter((variable) =>
      hitIds.includes(variable.id)
    )
    return [matchedVariables, tokens]
  }, [activeQuery.data, search, lexicalSearch])
  const visibleVariables = variableSource.slice(0, visibleCount)

  useEffect(() => {
    setVisibleCount(VIRTUAL_PAGE_SIZE)
  }, [variableSource])

  if (activeQuery.isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  if (activeQuery.error) {
    return (
      <div className="h-96 flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading results</span>
      </div>
    )
  }

  if (activeQuery.data === null) {
    return null
  }

  if (study.variable_list.length === 0) {
    return (
      <Empty
        icon={<PendingActions />}
        text="Variable Level Metadata not yet available."
      />
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="sticky -top-4 bg-white z-10 py-2 flex items-center">
        <VariableSearchInput onChange={setSearch} />
        <FormControlLabel
          control={
            <Checkbox
              checked={showOnlyRelated}
              onChange={(e) => setShowOnlyRelated(e.target.checked)}
              size="small"
            />
          }
          label={
            <span>
              Only show variables related to &quot;{searchTerm}&quot;
              {relatedVariablesQuery.data && (
                <span>&nbsp;({relatedVariablesQuery.data.results.length})</span>
              )}
            </span>
          }
          sx={{
            marginLeft: 2,
            "& .MuiFormControlLabel-label": {
              margin: 0,
              fontSize: "15px !important",
            },
          }}
        />
      </div>
      {variableSource.length === 0 ? (
        <Empty icon={<Assessment />} text="No related measures found." />
      ) : (
        <InfiniteScroll
          dataLength={visibleVariables.length}
          next={() => setVisibleCount((prev) => prev + VIRTUAL_PAGE_SIZE)}
          hasMore={visibleVariables.length < variableSource.length}
          scrollableTarget="studyScrollContainer"
          loader={
            <div className="flex justify-center py-4 overflow-hidden">
              <CircularProgress size={24} />
            </div>
          }
        >
          <ul className="flex flex-col gap-2">
            {visibleVariables.map((variable) => (
              <li key={variable.id} className="flex">
                <IconButton
                  className="flex-shrink-0"
                  size="small"
                  onMouseDown={(e) => {
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
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
                    }
                  }}
                >
                  {collection.variables.has(variable) ? (
                    <Bookmark fontSize="small" sx={{ color: "#4d2862" }} />
                  ) : (
                    <BookmarkBorder fontSize="small" sx={{ color: "#4d2862" }} />
                  )}
                </IconButton>
                <div className="flex flex-col ml-2">
                  <Highlighter
                    highlightClassName="bg-magenta-light2 text-primary"
                    textToHighlight={variable.name}
                    searchWords={highlightTokens}
                    autoEscape
                  />
                  <Highlighter
                    className="text-sm text-gray-400"
                    highlightClassName="bg-magenta-light2 text-primary"
                    textToHighlight={variable.description}
                    searchWords={highlightTokens}
                    autoEscape
                  />
                </div>
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      )}
    </div>
  )
}

function VariableSearchInput({ onChange }) {
  const [search, setSearch] = useState("")
  const [debouncedSearch] = useDebounce(search, 500)

  useEffect(() => {
    onChange(debouncedSearch)
  }, [debouncedSearch, onChange])

  return (
    <TextField
      size="small"
      placeholder="Find specific variables..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search fontSize="small" />
          </InputAdornment>
        ),
      }}
      sx={{
        flexGrow: 1,
        "& .MuiInputBase-root": { margin: 0 },
        "& .MuiOutlinedInput-root": {
          height: 32,
          fontSize: 14,
        },
      }}
    />
  )
}
