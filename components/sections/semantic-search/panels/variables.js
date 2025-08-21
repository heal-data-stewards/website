import { Chip, CircularProgress } from "@mui/material"
import { useQuery } from "utils/use-query"
import { fetchVariables } from "../data/variables"
import Accordion from "../accordion"

export const VariablesPanel = ({ searchTerm }) => {
  const variablesQuery = useQuery({
    queryFn: async () => {
      if (!searchTerm) return null
      return await fetchVariables({ query: searchTerm })
    },
    queryKey: `variables-${searchTerm}`,
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

  return (
    <>
      <div
        className="p-3 flex flex-wrap gap-2"
        style={{
          borderLeft: "1px solid rgba(0, 0, 0, .125)",
          borderRight: "1px solid rgba(0, 0, 0, .125)",
        }}
      >
        {variablesQuery.data.results.length}{" "}
        {variablesQuery.data.results.length === 1 ? "variable" : "variables"}{" "}
        found.
      </div>
      <Accordion
        items={variablesQuery.data.results.map((variable, index) => ({
          key: variable.id,
          summary: (
            <div className="flex flex-1" key={index}>
              <div className="flex flex-col flex-1">
                <span>
                  {variable.name}{" "}
                  {variable.parents.map((parent) => (
                    <Chip
                      key={parent}
                      variant="outlined"
                      size="small"
                      label={parent}
                    />
                  ))}
                </span>
              </div>
              <span className="text-gray-500">
                {variable.search_terms.length}{" "}
                {variable.search_terms.length > 1 ? "terms" : "term"}
              </span>
            </div>
          ),
          details: (
            <div>
              <h3 className="text-lg font-bold text-[#532565] mb-2">
                {variable.name}
              </h3>
              <p className="italic">{variable.description}</p>
              <hr className="my-4" />
              <h3 className="text-lg font-bold text-[#532565] mb-2">
                Search Terms
              </h3>
              <ul>
                {variable.search_terms.map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ul>
            </div>
          ),
        }))}
      />
    </>
  )
}
