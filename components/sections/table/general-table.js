import React, { useEffect, useState } from "react"
import { Box, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import RenderExpandableCell from "./render-expandable-cell"
import Markdown from "../../elements/markdown"

// Column Definitions
const columns = [
  { field: "id", headerName: "ID", width: 10 },
  {
    field: "Repository",
    headerName: "Repository",
    headerClassName: "general-table-header",
    sortable: false,
    filterable: false,
    width: 350,

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

const staticColumns = [
  { field: "Repository", headerName: "Repository" },
  { field: "Descriptive Tags", headerName: "Descriptive Tags" },
  { field: "Organism", headerName: "Organism" },
  { field: "IC/Program", headerName: "IC/Program" },
]

function StaticTable({ rows }) {
  return (
    <Box className="container" sx={{ height: 600, overflowY: "auto" }}>
      <table className="general-table w-full text-left border-collapse">
        <thead>
          <tr>
            {staticColumns.map((col) => (
              <th
                key={col.field}
                className="general-table-header border-b p-2 align-top"
              >
                {col.headerName}
              </th>
            ))}
            <th className="general-table-header border-b p-2 align-top">
              Links
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {staticColumns.map((col) => (
                <td key={col.field} className="border-b p-2 align-top">
                  <Markdown linkTarget="_blank" className="general-table">
                    {row[col.field]}
                  </Markdown>
                  {row[`${col.field} Footnote`] && (
                    <sup>{row[`${col.field} Footnote`]}</sup>
                  )}
                </td>
              ))}
              <td className="border-b p-2 align-top">
                <Markdown linkTarget="_blank">
                  {row["Get Started Here"]}
                </Markdown>
                {row["Overview"] && (
                  <Markdown linkTarget="_blank">{row["Overview"]}</Markdown>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  )
}

export default function GeneralDataTable({ data }) {
  const rows = data.row.map((row) => createData(row.id, row.columns))

  // Render the static table on the server and for the first client frame so
  // the content lives in the HTML source. Once the component is mounted, the
  // interactive DataGrid is rendered.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return <StaticTable rows={rows} />

  return (
    <Box className="container" sx={{ height: 600 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          columns: { columnVisibilityModel: { id: false } },
        }}
      />
    </Box>
  )
}
