import { useState, useMemo, useCallback, useEffect } from "react"
import {
  ArrowForward,
  Assessment,
  Link as LinkIcon,
  PendingActions,
  ReadMore,
  Search,
} from "@mui/icons-material"
import {
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material"
import { fetchVariables } from "../data/variables"
import { ENTITY_TYPES } from "../data/entity"
import { useQuery } from "utils/use-query"
import { useEntityModal } from "../context/entity-modal"
import { BookmarkButton } from "./BookmarkButton"
import { Empty } from "./Empty"
import { UI_SURFACES } from "../analytics"
import { useLunrSearch } from "utils/use-lunr-search"
import { useDebounce } from "use-debounce"
import Highlighter from "react-highlight-words"
import InfiniteScroll from "react-infinite-scroll-component"
import { VariableQuestionDisplay } from "./VariableQuestionDisplay"

const VIRTUAL_PAGE_SIZE = 50

export function VariablesList({
  study,
  searchTerm,
  panelLocation,
  scrollContainerId = "studyScrollContainer",
}) {
  const modal = useEntityModal()
  const [showOnlyRelated, setShowOnlyRelated] = useState(false)
  const [showOnlyCDEMapped, setShowOnlyCDEMapped] = useState(false)
  const [search, setSearch] = useState("")
  const [visibleCount, setVisibleCount] = useState(VIRTUAL_PAGE_SIZE)
  const [cdeDialogVariable, setCdeDialogVariable] = useState(null)

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

  const relatedLunrConfig = useMemo(
    () => ({
      docs: relatedVariablesQuery.data?.results
        ? relatedVariablesQuery.data.results.map(
            ({ id, name, description }) => ({ id, name, description })
          )
        : [],
      index: {
        ref: "id",
        fields: ["name", "description"],
      },
    }),
    [relatedVariablesQuery.data]
  )
  const { lexicalSearch: relatedLexicalSearch } =
    useLunrSearch(relatedLunrConfig)

  const applySearch = useCallback(
    (variables, lexicalSearchFn) => {
      if (search.length < 3) return { variables, tokens: [] }
      const { hits, tokens } = lexicalSearchFn(search, { fuzziness: 0 })
      const hitIds = new Set(hits.map(({ ref }) => ref))
      return {
        variables: variables.filter((v) => hitIds.has(v.id)),
        tokens,
      }
    },
    [search]
  )

  const [variableSource, highlightTokens] = useMemo(() => {
    let variables = activeQuery.data?.results
    if (!variables) return [[], []]
    const { variables: searched, tokens } = applySearch(
      variables,
      lexicalSearch
    )
    variables = searched
    if (showOnlyCDEMapped) {
      variables = variables.filter((v) => v.metadata?.cde_mapping)
    }
    return [variables, tokens]
  }, [activeQuery.data, applySearch, lexicalSearch, showOnlyCDEMapped])
  const visibleVariables = variableSource.slice(0, visibleCount)

  const cdeMappedCount = useMemo(() => {
    const variables = activeQuery.data?.results
    if (!variables) return 0
    const { variables: searched } = applySearch(variables, lexicalSearch)
    return searched.filter((v) => v.metadata?.cde_mapping).length
  }, [activeQuery.data, applySearch, lexicalSearch])

  const relatedCount = useMemo(() => {
    const variables = relatedVariablesQuery.data?.results
    if (!variables) return null
    const { variables: searched } = applySearch(variables, relatedLexicalSearch)
    const filtered = showOnlyCDEMapped
      ? searched.filter((v) => v.metadata?.cde_mapping)
      : searched
    return filtered.length
  }, [
    relatedVariablesQuery.data,
    applySearch,
    relatedLexicalSearch,
    showOnlyCDEMapped,
  ])

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
      <div className="sticky -top-4 bg-white z-10 py-2 flex flex-col gap-2 border-b border-gray-200 mb-2">
        <VariableSearchInput onChange={setSearch} />
        <div className="flex items-center flex-wrap gap-x-4">
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
                Related to &quot;{searchTerm}&quot;
                {relatedCount !== null && <span>&nbsp;({relatedCount})</span>}
              </span>
            }
            sx={{
              margin: 0,
              "& .MuiFormControlLabel-label": {
                margin: 0,
                fontSize: "14px !important",
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showOnlyCDEMapped}
                onChange={(e) => setShowOnlyCDEMapped(e.target.checked)}
                size="small"
              />
            }
            label={
              <span>
                Has CDE mapping
                <span>&nbsp;({cdeMappedCount})</span>
              </span>
            }
            sx={{
              margin: 0,
              "& .MuiFormControlLabel-label": {
                margin: 0,
                fontSize: "14px !important",
              },
            }}
          />
        </div>
      </div>
      {variableSource.length === 0 ? (
        <Empty icon={<Assessment />} text="No related measures found." />
      ) : (
        <InfiniteScroll
          dataLength={visibleVariables.length}
          next={() => setVisibleCount((prev) => prev + VIRTUAL_PAGE_SIZE)}
          hasMore={visibleVariables.length < variableSource.length}
          scrollableTarget={scrollContainerId}
          loader={
            <div className="flex justify-center py-4 overflow-hidden">
              <CircularProgress size={24} />
            </div>
          }
        >
          <ul className="flex flex-col gap-2">
            {visibleVariables.map((variable) => (
              <li key={variable.id} className="flex">
                <BookmarkButton
                  className="flex-shrink-0"
                  entity={variable}
                  collectionKey="variables"
                  panelLocation={panelLocation}
                  uiSurface={UI_SURFACES.VARIABLES_LIST}
                  searchTerm={searchTerm}
                  size="small"
                />
                {modal && (
                  <Tooltip title="View variable details">
                    <IconButton
                      className="flex-shrink-0"
                      size="small"
                      onClick={() =>
                        modal.openEntity({
                          type: ENTITY_TYPES.VARIABLES,
                          id: variable.id,
                          entity: variable,
                          uiSurface: UI_SURFACES.VARIABLES_LIST,
                        })
                      }
                    >
                      <ReadMore fontSize="small" sx={{ color: "#4d2862" }} />
                    </IconButton>
                  </Tooltip>
                )}
                <div className="flex flex-col gap-0.5 ml-2">
                  <div className="flex items-center gap-2">
                    <Highlighter
                      highlightClassName="bg-magenta-light2 text-primary"
                      textToHighlight={variable.name}
                      searchWords={highlightTokens}
                      autoEscape
                    />
                    {variable.metadata?.cde_mapping && (
                      <Tooltip title="View CDE mapping">
                        <Chip
                          icon={<LinkIcon sx={{ fontSize: 14 }} />}
                          label="CDE"
                          size="small"
                          clickable
                          onClick={() => setCdeDialogVariable(variable)}
                          sx={{
                            height: 18,
                            fontSize: 11,
                            backgroundColor: "#4d2862",
                            color: "white",
                            "& .MuiChip-icon": { color: "white" },
                            "&:hover": { backgroundColor: "#6b3887" },
                          }}
                        />
                      </Tooltip>
                    )}
                  </div>
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
      <CDEMappingDialog
        variable={cdeDialogVariable}
        onClose={() => setCdeDialogVariable(null)}
      />
    </div>
  )
}

function MappingNode({ label, value }) {
  return (
    <div className="flex flex-col min-w-0">
      <span className="text-[10px] uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <span className="font-medium text-primary break-words text-sm">
        {value || "—"}
      </span>
    </div>
  )
}

function MappingArrow() {
  return (
    <div className="flex items-end pb-1 text-[#4d2862]">
      <ArrowForward sx={{ fontSize: 18 }} />
    </div>
  )
}

function CDEMappingDialog({ variable, onClose }) {
  const mapping = variable?.metadata?.cde_mapping
  return (
    <Dialog open={!!variable} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>CDE Mapping</DialogTitle>
      <DialogContent dividers>
        {variable && (
          <div className="flex flex-col gap-4">
            <div className="flex items-stretch justify-between gap-4 mx-2">
              <MappingNode label="Variable" value={variable.name} />
              <MappingArrow />
              <MappingNode label="Measure" value={mapping?.measure} />
              <MappingArrow />
              <MappingNode label="CDE" value={mapping?.cde} />
            </div>
            {mapping?.measure && (
              <>
                <Divider />
                <VariableQuestionDisplay variableList={[mapping.measure]} />
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
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
