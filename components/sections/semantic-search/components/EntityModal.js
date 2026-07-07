import { Close, NavigateNext } from "@mui/icons-material"
import {
  Breadcrumbs,
  CircularProgress,
  Dialog,
  IconButton,
} from "@mui/material"
import { useEffect } from "react"
import { useQuery } from "utils/use-query"
import { useQueryParam } from "utils/use-query-params"
import { PANEL_LOCATIONS } from "../analytics"
import { useEntityModal } from "../context/entity-modal"
import { ENTITY_TYPES, fetchEntityById } from "../data/entity"
import { CdeDetail } from "../details/CdeDetail"
import { ConceptDetail, lowercaseFirstLetters } from "../details/ConceptDetail"
import { StudyDetail } from "../details/StudyDetail"
import { VariableDetail } from "../details/VariableDetail"

// Distinct from the studies panel's container id so infinite scroll inside
// the modal doesn't target the page behind it
const MODAL_SCROLL_CONTAINER_ID = "entityModalScrollContainer"

function entryLabel(entry) {
  const name = entry.snapshot?.name
  if (!name || name === "None") return entry.id
  return entry.type === ENTITY_TYPES.CONCEPTS
    ? lowercaseFirstLetters(name)
    : name
}

export function EntityModal() {
  const modal = useEntityModal()
  const [searchTerm] = useQueryParam(null, "q")

  if (!modal) return null

  const { stack } = modal
  const top = stack[stack.length - 1]

  return (
    <Dialog
      open={stack.length > 0}
      onClose={modal.close}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { height: "85vh" } }}
    >
      {top && (
        <>
          <div className="flex items-center justify-between gap-4 px-4 py-2 border-b border-gray-200 flex-shrink-0">
            <Breadcrumbs
              separator={<NavigateNext fontSize="small" />}
              aria-label="Entity navigation history"
              maxItems={4}
              sx={{
                minWidth: 0,
                margin: 0,
                "& .MuiBreadcrumbs-ol": { paddingLeft: 0 },
              }}
            >
              {stack.map((entry, index) =>
                index < stack.length - 1 ? (
                  <button
                    key={`${index}-${entry.id}`}
                    className="text-[#4d2862] hover:underline max-w-[240px] truncate block"
                    onClick={() => modal.goTo(entry)}
                  >
                    {entryLabel(entry)}
                  </button>
                ) : (
                  <span
                    key={`${index}-${entry.id}`}
                    className="text-gray-600 font-semibold max-w-[320px] truncate block"
                  >
                    {entryLabel(entry)}
                  </span>
                )
              )}
            </Breadcrumbs>
            <IconButton
              onClick={modal.close}
              sx={{ color: "#4d2862" }}
              aria-label="Close"
            >
              <Close />
            </IconButton>
          </div>
          <EntityModalContent
            key={`${top.type}:${top.id}`}
            entry={top}
            searchTerm={searchTerm}
            hydrateEntry={modal.hydrateEntry}
          />
        </>
      )}
    </Dialog>
  )
}

function EntityModalContent({ entry, searchTerm, hydrateEntry }) {
  const entityQuery = useQuery({
    queryFn: () => fetchEntityById(entry.type, entry.id),
    queryKey: `entity-${entry.type}-${entry.id}`,
  })

  // Prefer fresh data, but render the snapshot (e.g. from a bookmark) while
  // loading or if the lookup comes back empty
  const entity = entityQuery.data ?? entry.snapshot ?? null

  useEffect(() => {
    if (entityQuery.data) {
      hydrateEntry(entry.type, entry.id, entityQuery.data)
    }
  }, [entityQuery.data, entry.type, entry.id, hydrateEntry])

  if (!entity) {
    if (entityQuery.isLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <CircularProgress />
        </div>
      )
    }
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <span className="text-gray-500 italic">
          Unable to load this item. It may no longer be available.
        </span>
      </div>
    )
  }

  return (
    <div className="flex-1 flex min-h-0">
      <EntityDetail type={entry.type} entity={entity} searchTerm={searchTerm} />
    </div>
  )
}

function EntityDetail({ type, entity, searchTerm }) {
  switch (type) {
    case ENTITY_TYPES.STUDIES:
      return (
        <StudyDetail
          study={entity}
          searchTerm={searchTerm}
          panelLocation={PANEL_LOCATIONS.MODAL}
          scrollContainerId={MODAL_SCROLL_CONTAINER_ID}
        />
      )
    case ENTITY_TYPES.CDES:
      return (
        <CdeDetail
          cde={entity}
          searchTerm={searchTerm}
          panelLocation={PANEL_LOCATIONS.MODAL}
        />
      )
    case ENTITY_TYPES.CONCEPTS:
      return (
        <ConceptDetail
          concept={entity}
          searchTerm={searchTerm}
          panelLocation={PANEL_LOCATIONS.MODAL}
        />
      )
    case ENTITY_TYPES.VARIABLES:
      return (
        <VariableDetail
          variable={entity}
          searchTerm={searchTerm}
          panelLocation={PANEL_LOCATIONS.MODAL}
        />
      )
    default:
      return null
  }
}
