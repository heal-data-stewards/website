import { sendCustomEvent } from "utils/analytics"

export function trackOntologyLinkClick({
  concept,
  panelLocation,
  uiSurface,
  referringSearchTerm,
}) {
  sendCustomEvent("hss_ontology_link_clicked", {
    entity_type: "concept",
    entity_id: concept.id,
    entity_label: concept.name,

    panel_location: `${panelLocation} panel`,
    ui_surface: uiSurface,

    referring_search_term: referringSearchTerm,
  })
}
