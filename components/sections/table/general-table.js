import React from "react"
import { Box, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import RenderExpandableCell from "./render-expandable-cell"
import Markdown from "../../elements/markdown"

// Column Definitions
const columns = [
  { field: "id", hide: true, headerName: "ID", width: 10 },
  {
    field: "Repository",
    headerName: "Repository",
    headerClassName: "general-table-header",
    sortable: false,
    filterable: false,
    width: 350,
    // eslint-disable-next-line react/display-name
    renderCell: ({ row }) => (
      <Box
        sx={{
          whiteSpace: "normal",
          wordWrap: "break-word",
          overflow: "visible",
        }}
      >
        <Markdown linkTarget="_blank" className="general-table">
          {row.Repository}
        </Markdown>
      </Box>
    ),
  },
  {
    field: "Descriptive Tags",
    headerName: "Descriptive Tags",
    headerClassName: "general-table-header",
    width: 275,
    sortable: false,
    cellClass: "overflow",
    // eslint-disable-next-line react/display-name
    renderCell: ({ row }) => (
      <RenderExpandableCell linkTarget="_blank" className="general-table">
        {row["Descriptive Tags"]}
      </RenderExpandableCell>
    ),
  },
  {
    field: "Organism",
    headerName: "Organism",
    headerClassName: "general-table-header",
    width: 118,
    sortable: false,
    // eslint-disable-next-line react/display-name
    renderCell: ({ row }) => (
      <RenderExpandableCell linkTarget="_blank" className="general-table">
        {row["Organism"]}
      </RenderExpandableCell>
    ),
  },
  {
    field: "IC/Program",
    headerName: "IC/Program",
    headerClassName: "general-table-header",
    width: 160,
    sortable: false,
    // eslint-disable-next-line react/display-name
    renderCell: ({ row }) => (
      <RenderExpandableCell linkTarget="_blank" className="general-table">
        {row["IC/Program"]}
        {row[`IC/Program Footnote`] && <sup>{row[`IC/Program Footnote`]}</sup>}
      </RenderExpandableCell>
    ),
  },
  {
    field: "Links",
    headerName: "Links",
    headerClassName: "general-table-header",
    width: 260,
    sortable: true,
    renderCell: ({ row }) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          whiteSpace: "nowrap",
          overflow: "visible",
          "& .MuiTypography-body1": {
            display: "inline",
            margin: 0,
            whiteSpace: "normal",
            fontSize: "0.95rem !important",
          },
        }}
      >
        <Markdown linkTarget="_blank">{row["Get Started Here"]}</Markdown>
        {row[`Get Started Here Footnote`] && (
          <sup>{row[`Get Started Here Footnote`]}</sup>
        )}
        {row["Overview"] && (
          <>
            <Typography variant="body1">&nbsp;|&nbsp;</Typography>
            <Markdown linkTarget="_blank">{row["Overview"]}</Markdown>
          </>
        )}
      </Box>
    ),
  },
]

// Field-to-Column Mapping
const columnFieldOrder = [
  "Repository",
  "Descriptive Tags",
  "Organism",
  "IC/Program",
  "Get Started Here",
  "Overview",
]

function createData(id, columnsArray) {
  const row = { id }

  columnsArray.forEach((column, index) => {
    const fieldName = columnFieldOrder[index]
    if (fieldName) {
      row[fieldName] = column.column_data
      if (column.footnote) {
        row[`${fieldName} Footnote`] = column.footnote
      }
    }
  })

  return row
}

export default function GeneralDataTable({ data }) {
  const rows = data.row.map((row) => createData(row.id, row.columns))

  return (
    <Box className="container" sx={{ height: 600 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        enableColumnOrdering
        enableGlobalFilter={true}
      />
    </Box>
  )
}
