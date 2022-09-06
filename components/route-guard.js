import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export { RouteGuard }

function RouteGuard({ children }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath)

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false)
    router.events.on("routeChangeStart", hideContent)

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck)

    // unsubscribe from events in useEffect return function
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
    // redirect to account page if accessing a private page and not logged in
    const publicPaths = [
      // "/account",
      "/calendar",
      "/resources",
      "/resources/guidance",
      "/resources/glossary",
      "/resources/faqs",
      "/resources/webinar",
      "/",
      "/collective",
      "/guidance",
      "/faqs",
      "/glossary",
      "/webinar",
      // "/sign-up",
      // "/password-reset",
      "/resources/metadata",
      "/resources/guidance/selection",
      // The following used to be private pages only exposed to signed in guests
      // "/directory",
      // "/collaboration",
      // "/collective-board",
    ]
    const path = url.split("?")[0]

    const rememberMe = localStorage.getItem("loggedIn") === "true"
    // console.log(router.back())

    if (
      !publicPaths.includes(path) &&
      !rememberMe &&
      !path.includes("/events/")
    ) {
      setAuthorized(false)
      router.push({
        pathname: "/account",
        query: { returnUrl: router.asPath },
      })
    } else {
      setAuthorized(true)
    }
  }

  return authorized && children
}
