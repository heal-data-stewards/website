import { CircularProgress } from "@mui/material"
import { useQuery } from "utils/use-query"
import { fetchCDEs } from "../data/cdes"
import Link from "../../../elements/link"
import { Download } from "@mui/icons-material"

export function CDEDisplay({ studyId }) {
  const payload = {
    query: "",
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
        <div className="flex flex-col gap-6">
          {cdes.map((cde) => (
            <div
              key={cde.id}
              className="pl-4 border-l-4 border-solid border-[#8c2f66]"
            >
              <div></div>
              <h4 className="text-lg mb-1">
                {cde.name}{" "}
                <span className="text-sm text-gray-500">{cde.id}</span>
              </h4>
              <Link href={cde.action}>
                {cde.action}
                <Download fontSize="small" />
              </Link>
              <p className="mt-1">{cde.description}</p>
              <ul className="list-disc list-inside mt-2">
                {cde.variable_list.map((variable) => (
                  <li key={variable}>{variable}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
