import { sendCustomEvent } from "utils/analytics"

export function trackHdpLinkClick({
  study,
  panelLocation,
  uiSurface,
  referringSearchTerm,
}) {
  sendCustomEvent("hss_hdp_link_clicked", {
    entity_type: "study",
    entity_id: study.id,
    entity_label: study.name,

    panel_location: `${panelLocation} panel`,
    ui_surface: uiSurface,

    referring_search_term: referringSearchTerm,
  })
}
