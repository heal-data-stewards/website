import { useQuery } from "utils/use-query"
import { fetchVariables } from "../data/variables"
import { CircularProgress } from "@mui/material"

export function MappedCDEMeasure({ variableId }) {
  const payload = {
    query: "",
    elementIds: [variableId],
  }

  const cdeMapping = useQuery({
    queryFn: () => {
      return fetchVariables(payload)
    },
    queryKey: `mapped-cde-measure-${JSON.stringify(payload)}`,
  })

  if (cdeMapping.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }
  if (cdeMapping.error) {
    return (
      <div className="h-full flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading results</span>
      </div>
    )
  }

  if (
    !Array.isArray(cdeMapping.data?.results) ||
    !cdeMapping.data.results.length > 0 ||
    !cdeMapping.data.results[0]?.metadata?.cde_mapping ||
    !cdeMapping.data.results[0].metadata.cde_mapping.measure ||
    !cdeMapping.data.results[0].metadata.cde_mapping.cde
  ) {
    return "No mapped CDE found for this measure."
  }

  const cdeMeasureMapping = cdeMapping.data.results[0].metadata.cde_mapping

  return (
    <div className="flex">
      <div>
        <h3 className="font-semibold leading-relaxed text-[#592963]">
          {cdeMeasureMapping.measure}
        </h3>
        <p>{cdeMeasureMapping.cde}</p>
      </div>
    </div>
  )
}
