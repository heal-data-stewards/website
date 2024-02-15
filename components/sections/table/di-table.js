import React, { useState, useEffect } from "react"
// import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import Markdown from "../../elements/markdown"
import { MaterialReactTable } from "material-react-table"
const columns = [
  {
    accessorKey: "Repository",
    header: "Repository",
    // eslint-disable-next-line react/display-name
    Cell: ({ cell }) => {
      return (
        <Markdown linkTarget="_blank" className="general-table">
          {cell.getValue()}
        </Markdown>
      )
    },
  },
  {
    accessorKey: "De-identification Method",
    header: "De-identification Method",
    // eslint-disable-next-line react/display-name
    Cell: ({ cell }) => {
      return (
        <Markdown linkTarget="_blank" className="general-table">
          {cell.getValue()}
        </Markdown>
      )
    },
  },
  {
    accessorKey: "De-ID Documentation",
    header: "De-ID Documentation",
    // eslint-disable-next-line react/display-name
    Cell: ({ cell }) => {
      return (
        <Markdown linkTarget="_blank" className="general-table">
          {cell.getValue()}
        </Markdown>
      )
    },
  },
  {
    accessorKey: "De-ID Verification",
    header: "De-ID Verification",
    // eslint-disable-next-line react/display-name
    Cell: ({ cell }) => {
      return (
        <Markdown linkTarget="_blank" className="general-table">
          {cell.getValue()}
        </Markdown>
      )
    },
  },
  {
    accessorKey: "De-ID Assistance",
    header: "De-ID Assistance",
    // eslint-disable-next-line react/display-name
    Cell: ({ cell }) => {
      return (
        <Markdown linkTarget="_blank" className="general-table">
          {cell.getValue()}
        </Markdown>
      )
    },
  },
  {
    accessorKey: "Special Notes",
    header: "Special Notes",
    // eslint-disable-next-line react/display-name
    Cell: ({ cell }) => {
      return (
        <Markdown linkTarget="_blank" className="general-table">
          {cell.getValue()}
        </Markdown>
      )
    },
  },
  {
    accessorKey: "References",
    header: "References",
    // eslint-disable-next-line react/display-name
    Cell: ({ cell }) => {
      return (
        <Markdown linkTarget="_blank" className="general-table">
          {cell.getValue()}
        </Markdown>
      )
    },
  },
]

function createData(id, data) {
  let row = { ...data }

  for (const property in row) {
    // let index = Number(property) + 1
    let newKey = columns[Number(property)].header
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
        <MaterialReactTable
          data={test}
          columns={columns}
          // enableRowSelection //enable some features
          enableColumnOrdering
          enableGlobalFilter={true} //turn off a feature
        />
      ) : (
        <MaterialReactTable
          data={test}
          columns={columns}
          //   enableRowSelection //enable some features
          enableColumnOrdering
          enableGlobalFilter={true} //turn off a feature
        />
      )}
    </div>
  )
}
