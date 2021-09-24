import React, { useState } from "react"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import SearchBar from "../elements/search-bar"

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
          <Card className={classes.root} key={word + i}>
            <CardContent>
              {/* <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Related Categories?
                </Typography> */}
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
            </CardContent>
            {/* <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions> */}
          </Card>
        </>
      )
    })
  } else {
    items = filterByValue(data.term, filter).map((word, i) => {
      return (
        <>
          <Card className={classes.root} key={word + i}>
            <CardContent>
              {/* <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Related Categories?
                    </Typography> */}
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
            </CardContent>
            {/* <CardActions>
                    <Button size="small">Learn More</Button>
                </CardActions> */}
          </Card>
        </>
      )
    })
  }
  return (
    <main className="container py-12">
      <section className="pb-8">
        <h1 className="text-5xl font-black pb-8 text-gray-dark">
          {data.title}
        </h1>
        <p className="text-xl text-gray">{data.pagetext}</p>
      </section>
      <Paper elevation={2}>
        <SearchBar setFilter={setFilter} filter={filter} />
        {items}
      </Paper>
    </main>
  )
}
