import { sendCustomEvent } from "utils/analytics"

export function trackCdeAccordionToggle({
  action,
  cde,
  panelLocation,
  referringSearchTerm,
}) {
  sendCustomEvent("hss_cde_accordion_toggled", {
    action, // "open" | "close"
    entity_type: "cde",
    entity_id: cde.key,
    entity_label: cde.summary.props.children[0].props.children[0], // cde.summary.props.children[0]
    panel_location: `${panelLocation} panel`,
    ui_surface: `${panelLocation}_panel_cde_accordion`,
    referring_search_term: referringSearchTerm,
  })
}
