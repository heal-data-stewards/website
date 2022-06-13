import React from "react"
import { DataGrid, GridToolbar } from "@material-ui/data-grid"
import Markdown from "react-markdown"

const columns = [
  { field: "id", hide: true, headerName: "ID", width: 10 },
  {
    field: "Repository",
    headerName: "Repository",
    sortable: false,
    filterable: false,
    width: 150,
    // eslint-disable-next-line react/display-name
    renderCell: ({ row }) => (
      <Markdown linkTarget="_blank">{row.Repository}</Markdown>
    ),
  },
  {
    field: "Repository Type",
    headerName: "Repository Type",
    width: 200,
    sortable: false,
  },
  { field: "Organism", headerName: "Organism", width: 150, sortable: false },
  {
    field: "IC/Program",
    headerName: "IC/Program",
    width: 150,
    sortable: false,
  },
  {
    field: "Overview",
    headerName: "Overview",
    width: 150,
    sortable: false,
    filterable: false,
    // eslint-disable-next-line react/display-name
    renderCell: ({ row }) => (
      <Markdown linkTarget="_blank">{row.Overview}</Markdown>
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
  row["id"] = id

  return row
}

export default function GeneralDataTable(data) {
  let test = data.data.row.map((row, i) => {
    let bucket = row.columns.map((column, i) => {
      return column.column_data
    })

    return createData(i, bucket)
  })
  return (
    <div style={{ height: 600 }} className={"container mb-8"}>
      <DataGrid
        // disableColumnFilter
        rows={test}
        columns={columns}
        pageSize={25}
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  )
}
