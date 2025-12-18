import { SearchRounded } from "@mui/icons-material"
import Link from "../../../elements/link"
import { CircularProgress } from "@mui/material"
import { useQuery } from "utils/use-query"
import { fetchConcepts } from "../data/concepts"
import { sendCustomEvent } from "utils/analytics"

export function RelatedSearches({ searchTerm }) {
  const payload = {
    query: searchTerm,
    limit: 3,
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
      <div className="h-40 flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  if (conceptsQuery.error) {
    return (
      <div className="h-40 flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading related concepts</span>
      </div>
    )
  }

  if (conceptsQuery.data === null) return null

  const concepts = conceptsQuery.data.results

  if (concepts.length === 0) return null

  return (
    <div className="border-solid border-[1px] border-gray-200 shadow-md p-4 rounded-md">
      <div className="flex items-center gap-2 text-[#4d2862]">
        <SearchRounded fontSize="medium" />
        <h3 className="text-lg font-semibold">People also searched for</h3>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col">
        {concepts.map((term) => (
          <Link
            to={`/resources/semantic-search/results?${new URLSearchParams({
              q: term.name,
            })}`}
            key={term.id}
            onClick={() => {
              sendCustomEvent("hss_related_search_clicked", {
                referring_search_term: searchTerm,
                related_search_term: term.name,
              })
            }}
          >
            {term.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
