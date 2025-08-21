import { Chip, CircularProgress } from "@mui/material"
import Accordion from "../accordion"
import { useQuery } from "utils/use-query"
import { Details } from "@mui/icons-material"

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

  const flattenedStudies = Object.entries(studiesQuery.data.result).reduce(
    (acc, [type, items]) => {
      if (!excludedStudies.includes(type)) {
        acc.push(...items.map((item) => ({ ...item, type })))
      }
      return acc
    },
    []
  )

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
        items={flattenedStudies.map((study, index) => ({
          key: study.c_name,
          summary: (
            <div className="flex flex-1" key={index}>
              <div className="flex flex-col flex-1">
                <span>{study.c_name}</span>
                <div>
                  <Chip variant="outlined" size="small" label={study.type} />
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={study.c_link}
                    className="ml-2 text-blue-600 hover:underline"
                  >
                    {study.c_id}
                  </a>
                </div>
              </div>
              <span className="text-gray-500">
                {study.elements.length}{" "}
                {study.elements.length > 1 ? "elements" : "element"}
              </span>
            </div>
          ),
          details: <pre>{JSON.stringify(study.elements, null, 2)}</pre>,
        }))}
      />
    </>
  )
}
