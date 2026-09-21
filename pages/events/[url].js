import { getPageData, getGlobalData } from "utils/api"
import { getAuthorizationToken, getEvent } from "utils/msft-graph-api"
import EventPage from "pages/events/_EventPage"

// Creates an Event page from the outlook calendar
function Eventpagebuild({ global, event, pageContext, metadata }) {
  // Render event page...
  return (
    <EventPage
      global={global}
      event={event}
      pageContext={pageContext}
      metadata={metadata}
    />
  )
}

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const events = await getAuthorizationToken()

  const eventPaths = events.map((event) => {
    return { url: event.id }
  })

  // Get the paths we want to pre-render based on posts
  const paths = eventPaths.map((event) => ({
    params: { url: event.url },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

// This also gets called at build time
export async function getStaticProps(context) {
  const { locale, locales, defaultLocale, preview = null } = context
  // params contains the event `url`.
  // If the route is like /event/1, then params.event is 1
  // const res = await fetch(`https://.../events/${params.url}`)
  const eventData = await getAuthorizationToken(context.params.url)

  // Get the navbar and footer from strapi
  const globalLocale = await getGlobalData(locale)
  const params = { slug: ["calendar"] }
  const pageData = await getPageData({ slug: params.slug }, locale, preview)

  // We have the required page data, pass it to the page component
  const { metadata, localizations, slug } = pageData

  const pageContext = {
    locale: pageData.locale,
    locales,
    defaultLocale,
    slug,
    localizations,
    url: context.params.url,
    token: eventData.token,
  }

  const event = { url: context.params.url, event: eventData }

  // Pass post data to the page via props
  return {
    props: {
      token: eventData.token || null,
      event,
      global: globalLocale,
      metadata,
      pageContext: {
        ...pageContext,
      },
    },
  }
}

export default Eventpagebuild
