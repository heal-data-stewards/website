import React, { useState } from "react"
import Markdown from "react-markdown"
import { Divider } from "@material-ui/core"
import Link from "next/link"
import MeilieSearchBar from "components/elements/MeilieSearchBar.js"
import { InstantSearch, Hits, Highlight } from "react-instantsearch-dom"
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch"
import { createConnector } from "react-instantsearch-dom"
import { Snippet } from "react-instantsearch-dom"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

function OutlinedCard(props) {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
          <a className="search-link" href={props.hit.slug || " "}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {"https://healdatafair.org/" + props.hit.slug}
            </Typography>
            <Typography variant="h6" component="div">
              {props.hit.metadata.metaTitle}
            </Typography>
          </a>
          <Typography color="text.secondary">
            {props.hit.metadata.metaDescription}
          </Typography>
        </CardContent>
        {/* <CardActions>
          <Button size="small">Visit</Button>
        </CardActions> */}
      </Card>
    </Box>
  )
}

const searchClient = instantMeiliSearch(
  "https://search.healdatafair.org/",
  "",
  {
    placeholderSearch: false,
  }
)

const Hit = ({ hit }) => {
  return (
    <>
      <OutlinedCard hit={hit} />
    </>
  )
}

export default function Topics({ data }) {
  // const [searched, setSearched] = useState(true);
  // add error handling
  const connectWithQuery = createConnector({
    displayName: "WidgetWithQuery",
    getProvidedProps(props, searchState) {
      // Since the `attributeForMyQuery` searchState entry isn't
      // necessarily defined, we need to default its value.
      const currentRefinement = searchState.attributeForMyQuery || ""

      // Connect the underlying component with the `currentRefinement`
      return { currentRefinement }
    },
    refine(props, searchState, nextRefinement) {
      // When the underlying component calls its `refine` prop,
      // we update the searchState with the provided refinement.
      return {
        // `searchState` represents the search state of *all* widgets. We need to extend it
        // instead of replacing it, otherwise other widgets will lose their respective state.
        ...searchState,
        attributeForMyQuery: nextRefinement,
      }
    },
    getSearchParameters(searchParameters, props, searchState) {
      // When the `attributeForMyQuery` state entry changes, we update the query
      return searchParameters.setQuery(searchState.attributeForMyQuery || "")
    },
    cleanUp(props, searchState) {
      // When the widget is unmounted, we omit the entry `attributeForMyQuery`
      // from the `searchState`, then on the next request the query will
      // be empty
      const { attributeForMyQuery, ...nextSearchState } = searchState

      return nextSearchState
    },
  })

  const ConnectedSearchBox = connectWithQuery(MeilieSearchBar)
  return (
    <>
      <div
        className="bg-gray-100 pt-12 pb-12"
        style={{ background: "#c0b3c569" }}
      >
        <div className="container">
          <InstantSearch indexName="page" searchClient={searchClient}>
            <ConnectedSearchBox />
            {/* <h4 className="text-2xl text-magenta font-bold mb-4 mt-4">
              Search Results
            </h4> */}
            <Divider style={{ background: "black" }} />
            <br></br>
            <Hits hitComponent={Hit} />
          </InstantSearch>
        </div>
      </div>
      <main className="container pb-12 ">
        <h2 className="text-4xl text-purple font-bold mb-4 mt-14">
          {data.title}
        </h2>
        <h3 className="text-1xl mb-14">{data.subtitle}</h3>
        <div className="flex-wrap flex">
          {data.topic.map((topic, i) => {
            return (
              <div
                className={"mb-8 odd:pr-10"}
                style={{ width: "50%" }}
                key={topic.title + i}
              >
                <h4 className="text-2xl text-magenta font-bold mb-4">
                  {topic.title}
                </h4>
                <Markdown linkTarget="_blank">{topic.body}</Markdown>
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
