import Layout from "@/components/layout";
import { getPageData, getGlobalData } from "utils/api";
import Seo from "@/components/elements/seo";
import { getAuthorizationToken } from "utils/msft-graph-api";


// Creates an Event page from the outlook calendar

function Eventpage({ global, event, pageContext, metadata }) {
  // Render event page...
  return (
    <Layout
      global={global}
      pageContext={pageContext}
      style={{ background: "#9c2a6e08" }}
    >
      <Seo metadata={metadata} />
      <div className="container pt-10 pb-10">
        {/* Page header section */}
        <section>
          <h1 className="text-5xl font-black pb-8 text-gray-dark">
            {event.event.subject}
          </h1>
          <p className="text-xl text-gray-dark">{event.url}</p>
        </section>
      </div>
    </Layout>
  );
}

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const events = await getAuthorizationToken();

  const eventPaths = events.map((event)=>{
    return {url: event.id}
  })

  // Get the paths we want to pre-render based on posts
  const paths = eventPaths.map((event) => ({
    params: { url: event.url},
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

// This also gets called at build time
export async function getStaticProps(context) {
  const { locale, locales, defaultLocale, preview = null } = context;
  // params contains the event `url`.
  // If the route is like /event/1, then params.event is 1
  // const res = await fetch(`https://.../events/${params.url}`)
  const eventData = await getAuthorizationToken(context.params.url);

  // Get the navbar and footer from strapi
  const globalLocale = await getGlobalData(locale);
  const params = { slug: ["calendar"] };
  const pageData = await getPageData({ slug: params.slug }, locale, preview);

  // We have the required page data, pass it to the page component
  const { metadata, localizations, slug } = pageData;


  const pageContext = {
    locale: pageData.locale,
    locales,
    defaultLocale,
    slug,
    localizations,
  };

  const event = { url: context.params.url, event: eventData };

  // Pass post data to the page via props
  return {
    props: {
      event,
      global: globalLocale,
      metadata,
      pageContext: {
        ...pageContext,
      },
    },
  };
}

export default Eventpage;
