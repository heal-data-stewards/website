import { jsonToCsv } from "./jsonToCsv"

export function generateStudiesCsv(studies) {
  const obj = studies.map((study) => ({
    ["Study Title"]: study.name,
    ["Study Abstract"]: study.description,
    ["Study PI"]: study.metadata["Investigator/s"]
      ? study.metadata["Investigator/s"].join("; ")
      : "",
    ["Institution"]: study.metadata["Institution"] || "",
    ["Data Package Links"]:
      study.metadata["Data Package Links"]?.join("; ") || "",
    ["Data Availability"]: study.metadata["Data Availability"] || "",
    // ["List of CDEs"]: // This would require additional data fetching to get the list of CDEs associated with the study.,
    ["VLMD available"]:
      study.variable_list && study.variable_list.length > 0 ? "Yes" : "No",
    ["Research Program"]: study.programs ? study.programs.join("; ") : "",
    ["Study URL"]: study.action,
  }))

  return jsonToCsv(obj)
}
