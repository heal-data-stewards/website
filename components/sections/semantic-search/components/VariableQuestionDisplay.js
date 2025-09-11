import { CircularProgress } from "@mui/material"
import { useQuery } from "utils/use-query"
import { fetchVariables } from "../data/variables"

export function VariableQuestionDisplay({ variableList }) {
  const payload = {
    query: "remove this parameter if IDs are sent",
    elementIds: variableList,
  }

  const variablesQuery = useQuery({
    queryFn: () => {
      return fetchVariables(payload)
    },
    queryKey: `variables-${JSON.stringify(payload)}`,
  })

  if (variablesQuery.isLoading) {
    return (
      <div className="h-56 flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  if (variablesQuery.error) {
    return (
      <div className="h-56 flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading variables</span>
      </div>
    )
  }

  const variables = variablesQuery.data.results

  if (variables.length === 0)
    return <p className="text-gray-400 italic">VLMD not yet available.</p>

  return (
    <div className="my-2 flex flex-col gap-4">
      {variables.map((v) => (
        <div key={v.id}>
          <h4 className="text-lg text-primary font-semibold mt-2">{v.id}</h4>
          {v.name !== "None" && <p>{v.name}</p>}
          {v.description !== "None" && (
            <p className="italic text-sm">{v.description}</p>
          )}

          <ul className="flex gap-1 my-2">
            {v.metadata.permissible_values.map((pv) => (
              <li
                className="odd:bg-gray-200 flex-1 px-2 py-1 rounded-md flex flex-col"
                key={pv.value}
              >
                <span className={!pv.description && "text-gray-500"}>
                  {pv.description ? pv.description : pv.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
