import React, { useState, useEffect } from "react"
import { DataGrid, GridToolbar } from "@material-ui/data-grid"
// import RenderExpandableCell from "./render-expandable-cell"
import Markdown from "../../elements/markdown"
const columns = [
  { field: "id", hide: true, headerName: "ID", width: 10 },
  {
    field: "Repository",
    headerName: "Repository",
    headerClassName: "general-table-headers",
    sortable: false,
    filterable: false,
    width: 150,
    // eslint-disable-next-line react/display-name
    renderCell: ({ row }) => (
      <Markdown linkTarget="_blank" className="general-table">
        {row["Repository"]}
      </Markdown>
    ),
  },
  {
    field: "De-identification Method",
    headerName: "De-identification Method",
    headerClassName: "general-table-headers",
    width: 270,
    sortable: false,
    cellClass: "overflow",
    // eslint-disable-next-line react/display-name
    renderCell: ({ row }) => (
        <Markdown linkTarget="_blank" className="general-table">
          {row["De-identification Method"]}
        </Markdown>
      ),
  },
  {
    field: "De-ID Documentation",
    headerName: "De-ID Documentation",
    headerClassName: "general-table-headers",
    width: 200,
    sortable: false,
    // eslint-disable-next-line react/display-name
    renderCell: ({ row }) => (
        <Markdown linkTarget="_blank" className="general-table">
          {row["De-ID Documentation"]}
        </Markdown>
      ),
  },
  {
    field: "De-ID Verification",
    headerName: "De-ID Verification",
    headerClassName: "general-table-headers",
    width: 150,
    sortable: true,
    // eslint-disable-next-line react/display-name
    renderCell: ({ row }) => (
      <Markdown linkTarget="_blank" className="general-table">
        {row["De-ID Verification"]}
      </Markdown>
    ),
  },
  {
    field: "De-ID Assistance",
    headerName: "De-ID Assistance",
    headerClassName: "general-table-headers",
    width: 150,
    sortable: true,
    // eslint-disable-next-line react/display-name
    renderCell: ({ row }) => (
      <Markdown linkTarget="_blank" className="general-table">
        {row["De-ID Assistance"]}
      </Markdown>
    ),
  },
  {
    field: "Special Notes",
    headerName: "Special Notes",
    headerClassName: "general-table-headers",
    width: 155,
    sortable: false,
    filterable: false,
    // eslint-disable-next-line react/display-name
    renderCell: ({ row }) => (
      <Markdown linkTarget="_blank" className="general-table">
        {row["Special Notes"]}
      </Markdown>
    ),
  },
  {
    field: "References",
    headerName: "References",
    headerClassName: "general-table-headers",
    width: 355,
    sortable: false,
    filterable: false,
    // eslint-disable-next-line react/display-name
    renderCell: ({ row }) => (
      <Markdown linkTarget="_blank" className="general-table">
        {row["References"]}
      </Markdown>
    ),
  },
]

function createData(id, data) {
  let row = { ...data }
  
  for (const property in row) {
    console.log(row[property])
    let index = Number(property) + 1
    let newKey = columns[index].field
    row[newKey] = row[property].di_page_data
    delete row[property]
  }
  row["id"] = id

  return row
}

export default function DiTable(data) {
  const [param, setParam] = useState(false)
  const [paramValue, setParamValue] = useState(false)
  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search)

    for (const [key, value] of queryParameters.entries()) {
      setParam(key)
      setParamValue(value)
    }
  }, [])

  let test = data.data.di_page_table_row.map((row, i) => {
    let bucket = row.di_page_column_row.map((column, i) => {
      return column
    })

    return createData(i, bucket)
  })

  return (
    <div style={{ height: 600 }} className={"container mb-8"}>
      {!paramValue ? (
        <DataGrid
          rows={test}
          columns={columns}
          pageSize={26}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      ) : (
        <DataGrid
          rows={test}
          columns={columns}
          pageSize={26}
          components={{
            Toolbar: GridToolbar,
          }}
          filterModel={{
            items: [
              {
                columnField: param,
                operatorValue: "contains",
                value: paramValue,
              },
            ],
          }}
        />
      )}
    </div>
  )
}
