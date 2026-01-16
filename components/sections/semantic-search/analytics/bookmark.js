import { sendCustomEvent } from "utils/analytics"

export function trackBookmarkClick({
  action,
  entity,
  panelLocation,
  uiSurface,
  referringSearchTerm,
}) {
  const entityType =
    entity.element_type === "section"
      ? "cde"
      : entity.element_type || entity.type
  sendCustomEvent("hss_bookmark_clicked", {
    action,
    entity_type: entityType,
    entity_id: entity.id,
    entity_label: entity.name,
    panel_location: `${panelLocation} panel`,
    ui_surface: uiSurface,
    referring_search_term: referringSearchTerm,
  })
}
