import { jsonToCsv } from "./jsonToCsv"

export function generateConceptsCsv(concepts) {
  const obj = concepts.map((concept) => ({
    ["Concept Name"]: concept.name,
    ["Concept Description"]: concept.description || "",
    ["Concept Type"]: concept.concept_type || "",
    ["Concept URL"]: concept.action || "",
  }))

  return jsonToCsv(obj)
}
