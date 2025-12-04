import { Button, CircularProgress, Collapse } from "@mui/material"
import { useQuery } from "utils/use-query"
import { fetchVariables } from "../data/variables"
import { useState } from "react"
import { ChevronRight, ExpandMore } from "@mui/icons-material"

export function VariableQuestionDisplay({ variableList }) {
  const [expanded, setExpanded] = useState(false)

  const payload = {
    query: "",
    elementIds: variableList,
    limit: 1000,
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
        <span className="text-red-600">Error loading measures</span>
      </div>
    )
  }

  const variables = variablesQuery.data.results

  if (variables.length === 0)
    return <p className="text-gray-400 italic">VLMD not yet available.</p>

  return (
    <div className="my-2">
      <CollapsibleHeading
        expanded={expanded}
        setExpanded={setExpanded}
        numItems={variables.length}
      >
        <h3 className="text-xl font-semibold">
          Measures ({variables.length ?? 0})
        </h3>
      </CollapsibleHeading>
      <Collapse in={expanded}>
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
                  <span
                    className={!pv.description ? "text-gray-500" : undefined}
                  >
                    {pv.description ? pv.description : pv.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Collapse>
    </div>
  )
}

function CollapsibleHeading({ expanded, setExpanded, numItems, children }) {
  if (numItems === 0) return children

  return (
    <button
      className="flex align-center gap-1"
      onClick={() => {
        setExpanded((e) => !e)
      }}
    >
      <ChevronRight
        sx={{
          transform: `${
            expanded ? "rotate(90deg)" : "rotate(0deg)"
          } translateY(1px)`,
          transition: "transform 300ms ease-in-out",
        }}
      />
      {children}
    </button>
  )
}
