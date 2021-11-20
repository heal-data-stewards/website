import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import SearchBar from "../elements/search-bar"
import Divider from "@mui/material/Divider"
import PageTitle from "./page-title"

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
})

const filterByValue = (array, string) => {
  return array.filter((o) =>
    Object.keys(o).some((k) =>
      String(o[k]).toLowerCase().includes(string.toLowerCase())
    )
  )
}

export default function Glossary({ data }) {
  const [filter, setFilter] = React.useState("")
  const classes = useStyles()
  let items
  if (filter === "") {
    items = data.term.map((word, i) => {
      return (
        <>
          <div className={classes.root + " mt-10"} key={word + i}>
            <h2
              className="text-magenta capitalize pb-2"
              style={{ fontWeight: "600", fontSize: "1.2rem" }}
            >
              {word.title}
            </h2>
            <Divider />
            <h3 className="pt-4" style={{ fontWeight: "100" }}>
              {word.body}
            </h3>
          </div>
        </>
      )
    })
  } else {
    items = filterByValue(data.term, filter).map((word, i) => {
      return (
        <>
          <div className={classes.root + " mt-10"} key={word + i}>
            <h2
              className="text-magenta capitalize pb-2"
              style={{ fontWeight: "600", fontSize: "1.2rem" }}
            >
              {word.title}
            </h2>
            <Divider />
            <h3 className="pt-4" style={{ fontWeight: "100" }}>
              {word.body}
            </h3>
          </div>
        </>
      )
    })
  }
  return (
    <>
      <PageTitle data={{ title: data.title }} noPaddingBottom="true" />
      <main className="container pb-12 ">
        <div>
          <SearchBar setFilter={setFilter} filter={filter} />
          {items}
        </div>
      </main>
    </>
  )
}
