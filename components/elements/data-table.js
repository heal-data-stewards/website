import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import { getAllUsers } from "utils/api";
import { styled } from "@material-ui/core/styles";

const TestComponent = styled(GridToolbar)({
  background: "#c0b3c569",
});

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstname", headerName: "First Name", width: 150 },
  { field: "lastname", headerName: "Last Name", width: 150 },
  {
    field: "username",
    headerName: "User Name",
    width: 150,
  },
  {
    field: "email",
    headerName: "Email",
    width: 150,
  },
  {
    field: "org",
    headerName: "Organization",
    width: 150,
  },
];
function createData(id, firstname, lastname, username, email, org) {
  return { id, firstname, lastname, username, email, org };
}

export default function DataTable() {
  const [users, setUsers] = useState([]);
  // Call the strapi API to GET all users
  useEffect(() => {
    getAllUsers()
      .then(function (result) {
        return result.map((user) => {
          return createData(
            user.id,
            user.firstname,
            user.lastname,
            user.username,
            user.email,
            user.organization
          );
        });
      })
      .then((result) => {
        setUsers(result);
      });
  }, []);
  return (
    <div
      style={{ height: 400, width: "100%" }}
      className={"container mt-10 mb-8"}
    >
      <DataGrid
        rows={users}
        columns={columns}
        pageSize={5}
        checkboxSelection
        components={{
          Toolbar: TestComponent,
        }}
      />
    </div>
  );
}
