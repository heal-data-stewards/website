import { sendCustomEvent } from "utils/analytics"

export function trackVariableAccordionToggle({
  action,
  panelLocation,
  referringSearchTerm,
}) {
  sendCustomEvent("hss_variable_list_toggled", {
    action, // "open" | "close"
    entity_type: "related_variables",
    panel_location: panelLocation,
    ui_surface: "related_variables_toggle",
    referring_search_term: referringSearchTerm,
  })
}
