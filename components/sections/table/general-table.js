import React, { useState, useEffect } from "react"
// import { GridToolbar } from "@material-ui/data-grid"
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
  row["id"] = id

  return row
}

export default function GeneralDataTable(data) {
  const [param, setParam] = useState(false)
  const [paramValue, setParamValue] = useState(false)
  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search)

    for (const [key, value] of queryParameters.entries()) {
      setParam(key)
      setParamValue(value)
    }
  }, [])

  let test = data.data.row.map((row, i) => {
    let bucket = row.columns.map((column, i) => {
      return column.column_data
    })

    return createData(i, bucket)
  })

  return (
    <div style={{ height: 600 }} className={"container mb-8"}>
      {!paramValue ? (
        <DataGrid
          rows={test}
          columns={columns}
          // enableRowSelection //enable some features
          enableColumnOrdering
          enableGlobalFilter={true} //turn off a feature
          // pageSize={26}
          // components={{
          //   Toolbar: GridToolbar,
          // }}
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

// import React, { useState, useEffect, useMemo } from "react"
// import RenderExpandableCell from "./render-expandable-cell"
// import Markdown from "../../elements/markdown"
// import { MaterialReactTable } from "material-react-table"

// export default function GeneralDataTable(data) {
//   const [param, setParam] = useState(false)
//   const [paramValue, setParamValue] = useState(false)

//   useEffect(() => {
//     const queryParameters = new URLSearchParams(window.location.search)

//     for (const [key, value] of queryParameters.entries()) {
//       setParam(key)
//       setParamValue(value)
//     }
//   }, [])

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: "Repository",
//         header: "Repository",
//         /* eslint-disable react/display-name */
//         Cell: ({ cell }) => {
//           return (
//             <Markdown linkTarget="_blank" className="general-table">
//               {cell.getValue()}
//             </Markdown>
//           )
//         },
//       },
//       {
//         accessorKey: "Descriptive Tags",
//         header: "Descriptive Tags",
//         /* eslint-disable react/display-name */
//         Cell: ({ cell }) => {
//           return (
//             <RenderExpandableCell linkTarget="_blank" className="general-table">
//               {cell.getValue()}
//             </RenderExpandableCell>
//           )
//         },
//       },
//       {
//         accessorKey: "Organism",
//         header: "Organism",
//         /* eslint-disable react/display-name */
//         Cell: ({ cell }) => {
//           return (
//             <RenderExpandableCell linkTarget="_blank" className="general-table">
//               {cell.getValue()}
//             </RenderExpandableCell>
//           )
//         },
//       },
//       {
//         accessorKey: "IC/Program",
//         header: "IC/Program",
//         /* eslint-disable react/display-name */
//         Cell: ({ cell }) => {
//           return (
//             <RenderExpandableCell linkTarget="_blank" className="general-table">
//               {cell.getValue()}
//             </RenderExpandableCell>
//           )
//         },
//       },
//       {
//         accessorKey: "Get Started Here",
//         header: "Get Started Here",
//         /* eslint-disable react/display-name */
//         Cell: ({ cell }) => {
//           return (
//             <Markdown linkTarget="_blank" className="general-table">
//               {cell.getValue()}
//             </Markdown>
//           )
//         },
//       },
//       {
//         accessorKey: "Overview",
//         header: "Overview",
//         /* eslint-disable react/display-name */
//         Cell: ({ cell }) => {
//           return (
//             <Markdown linkTarget="_blank" className="general-table">
//               {cell.getValue()}
//             </Markdown>
//           )
//         },
//       },
//     ],
//     []
//   )

//   function createData(id, data) {
//     let row = { ...data }

//     for (const property in row) {
//       let index = Number(property)
//       let newKey = columns[index].header
//       row[newKey] = row[property]
//       delete row[property]
//     }

//     return row
//   }

//   let test = data.data.row.map((row, i) => {
//     let bucket = row.columns.map((column, i) => {
//       return column.column_data
//     })

//     return createData(i, bucket)
//   })

//   return (
//     <div
//       style={{ height: 600, marginBottom: "520px" }}
//       className={"container mb-8"}
//     >
//       {!paramValue ? (
//         <MaterialReactTable
//           data={test}
//           columns={columns}
//           enableRowSelection //enable some features
//           enableColumnOrdering
//           enableGlobalFilter={true} //turn off a feature
//           // pageSize={26}
//           // components={{
//           //   Toolbar: GridToolbar,
//           // }}
//         />
//       ) : (
//         <MaterialReactTable
//           data={test}
//           columns={columns}
//           enableRowSelection //enable some features
//           enableColumnOrdering
//           enableGlobalFilter={true} //turn off a feature
//           // pageSize={26}
//           // components={{
//           //   Toolbar: GridToolbar,
//           // }}
//           // filterModel={{
//           //   items: [
//           //     {
//           //       columnField: param,
//           //       operatorValue: "contains",
//           //       value: paramValue,
//           //     },
//           //   ],
//           // }}
//         />
//       )}
//     </div>
//   )
// }
