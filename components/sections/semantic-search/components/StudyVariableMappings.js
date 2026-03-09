import { useQuery } from "utils/use-query"
import { fetchVariables } from "../data/variables"
import { CircularProgress } from "@mui/material"
import StyledAccordion from "../accordion"

export function StudyVariableMappings({ variableId }) {
  const payload = {
    query: "",
    elementIds: [variableId],
  }

  const studyVariableMappings = useQuery({
    queryFn: () => {
      return fetchVariables(payload)
    },
    queryKey: `study-variable-mappings-${JSON.stringify(payload)}`,
  })

  if (studyVariableMappings.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }
  if (studyVariableMappings.error) {
    return (
      <div className="h-full flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading results</span>
      </div>
    )
  }

  if (
    !Array.isArray(studyVariableMappings.data?.results) ||
    !studyVariableMappings.data.results.length > 0 ||
    !studyVariableMappings.data.results[0]?.metadata?.study_variable_mappings
  ) {
    return "No studies found using this measure."
  }

  const studyVariables =
    studyVariableMappings.data.results[0].metadata.study_variable_mappings

  return (
    <StyledAccordion
      items={Object.entries(studyVariables).map(
        ([study, variables], index) => ({
          key: study,
          summary: (
            <div className="flex justify-between items-center w-full">
              <h4>{study}</h4>
            </div>
          ),
          details: (
            <div>
              <p className="mt-1">{variables.join(", ")}</p>
            </div>
          ),
        })
      )}
    />
  )
}
