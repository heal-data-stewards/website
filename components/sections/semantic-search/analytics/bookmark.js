import { sendCustomEvent } from "utils/analytics"

export function trackBookmarkClick({
  action,
  entity,
  panelLocation,
  uiSurface,
  referringSearchTerm,
}) {
  sendCustomEvent("hss_bookmark_clicked", {
    action,
    entity_type: entity.element_type,
    entity_id: entity.id,
    entity_label: entity.name,
    panel_location: panelLocation,
    ui_surface: uiSurface,
    referring_search_term: referringSearchTerm,
  })
}
