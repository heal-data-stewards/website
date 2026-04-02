import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material"
import Markdown from "../../elements/markdown"

export default function RichTextTable({ data }) {
  const { RepeatableRow } = data
  const [headerRow, ...bodyRows] = RepeatableRow

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
              {headerRow.RepeatableColumn.map((column) => (
                <TableCell
                  component="th"
                  align="left"
                  key={`header-column.id.${column.id}`}
                >
                  <Typography variant="h3">{column.CellContent}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {bodyRows.map((row) => (
              <TableRow key={`row.id.${row.id}`}>
                {row.RepeatableColumn.map((column) => (
                  <TableCell
                    align="left"
                    key={`row.id.${row.id}-column.id.${column.id}`}
                  >
                    <Markdown>{column.CellContent}</Markdown>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
