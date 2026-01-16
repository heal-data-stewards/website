import { sendCustomEvent } from "utils/analytics"

export function trackCdeDownloadClick({
  cde,
  file,
  panelLocation,
  uiSurface,
  referringSearchTerm,
}) {
  sendCustomEvent("cde_download_clicked", {
    entity_type:
      cde.element_type === "section" ? "cde" : cde.element_type || cde.type,
    entity_id: cde.id,
    entity_name: cde.name,

    file_name: file?.filename ?? cde?.name ?? "unknown_file",
    file_url: file?.url ?? cde?.action ?? "unknown_url",

    panel_location: `${panelLocation} panel`,
    ui_surface: uiSurface,
    referring_search_term: referringSearchTerm,
  })
}
