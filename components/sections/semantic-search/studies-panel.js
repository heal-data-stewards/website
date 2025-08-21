import { Chip, CircularProgress } from "@mui/material"
import Accordion from "./accordion"
import { useQuery } from "utils/use-query"

export const StudiesPanel = ({
  searchTerm,
  excludedStudies,
  setExcludedStudies,
}) => {
  const studiesQuery = useQuery({
    queryFn: async () => {
      if (!searchTerm) return null
      setExcludedStudies([]) // Reset excluded studies on new search
      const res = await fetch("https://heal.renci.org/search-api/search_var", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchTerm,
          index: "variables_index",
          concept: "",
          offset: 0,
          size: 1000,
        }),
      })
      if (!res.ok) {
        throw new Error("Server returned an error")
      }
      return res.json()
    },
    queryKey: `studies-${searchTerm}`,
  })

  if (studiesQuery.isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  if (studiesQuery.error) {
    return (
      <div className="h-96 flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading results</span>
      </div>
    )
  }

  if (studiesQuery.data === null) {
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
        {Object.entries(studiesQuery.data.result).map(([type, items]) => (
          <Chip
            onClick={() => {
              setExcludedStudies((prev) =>
                prev.includes(type)
                  ? prev.filter((t) => t !== type)
                  : [...prev, type]
              )
            }}
            variant="outlined"
            style={{
              backgroundColor: excludedStudies.includes(type)
                ? "transparent"
                : "#ebe8ec",
              borderRadius: "16px",
              border: "1px solid rgb(0 0 0 / 0.125)",
            }}
            label={`${type} (${items.length})`}
            key={type}
            size="medium"
          />
        ))}
      </div>
      <Accordion
        studies={studiesQuery.data.result}
        selectedStudyFilters={excludedStudies}
      />
    </>
  )
}
