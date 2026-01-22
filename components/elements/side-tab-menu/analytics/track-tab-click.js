import { sendCustomEvent } from "utils/analytics"
import { toSnakeCase } from "utils/snake-case"

const trackTabClick = ({ title, url, isMobile }) => {
  const pageTitle = document.title.replace(/\s*\|.*$/, "")
  const eventName = `${toSnakeCase(pageTitle)}_tab_click`
  const pageUrl = window.location.pathname

  sendCustomEvent(eventName, {
    tab_title: title,
    tab_url: url ?? "in-page-click",
    parent_page_title: pageTitle,
    parent_page_url: pageUrl,
    view: isMobile ? "mobile" : "desktop",
  })
}
export default trackTabClick
