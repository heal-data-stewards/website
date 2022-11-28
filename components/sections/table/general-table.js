import React from "react";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import Markdown from "react-markdown";

const columns = [
  { field: "id", hide: true, headerName: "ID", width: 10 },
  {
    field: "Repository",
    headerName: "Repository",
    headerClassName: "general-table-headers",
    sortable: false,
    filterable: false,
    width: 130,
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
  },
  {
    field: "Organism",
    headerName: "Organism",
    headerClassName: "general-table-headers",
    width: 120,
    sortable: false,
  },
  {
    field: "IC/Program Required",
    headerName: "IC/Program Required?",
    headerClassName: "general-table-headers",
    width: 210,
    sortable: false,
  },
  {
    field: "IC/Program",
    headerName: "IC/Program",
    headerClassName: "general-table-headers",
    width: 130,
    sortable: false,
  },
  {
    field: "Accepts data from any HEAL study",
    headerName: "Accepts data from any HEAL study",
    headerClassName: "general-table-headers",
    width: 290,
    sortable: false,
  },
  {
    field: "Overview",
    headerName: "Overview",
    headerClassName: "general-table-headers",
    width: 120,
    sortable: false,
    filterable: false,
    // eslint-disable-next-line react/display-name
    renderCell: ({ row }) => (
      <Markdown linkTarget="_blank" className="general-table">
        {row.Overview}
      </Markdown>
    ),
  },
];


function createData(id, data) {
  let row = { ...data };

  for (const property in row) {
    let index = Number(property) + 1;
    let newKey = columns[index].field;
    row[newKey] = row[property];
    delete row[property];
  }
  row["id"] = id;

  return row;
}

export default function GeneralDataTable(data) {
  let test = data.data.row.map((row, i) => {
    let bucket = row.columns.map((column, i) => {
      return column.column_data;
    });

    return createData(i, bucket);
  });

  console.log(data.data)
  return (
    <div style={{ height: 600 }} className={"container mb-8"}>
      <DataGrid
        rows={test}
        columns={columns}
        pageSize={26}
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );
}
