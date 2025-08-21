import { CircularProgress } from "@mui/material"
import { useQuery } from "utils/use-query"
import { fetchVariables } from "../data/variables"

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
        toolbar
      </div>
      <pre>{JSON.stringify(variablesQuery.data, null, 2)}</pre>
    </>
  )
}
