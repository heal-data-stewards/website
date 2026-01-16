import { sendCustomEvent } from "utils/analytics"

export function trackStudiesAccordionToggle({
  action,
  study,
  panelLocation,
  referringSearchTerm,
}) {
  sendCustomEvent("hss_studies_accordion_toggled", {
    action, // "open" | "close"
    entity_type: "study",
    entity_id: study.key,
    entity_label: study.summary.props.children[0].props.children,
    panel_location: `${panelLocation} panel`,
    ui_surface: "studies_accordion",
    referring_search_term: referringSearchTerm,
  })
}
