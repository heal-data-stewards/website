import ErrorPage from "next/error"
import { getPageData, fetchAPI, getGlobalData } from "utils/api"
import Sections from "@/components/sections"
import Seo from "@/components/elements/seo"
import { useRouter } from "next/router"
import Layout from "@/components/layout"
import { getLocalizedPaths } from "utils/localize"
import { getAuthorizationToken } from "utils/msft-graph-api"
import ChecklistGraphic from "@/components/sections/checklist-graphic"

// The file is called [[...slug]].js because we're using Next's
// optional catch all routes feature. See the related docs:
// https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes

const DynamicPage = ({
  sections,
  metadata,
  preview,
  global,
  pageContext,
  eventData,
  token,
}) => {
  const router = useRouter()

  // Check if the required data was provided
  if (!router.isFallback && !sections?.length) {
    return <ErrorPage statusCode={404} />
  }

  // Loading screen (only possible in preview mode)
  if (router.isFallback) {
    return <div className="container">Loading...</div>
  }

  if (
    pageContext.slug === "resources" ||
    pageContext.slug === "account" ||
    pageContext.slug === "sign-up" ||
    pageContext.slug === "directory" ||
    pageContext.slug === "glossary"
  ) {
    return (
      <Layout
        global={global}
        pageContext={pageContext}
        style={{ background: "#9c2a6e08" }}
      >
        {/* Add meta tags for SEO*/}
        <Seo metadata={metadata} />
        {/* Display content sections */}
        <Sections
          glossary={global.glossary_td}
          sections={sections}
          preview={preview}
          eventData={eventData}
        />
      </Layout>
    )
  }

  return (
    <Layout global={global} pageContext={pageContext}>
      {/* Add meta tags for SEO*/}
      <Seo metadata={metadata} />

      {/* FOR TESTING, REMOVE */}
      <ChecklistGraphic />

      {/* Display content sections */}
      <Sections
        sections={sections}
        preview={preview}
        eventData={eventData}
        token={token}
        glossary={global.glossary_td}
      />
    </Layout>
  )
}

export async function getStaticPaths(context) {
  // Get all pages from Strapi
  const allPages = context.locales.map(async (locale) => {
    const localePages = await fetchAPI(`/pages?_locale=${locale}`)
    return localePages
  })

  const pages = await (await Promise.all(allPages)).flat()

  const paths = pages.map((page) => {
    // Decompose the slug that was saved in Strapi
    const slugArray = !page.slug ? false : page.slug.split("/")

    return {
      params: { slug: slugArray },
      // Specify the locale to render
      locale: page.locale,
    }
  })

  return { paths, fallback: true }
}

export async function getStaticProps(context) {
  const { params, locale, locales, defaultLocale, preview = null } = context

  const globalLocale = await getGlobalData(locale)
  let eventData = []
  // Fetch pages. Include drafts if preview mode is on
  if (params.slug !== undefined && params.slug[0] === "calendar") {
    let events = await getAuthorizationToken()
    eventData = events
  }
  if (params.slug !== undefined && params.slug[1] === "webinar") {
    let events = await getAuthorizationToken()

    const result = events.filter(
      (event) => event.categories[0] === "Purple category"
    )
    eventData = result
    eventData.token = events.token
  }
  if (
    params.slug !== undefined &&
    params.slug[0] === "collective" &&
    params.slug[1] === "meetings"
  ) {
    let events = await getAuthorizationToken()

    const result = events.filter(
      (event) => event.categories[0] === "Green category"
    )
    eventData = result
    eventData.token = events.token
  }

  const pageData = await getPageData(
    { slug: !params.slug ? [""] : params.slug },
    locale,
    preview
  )

  if (pageData == null) {
    // Giving the page no props will trigger a 404 page
    return { props: {} }
  }

  // We have the required page data, pass it to the page component
  const { contentSections, metadata, localizations, slug } = pageData

  const pageContext = {
    locale: pageData.locale,
    locales,
    defaultLocale,
    slug,
    localizations,
    token: eventData.token || null,
  }

  const localizedPaths = getLocalizedPaths(pageContext)

  return {
    props: {
      token: eventData.token || null,
      preview,
      eventData: eventData,
      sections: contentSections,
      metadata,
      global: globalLocale,
      pageContext: {
        ...pageContext,
        localizedPaths,
      },
    },
  }
}

export default DynamicPage
