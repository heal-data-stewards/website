import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useQueryParam } from "utils/use-query-params"
import { trackEntityModalOpened } from "../analytics"
import { ENTITY_TYPES } from "../data/entity"

const MODAL_PARAM = "modal"
const VALID_TYPES = new Set(Object.values(ENTITY_TYPES))

// The param value is `${type}:${id}`; ids can themselves contain colons, so
// only the first colon separates the two.
function parseModalParam(value) {
  if (!value) return null
  const separatorIndex = value.indexOf(":")
  if (separatorIndex < 1) return null
  const type = value.slice(0, separatorIndex)
  const id = value.slice(separatorIndex + 1)
  if (!VALID_TYPES.has(type) || !id) return null
  return { type, id }
}

const EntityModalContext = createContext(null)

/**
 * Holds the modal's navigation stack (for the breadcrumb trail) and keeps the
 * top entry mirrored in the `modal` URL query param. Because every navigation
 * pushes a history entry, the browser back button pops the stack and deep
 * links open the modal directly.
 */
export function EntityModalProvider({ children }) {
  const [modalParam, setModalParam] = useQueryParam(null, MODAL_PARAM)
  const [searchTerm] = useQueryParam(null, "q")
  const [stack, setStack] = useState([])

  // Reconcile the stack with the URL param — covers deep links on mount and
  // browser back/forward navigation.
  useEffect(() => {
    const parsed = parseModalParam(modalParam)
    setStack((prev) => {
      if (!parsed) return prev.length === 0 ? prev : []
      const top = prev[prev.length - 1]
      if (top && top.type === parsed.type && top.id === parsed.id) return prev
      const existingIndex = prev.findIndex(
        (entry) => entry.type === parsed.type && entry.id === parsed.id
      )
      if (existingIndex >= 0) return prev.slice(0, existingIndex + 1)
      return [...prev, parsed]
    })
  }, [modalParam])

  const openEntity = useCallback(
    ({ type, id, entity, uiSurface }) => {
      setStack((prev) => {
        // Navigating to an entity already in the trail rewinds to it instead
        // of growing the breadcrumb with duplicates
        const existingIndex = prev.findIndex(
          (entry) => entry.type === type && entry.id === id
        )
        if (existingIndex >= 0) return prev.slice(0, existingIndex + 1)
        return [...prev, { type, id, snapshot: entity }]
      })
      setModalParam(`${type}:${id}`)

      trackEntityModalOpened({
        entityType: type,
        entityId: id,
        entityLabel: entity?.name,
        uiSurface,
        referringSearchTerm: searchTerm,
      })
    },
    [setModalParam, searchTerm]
  )

  const goTo = useCallback(
    (entry) => {
      setModalParam(`${entry.type}:${entry.id}`)
    },
    [setModalParam]
  )

  const close = useCallback(() => {
    setModalParam(null)
  }, [setModalParam])

  // Fill in the snapshot for entries opened from a deep link, so the
  // breadcrumb can show the entity name once it has been fetched
  const hydrateEntry = useCallback((type, id, entity) => {
    setStack((prev) => {
      const needsUpdate = prev.some(
        (entry) => entry.type === type && entry.id === id && !entry.snapshot
      )
      if (!needsUpdate) return prev
      return prev.map((entry) =>
        entry.type === type && entry.id === id && !entry.snapshot
          ? { ...entry, snapshot: entity }
          : entry
      )
    })
  }, [])

  const value = useMemo(
    () => ({
      stack,
      isOpen: stack.length > 0,
      openEntity,
      goTo,
      close,
      hydrateEntry,
    }),
    [stack, openEntity, goTo, close, hydrateEntry]
  )

  return (
    <EntityModalContext.Provider value={value}>
      {children}
    </EntityModalContext.Provider>
  )
}

// Returns null when no provider is present, so shared components can hide
// their "view details" affordances outside the semantic search page
export const useEntityModal = () => useContext(EntityModalContext)
