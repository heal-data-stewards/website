import { sendCustomEvent } from "utils/analytics"

export function trackEntityModalOpened({
  entityType,
  entityId,
  entityLabel,
  uiSurface,
  referringSearchTerm,
}) {
  sendCustomEvent("hss_entity_modal_opened", {
    entity_type: entityType,
    entity_id: entityId,
    entity_label: entityLabel,
    ui_surface: uiSurface,
    referring_search_term: referringSearchTerm,
  })
}
