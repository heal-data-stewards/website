import { jsonToCsv } from "./jsonToCsv"

export function generateCdesCsv(cdes) {
  const obj = cdes.map((cde) => ({
    ["CDE Name"]: cde.name,
    ["CDE Description"]: cde.description || "",
    // ["CDE Type"]: // Not sure where this data is
    ["CDE URL"]: cde.action || "",
    // ["Number of measures"]: // This would require additional data fetching
  }))

  return jsonToCsv(obj)
}
