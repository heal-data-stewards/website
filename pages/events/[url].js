function Eventpage({ event }) {
    // Render post...
    return (
        <>
            <div className="container pt-10 pb-10">
              {/* Page header section */}
              <section>
                <h1 className="title mt-2 sm:mt-0 mb-4 sm:mb-2">testing</h1>
                <p className="text-gray font-thin text-xl mt-2 sm:mt-0 mb-4 sm:mb-2">testing subtitle</p>
              </section>
              {/* Events List */}

        </div>
        </>
      )
  }


// This function gets called at build time
export async function getStaticPaths() {
    // Call an external API endpoint to get posts, the outlook endpoint here
    // const res = await fetch('')
    // const posts = await res.json()
    const dummyEndpoints=[{url: "event1"}, {url:"event2"}]

  
    // Get the paths we want to pre-render based on posts
    const paths = dummyEndpoints.map((event) => ({
      params: { url: event.url },
    }))
  
    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
  }

  // This also gets called at build time
export async function getStaticProps({ params }) {
    // params contains the event `url`.
    // If the route is like /event/1, then params.event is 1
    // const res = await fetch(`https://.../events/${params.url}`)
    // const event = await res.json()

    const event = {url: "mockevent", title: "event title example"}
  
    // Pass post data to the page via props
    return { props: { event } }
  }

  export default Eventpage