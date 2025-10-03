import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material"
import Markdown from "../elements/markdown"
import Link from "../elements/link"

export default function InfoTable({ data }) {
  const { TitleHeading, DescriptionHeading, TableRows } = data

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1250px",
        margin: "0 auto 3rem",
        padding: "0 1rem",
      }}
    >
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell component="th" scope="row">
                <Typography variant="h3">{TitleHeading}</Typography>
              </TableCell>
              <TableCell component="th" scope="row">
                <Typography variant="h3">{DescriptionHeading}</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {TableRows.map((row) => (
              <TableRow key={row.Title}>
                <TableCell component="th" scope="row">
                  {row.optionalLink ? (
                    <Link to={row.optionalLink}>
                      <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        {row.Title}
                      </Typography>
                    </Link>
                  ) : (
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 600 }}
                      color="primary"
                    >
                      {row.Title}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="left">
                  <Markdown>{row.Description}</Markdown>
                  {row.optionalLink && (
                    <Link to={row.optionalLink}>
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
