import { jsonToCsv } from "./jsonToCsv"

export function generateVariablesCsv(variables) {
  const obj = variables.map((variable) => ({
    ["Variable Name"]: variable.name,
    ["Variable Description"]: variable.description,
    ["Data Type"]: variable.data_type,
    ["Is CDE"]: variable.is_cde ? "Yes" : "No",
    ["Permissible Values"]: variable.metadata.permissible_values
      ? Object.entries(variable.metadata.permissible_values)
          .map(([k, v]) => `${k}=${v}`)
          .join("; ")
      : "",
    ["Parent Studies/CDEs"]: variable.parents
      ? variable.parents.join("; ")
      : "",
  }))

  return jsonToCsv(obj)
}
