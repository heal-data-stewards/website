import { Chip, CircularProgress } from "@mui/material"
import { useQuery } from "utils/use-query"
import { fetchConcepts } from "../data/concepts"
import Accordion from "../accordion"

export const ConceptsPanel = ({ searchTerm }) => {
  const conceptsQuery = useQuery({
    queryFn: async () => {
      if (!searchTerm) return null
      return await fetchConcepts({ query: searchTerm, conceptTypes: ["cde"] })
    },
    queryKey: `concepts-${searchTerm}`,
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

  return (
    <>
      <div
        className="p-3 flex flex-wrap gap-2"
        style={{
          borderLeft: "1px solid rgba(0, 0, 0, .125)",
          borderRight: "1px solid rgba(0, 0, 0, .125)",
        }}
      >
        {conceptsQuery.data.results.length}{" "}
        {conceptsQuery.data.results.length === 1 ? "concept" : "concepts"}{" "}
        found.
      </div>
      <Accordion
        items={conceptsQuery.data.results.map((concept, index) => ({
          key: concept.id,
          summary: (
            <div className="flex flex-1" key={index}>
              <div className="flex flex-col flex-1">
                <span>
                  {concept.name}{" "}
                  <Chip
                    key={concept.id}
                    variant="outlined"
                    size="small"
                    label={concept.id}
                  />
                </span>
              </div>
              <span className="text-gray-500">
                {concept.search_terms.length}{" "}
                {concept.search_terms.length > 1 ? "terms" : "term"}
              </span>
            </div>
          ),
          details: (
            <div>
              <h3 className="text-lg font-bold text-[#532565] mb-2">
                {concept.name}
              </h3>
              <p className="italic">{concept.description}</p>

              <hr className="my-4" />

              <h3 className="text-lg font-bold text-[#532565] mb-2">
                Search Terms
              </h3>
              <ul>
                {concept.search_terms.map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ul>

              <hr className="my-4" />

              <h3 className="text-lg font-bold text-[#532565] mb-2">
                Identifiers
              </h3>
              <ul>
                {concept.identifiers.map((identifier) => (
                  <li key={identifier.id} className="flex gap-1">
                    {identifier.label}
                    <Chip
                      key={identifier.id}
                      variant="outlined"
                      size="small"
                      label={identifier.id}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ),
        }))}
      />
    </>
  )
}
