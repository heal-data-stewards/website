import { CircularProgress } from "@mui/material"
import { useQuery } from "utils/use-query"
import { fetchStudies } from "../data/studies"
import Link from "../../../elements/link"
import { OpenInNew } from "@mui/icons-material"
import StyledAccordion from "../accordion"

export function ParentStudiesDisplay({
  studyIds,
  titleFormatter,
  notFoundText,
  conceptId,
  searchTerm,
}) {
  const payload = conceptId
    ? {
        query: searchTerm,
        concept: conceptId,
      }
    : {
        query: "",
        elementIds: studyIds,
      }

  const studiesQuery = useQuery({
    queryFn: () => {
      return fetchStudies(payload)
    },
    queryKey: `studies-${JSON.stringify(payload)}`,
  })

  if (studiesQuery.isLoading) {
    return (
      <div className="h-56 flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  if (studiesQuery.error) {
    return (
      <div className="h-56 flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading studies</span>
      </div>
    )
  }

  const studies = studiesQuery.data.results

  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-1">
        {titleFormatter ? (
          titleFormatter(studies.length)
        ) : (
          <>
            Parent Studies
            {studies.length > 0 && ` (${studies.length.toLocaleString()})`}
          </>
        )}
      </h3>
      {studies.length === 0 ? (
        <p className="text-gray-400 italic">
          {notFoundText ?? "No parents found for this study."}
        </p>
      ) : (
        <StyledAccordion
          items={studies.map((study) => ({
            key: study.key,
            summary: (
              <div>
                <h4>
                  {study.name}{" "}
                  <span className="text-sm text-gray-500">{study.id}</span>
                </h4>
              </div>
            ),
            details: (
              <div>
                <Link href={study.action}>
                  {study.action} <OpenInNew fontSize="small" />
                </Link>
                <p className="mt-1">{study.description}</p>
              </div>
            ),
          }))}
        />
      )}
    </>
  )
}
