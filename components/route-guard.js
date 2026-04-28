import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export { RouteGuard }

const publicPaths = [
  "/about",
  "/calendar",
  "/resources",
  "/resources/guidance",
  "/resources/glossary",
  "/resources/faqs",
  "/resources/webinar",
  "/resources/road-map",
  "/",
  "/collective",
  "/guidance",
  "/faqs",
  "/glossary",
  "/webinar",
  // "/search",
  "/collective/meetings",
  "/resources/metadata",
  "/resources/repositories",
  "/resources/guidance/selection",
  "/resources/heal-stewards-guidance",
  "/resources/semantic-search/help",
  "/sensitive-data",
  "/resources/semantic-search",
  "/resources/semantic-search/results",
  "/resources/dmsps",
  "/requirements",
  "/app-search",
  "/decision-tool",
  "/resources/metadata/finder",
  "/repository-decision-tree",
  "/resources/sensitive-data",
  "/resources/data-sharing-success",
  "/resources/data-packaging-guidance",
  "/resources/data-packaging-examples",
  "/resources/dd-preparation-guidance",
  "/resources/sharing-data",
  "/resources/HSS",
  "/resources/dmsps-overview",
  // The following used to be private pages only exposed to signed in guests
  // "/directory",
  // "/collaboration",
  // "/collective-board",
]

// Returns true for exact public paths, /events/ paths, and tab sub-paths that
// are exactly one segment deeper than a public path (e.g. /resources/data-sharing-success/analyze).
const isPublicPath = (path) => {
  if (publicPaths.includes(path) || path.includes("/events/")) return true
  return publicPaths.some(
    (p) => path.startsWith(p + "/") && !path.slice(p.length + 1).includes("/")
  )
}

function RouteGuard({ children }) {
  const router = useRouter()
  const initialPath = router.asPath.split("?")[0].split("#")[0]
  const [authorized, setAuthorized] = useState(isPublicPath(initialPath))

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath)

    const hideContent = () => setAuthorized(false)
    router.events.on("routeChangeStart", hideContent)

    router.events.on("routeChangeComplete", authCheck)

    return () => {
      router.events.off("routeChangeStart", hideContent)
      router.events.off("routeChangeComplete", authCheck)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function authCheck(url) {
    window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
      page_path: url,
    })
    // Strip both query params (?...) and hash fragments (#...)
    const path = url.split("?")[0].split("#")[0]

    const rememberMe = localStorage.getItem("loggedIn") === "true"

    if (!isPublicPath(path) && !rememberMe) {
      setAuthorized(false)
      router.push({
        pathname: "/",
        query: { returnUrl: router.asPath },
      })
    } else {
      setAuthorized(true)
    }
  }

  return authorized && children
}
