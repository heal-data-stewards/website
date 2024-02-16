import React from "react"
import { makeStyles } from "@mui/styles"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import Markdown from "../elements/markdown"
import Typography from "@mui/material/Typography"
import Link from "../elements/link"

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
                  {row.link ? (
                    <Link to={row.link}>
                      <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        {row.title}
                      </Typography>
                    </Link>
                  ) : (
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 600 }}
                      color="primary"
                    >
                      {row.title}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="left" className={classes.tableDescription}>
                  <Markdown>{row.description}</Markdown>
                  {row.link && (
                    <Link
                      to={row.link}
                      // style={{ color: "#0044B3" }}
                      // target={"_blank"}
                      // rel="noopener noreferrer"
                    >
                      <Typography variant="body2" sx={{ fontWeight: "500" }}>
                        Read More...
                      </Typography>
                    </Link>
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
