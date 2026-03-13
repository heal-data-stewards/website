import { jsonToCsv } from "./jsonToCsv"

export function generateCdesCsv(cdes) {
  const obj = cdes.map((cde) => ({
    ["CDE Name"]: cde.name,
    ["CDE Description"]: cde.description || "",
    ["CDE Type"]: cde?.metadata?.categories?.join("; ") || "",
    ["CDE URL"]: cde.action || "",
    ["Measures"]: cde?.variable_list?.join("; ") || "",
  }))

  return jsonToCsv(obj)
}
