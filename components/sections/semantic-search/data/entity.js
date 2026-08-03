import { fetchCDEs } from "./cdes"
import { fetchConcepts } from "./concepts"
import { fetchStudies } from "./studies"
import { fetchVariables } from "./variables"

export const ENTITY_TYPES = {
  STUDIES: "studies",
  CDES: "cdes",
  CONCEPTS: "concepts",
  VARIABLES: "variables",
}

export async function fetchEntityById(type, id) {
  let response

  if (type === ENTITY_TYPES.STUDIES) {
    response = await fetchStudies({ query: "", elementIds: [id] })
  } else if (type === ENTITY_TYPES.CDES) {
    response = await fetchCDEs({
      query: "",
      elementIds: [id.replace(/^HEALCDE:/, "")],
    })
  } else if (type === ENTITY_TYPES.VARIABLES) {
    response = await fetchVariables({ query: "", elementIds: [id] })
  } else if (type === ENTITY_TYPES.CONCEPTS) {
    // The concepts endpoint has no element_ids lookup, so filter on id instead
    response = await fetchConcepts({
      query: "",
      filters: [{ field: "id", operator: "eq", value: id }],
    })
  } else {
    return null
  }

  return response?.results?.[0] ?? null
}
