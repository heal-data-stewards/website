import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import Markdown from "../elements/markdown"
import Typography from "@mui/material/Typography"

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  tableCell: {
    fontWeight: "bold",
    fontSize: "22px",
    color: "#532565",
  },
  tableTitle: {
    color: "#a7417c",
    fontSize: "16px",
    fontWeight: "bold",
  },
  tableDescription: {
    fontSize: "16px",
  },
})

function createData(title, description, date, link) {
  return { title, description, date, link }
}

export default function BasicTable({ data }) {
  const classes = useStyles()

  const rows = data.table.rows.map((row, i) => {
    return createData(row.title, row.description, row.date, row.optionalLink)
  })

  return (
    <div
      style={{ width: "100%", marginBottom: "3rem" }}
      className={"container"}
    >
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {data.table.headers.map((row, i) => (
                <TableCell
                  component="th"
                  scope="row"
                  className={classes.tableCell}
                  key={i + row}
                >
                  <Typography variant="h3">{row}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.title}>
                <TableCell
                  component="th"
                  scope="row"
                  className={classes.tableTitle}
                >
                  <a target="_blank" rel="noopener noreferrer" href={row.link}>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {row.title}
                    </Typography>
                  </a>
                </TableCell>
                <TableCell align="left" className={classes.tableDescription}>
                  <Markdown>{row.description}</Markdown>
                  {row.link && (
                    <a
                      href={row.link}
                      style={{ color: "#0044B3" }}
                      target={"_blank"}
                      rel="noopener noreferrer"
                    >
                      <Typography variant="body1" sx={{pt: '1rem'}}>Read More...</Typography>
                    </a>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
