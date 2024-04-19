import React, { useState, useEffect } from "react"
import { Box } from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import RenderExpandableCell from "./render-expandable-cell"
import Markdown from "../../elements/markdown"

const columns = [
  { field: "id", hide: true, headerName: "ID", width: 10 },
  {
    field: "Repository",
    headerName: "Repository",
    headerClassName: "general-table-headers",
    sortable: false,
    filterable: false,
    width: 300,
    // eslint-disable-next-line react/display-name
    renderCell: ({ row }) => (
      <Markdown linkTarget="_blank" className="general-table">
        {row.Repository}
      </Markdown>
    ),
  },
  {
    field: "Descriptive Tags",
    headerName: "Descriptive Tags",
    headerClassName: "general-table-headers",
    width: 170,
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
    headerClassName: "general-table-headers",
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
    headerClassName: "general-table-headers",
    width: 130,
    sortable: false,
    // eslint-disable-next-line react/display-name
    renderCell: ({ row }) => (
      <RenderExpandableCell linkTarget="_blank" className="general-table">
        {row["IC/Program"]}
      </RenderExpandableCell>
    ),
  },
  {
    field: "Get Started Here",
    headerName: "Get Started Here",
    headerClassName: "general-table-headers",
    width: 300,
    sortable: true,
    // eslint-disable-next-line react/display-name
    renderCell: ({ row }) => (
      <Markdown linkTarget="_blank" className="general-table">
        {row["Get Started Here"]}
      </Markdown>
    ),
  },
  {
    field: "Overview",
    headerName: "Overview",
    headerClassName: "general-table-headers",
    width: 155,
    sortable: false,
    filterable: false,
    // eslint-disable-next-line react/display-name
    renderCell: ({ row }) => (
      <Markdown linkTarget="_blank" className="general-table">
        {row.Overview}
      </Markdown>
    ),
  },
]

function createData(id, data) {
  let row = { ...data }

  for (const property in row) {
    let index = Number(property) + 1
    let newKey = columns[index].field
    row[newKey] = row[property]
    delete row[property]
  }
  row.id = id

  return row
}

export default function GeneralDataTable(data) {
  const [param, setParam] = useState(false)
  const [paramValue, setParamValue] = useState(false)

  let rows = data.data.row.map((row, i) => {
    let bucket = row.columns.map((column, i) => {
      return column.column_data
    })

    return createData(i, bucket)
  })

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
