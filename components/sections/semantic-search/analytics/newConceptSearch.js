import { sendCustomEvent } from "utils/analytics"

export function trackNewConceptSearched({
  concept,
  panelLocation,
  uiSurface,
  referringSearchTerm,
}) {
  sendCustomEvent("hss_new_concept_searched", {
    entity_type: "concept",
    entity_id: concept.id,
    entity_label: concept.name,

    panel_location: `${panelLocation} panel`,
    ui_surface: uiSurface,

    referring_search_term: referringSearchTerm,
  })
}
