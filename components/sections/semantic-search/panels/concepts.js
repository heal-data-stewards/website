import { CircularProgress } from "@mui/material"
import { useQuery } from "utils/use-query"
import { fetchConcepts } from "../data/concepts"

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
      ></div>
      <pre>{JSON.stringify(conceptsQuery.data, null, 2)}</pre>
    </>
  )
}
