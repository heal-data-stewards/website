import { Bookmark, BookmarkBorder } from "@mui/icons-material"
import { CircularProgress, IconButton } from "@mui/material"
import { useState } from "react"
import { useQuery } from "utils/use-query"
import { ParentStudiesDisplay } from "../components/ParentStudiesDisplay"
import { fetchConcepts } from "../data/concepts"
import { CDEDisplay } from "../components/CDEDisplay"
import { useCollectionContext } from "../context/collection"

export const ConceptsPanel = ({ searchTerm }) => {
  const collection = useCollectionContext()

  const [activeSidebarItem, setActiveSidebarItem] = useState(0)

  const payload = {
    query: searchTerm,
  }

  const conceptsQuery = useQuery({
    queryFn: () => {
      if (!searchTerm) return null
      return fetchConcepts(payload)
    },
    queryKey: `concepts-${JSON.stringify(payload)}`,
  })

  if (conceptsQuery.isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  if (conceptsQuery.error) {
    return (
      <div className="h-96 flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading results</span>
      </div>
    )
  }

  if (conceptsQuery.data === null) {
    return null
  }

  const concepts = conceptsQuery.data.results.map((concept) => ({
    ...concept,
    parentStudies: Array.from(
      new Set(
        concept.parents
          .map((str) => {
            const match = str.match(/^(HEALDATAPLATFORM:[^:]+):[^:]+$/)
            return match ? match[1] : null
          })
          .filter(Boolean)
      )
    ),
    parentCdes: Array.from(
      new Set(concept.parents.filter((str) => /^HEALCDE:[^:]+$/.test(str)))
    ),
  }))
  if (concepts.length < 1)
    return (
      <div className="w-full h-full flex items-center justify-center p-2">
        <span className="italic">No concepts found</span>
      </div>
    )
  const activeConcept = concepts[activeSidebarItem]

  return (
    <div className="flex flex-row max-h-full">
      <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0 overflow-auto">
        {concepts.map((concept, index) => (
          <SidebarItem
            concept={concept}
            key={concept.id}
            name={concept.name}
            description={concept.description}
            parentStudies={concept.parentStudies}
            parentCdes={concept.parentCdes}
            onClick={() => setActiveSidebarItem(index)}
            active={activeSidebarItem === index}
          />
        ))}
      </div>
      <div className="flex-1 p-4 min-h-0 overflow-auto">
        <div className="flex w-full justify-between gap-2">
          <h2 className="text-2xl font-semibold leading-relaxed mb-2 text-[#592963]">
            {activeConcept.name}{" "}
          </h2>
          <IconButton
            size="large"
            sx={{ flexShrink: 0 }}
            onClick={() => {
              collection.concepts.toggle(activeConcept)
            }}
          >
            {collection.concepts.has(activeConcept) ? (
              <Bookmark fontSize="large" sx={{ color: "#4d2862" }} />
            ) : (
              <BookmarkBorder fontSize="large" sx={{ color: "#4d2862" }} />
            )}
          </IconButton>
        </div>
        <div className="mb-2 flex gap-2 flex-wrap">
          <p className="text-gray-600 bg-gray-100 border-[1px] border-gray-200 border-solid px-2 py-1 rounded-lg shadow-sm">
            {activeConcept.id}
          </p>
          <p className="text-gray-600 bg-gray-100 border-[1px] border-gray-200 border-solid px-2 py-1 rounded-lg shadow-sm">
            {activeConcept.concept_type}
          </p>
        </div>
        <p className="">{activeConcept.description}</p>

        <hr className="my-4" />

        <ParentStudiesDisplay
          conceptId={activeConcept.id}
          searchTerm={searchTerm}
          titleFormatter={(numOfStudies) => (
            <>
              Studies
              {numOfStudies > 0 && ` (${numOfStudies.toLocaleString()})`}
            </>
          )}
        />

        <CDEDisplay searchTerm={searchTerm} conceptId={activeConcept.id} />
      </div>
    </div>
  )
}

function SidebarItem({ concept, name, description, onClick, active }) {
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
            collection.concepts.toggle(concept)
          }}
        >
          {collection.concepts.has(concept) ? (
            <Bookmark fontSize="small" sx={{ color: "#4d2862" }} />
          ) : (
            <BookmarkBorder fontSize="small" sx={{ color: "#4d2862" }} />
          )}
        </IconButton>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </button>
  )
}
