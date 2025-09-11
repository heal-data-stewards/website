import { CircularProgress } from "@mui/material"
import { useQuery } from "utils/use-query"
import { fetchCDEs } from "../data/cdes"

export function CDEDisplay({ studyId }) {
  const payload = {
    query: "remove this parameter if IDs are sent",
    parentIds: [studyId],
  }

  const cdesQuery = useQuery({
    queryFn: () => {
      return fetchCDEs(payload)
    },
    queryKey: `cdes-${JSON.stringify(payload)}`,
  })

  if (cdesQuery.isLoading) {
    return (
      <div className="h-56 flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  if (cdesQuery.error) {
    return (
      <div className="h-56 flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading CDEs</span>
      </div>
    )
  }

  const cdes = cdesQuery.data.results

  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-1">
        CDEs
        {cdes.length > 0 && ` (${cdes.length.toLocaleString()})`}
      </h3>
      {cdes.length === 0 ? (
        <p className="text-gray-400 italic">No CDEs found for this study.</p>
      ) : (
        <pre>{JSON.stringify(cdes, null, 2)}</pre>
      )}
    </>
  )
}
