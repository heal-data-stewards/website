import { sendCustomEvent } from "utils/analytics"

export function trackLeftListClick({
  entity,
  panelLocation,
  referringSearchTerm,
  uiSurface,
}) {
  const entityType =
    entity.element_type === "section"
      ? "cde"
      : entity.element_type || entity.type || "study"

  sendCustomEvent("hss_left_list_clicked", {
    entity_type: entityType,
    entity_id: entity.id ?? "(unknown)",
    entity_label: entity.name ?? "(unknown)",
    panel_location: `${panelLocation} panel`,
    ui_surface: uiSurface,
    referring_search_term: referringSearchTerm ?? "(none)",
  })
}
