import React, { useState } from "react"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import SearchBar from "../elements/search-bar"
import Divider from "@mui/material/Divider"

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
              <h3 className="pt-4" style={{fontWeight: "100"}}>
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
          <div className={classes.root} key={word + i}>
              <Typography
                variant="h5"
                component="h2"
                className="text-magenta capitalize"
                style={{ fontWeight: "600" }}
              >
                {word.title}
              </Typography>
              <Typography
                className={classes.pos}
                color="textSecondary"
              ></Typography>
              <Typography variant="body2" component="p">
                {word.body}
                {/* <br />
                        {'"a benevolent smile"'} */}
              </Typography>
          </div>
        </>
      )
    })
  }
  return (
    <main className="container pb-12 ">
      <div>
        <SearchBar setFilter={setFilter} filter={filter} />
        {items}
      </div>
    </main>
  )
}
