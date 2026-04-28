import App from "next/app"
import Head from "next/head"
import ErrorPage from "next/error"
import { useRouter } from "next/router"
import { DefaultSeo } from "next-seo"
import { getStrapiMedia } from "utils/media"
import { getGlobalData } from "utils/api"
import { SessionProvider } from "next-auth/react"
import { RouteGuard } from "@/components/route-guard"
import { CacheProvider } from "@emotion/react"
import { ThemeProvider } from "@mui/material/styles"
import createEmotionCache from "utils/createEmotionCache"
import { theme } from "../styles/theme"
import "@/styles/index.css"

const clientSideEmotionCache = createEmotionCache()

const options = {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: "2025-11-30",
}

const MyApp = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}) => {
  // Extract the data we need
  const { global } = pageProps
  if (global == null) {
    return <ErrorPage statusCode={404} />
  }

  const { metadata } = global

  return (
    <CacheProvider value={emotionCache}>
      <SessionProvider session={pageProps.session}>
        <Head>
          <link rel="shortcut icon" href={getStrapiMedia(global.favicon.url)} />
        </Head>
        {/* Global site metadata */}
        <DefaultSeo
          titleTemplate={`%s | ${global.metaTitleSuffix}`}
          title="Page"
          description={metadata.metaDescription}
          openGraph={{
            images: Object.values(metadata.shareImage.formats).map((image) => {
              return {
                url: getStrapiMedia(image.url),
                width: image.width,
                height: image.height,
              }
            }),
          }}
          twitter={{
            cardType: metadata.twitterCardType,
            handle: metadata.twitterUsername,
          }}
        />
        {/* Display the content */}
        <RouteGuard>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </RouteGuard>
      </SessionProvider>
    </CacheProvider>
  )
}

// getInitialProps disables automatic static optimization for pages that don't
// have getStaticProps. So [[...slug]] pages still get SSG.
// Hopefully we can replace this with getStaticProps once this issue is fixed:
// https://github.com/vercel/next.js/discussions/10949
MyApp.getInitialProps = async (appContext) => {
  // Calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext)
  const globalLocale = await getGlobalData(appContext.router.locale)

  return {
    ...appProps,
    pageProps: {
      global: globalLocale,
    },
  }
}

export default MyApp
