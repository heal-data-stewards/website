import React, { useState, useEffect } from "react"
import { makeStyles } from "@mui/material"
import SearchBar from "../elements/glossary/search-bar"
import GlossaryItem from "../elements/glossary/item"
import { getStrapiApiPageData } from "utils/api"

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
  const [filter, setFilter] = useState("")
  const [terms, setTerms] = useState(data.gtd_item)
  const classes = useStyles()
  let items

  useEffect(() => {
    // Take the fetched page data and search for the glossary terms
    const findTermsSection = (arr, section) => {
      const newArr = arr.filter((element) => {
        return element.__component === section
      })
      return newArr
    }

    getStrapiApiPageData("resources/glossary")
      .then((res) => {
        return findTermsSection(
          res.contentSections,
          "sections.glossary-term-and-definition"
        )
      })
      .then((res) => {
        const newState = res[0].gtd_item
        setTerms(newState)
      })
  }, [])
  if (filter === "") {
    items = terms.map((word, i) => {
      return <GlossaryItem classes={classes} word={word} i={i} key={word + i} />
    })
  } else {
    items = filterByValue(terms, filter).map((word, i) => {
      return <GlossaryItem classes={classes} word={word} key={word + i} />
    })
  }
  return (
    <>
      <main className="container pb-12 ">
        <div>
          <SearchBar setFilter={setFilter} filter={filter} />
          {items}
        </div>
      </main>
    </>
  )
}
