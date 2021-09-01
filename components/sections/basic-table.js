import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"

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

function createData(title, description, date) {
  return { title, description, date }
}

export default function BasicTable({ data }) {
  const classes = useStyles()

  const rows = data.table.rows.map((row, i) => {
    return createData(row.title, row.description, row.date)
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
                  {row}
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
                  {row.title}
                </TableCell>
                <TableCell align="right" className={classes.tableDescription}>
                  {row.description}
                </TableCell>
                <TableCell align="right" className={classes.tableTitle}>
                  {row.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
