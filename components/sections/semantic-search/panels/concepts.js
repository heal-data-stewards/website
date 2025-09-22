import { BookmarkBorder } from "@mui/icons-material"
import { CircularProgress, IconButton } from "@mui/material"
import { useState } from "react"
import { useQuery } from "utils/use-query"
import { ParentStudiesDisplay } from "../components/ParentStudiesDisplay"
import { fetchConcepts } from "../data/concepts"
import { CDEDisplay } from "../components/CDEDisplay"

export const ConceptsPanel = ({ searchTerm }) => {
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
  if (concepts.length < 1) return "No concepts found"
  const activeConcept = concepts[activeSidebarItem]

  return (
    <div className="flex flex-row max-h-full">
      <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0 overflow-auto">
        {concepts.map((concept, index) => (
          <SidebarItem
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
            <span className="text-lg text-gray-500 font-normal">
              {activeConcept.id}
            </span>
          </h2>
          <IconButton sx={{ flexShrink: 0 }} size="medium">
            <BookmarkBorder fontSize="medium" />
          </IconButton>
        </div>
        <p className="">{activeConcept.description}</p>

        <hr className="my-4" />

        {activeConcept.parentStudies.length > 0 && (
          <ParentStudiesDisplay studyIds={activeConcept.parentStudies} />
        )}

        {activeConcept.parentCdes.length > 0 && (
          <CDEDisplay elementIds={activeConcept.parentCdes} />
        )}
      </div>
    </div>
  )
}

function SidebarItem({
  name,
  description,
  parentStudies,
  parentCdes,
  onClick,
  active,
}) {
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
          sx={{ p: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <BookmarkBorder fontSize="small" />
        </IconButton>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
      <p className="text-sm text-right">
        {[
          parentStudies.length > 0 &&
            `${parentStudies.length} ${
              parentStudies.length === 1 ? "study" : "studies"
            }`,
          parentCdes.length > 0 &&
            `${parentCdes.length} ${parentCdes.length === 1 ? "CDE" : "CDEs"}`,
        ]
          .filter(Boolean)
          .join(", ")}
      </p>
    </button>
  )
}
