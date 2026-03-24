import React, { useEffect, useState } from "react"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { getAllUsers } from "utils/api"

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstname", headerName: "First Name", width: 150 },
  { field: "lastname", headerName: "Last Name", width: 150 },
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
  {
    field: "role",
    headerName: "Role",
    width: 150,
  },
  {
    field: "programarea",
    headerName: "Program Area",
    width: 150,
  },
  {
    field: "roleInProgramArea",
    headerName: "Role in Program Area",
    width: 150,
  },
]
function createData(
  id,
  firstname,
  lastname,
  email,
  org,
  RoleInHeal,
  programarea,
  roleInProgramArea
) {
  let role = RoleInHeal ? RoleInHeal.split("_").join(" ") : "N/A"

  return {
    id,
    firstname,
    lastname,
    email,
    org,
    role,
    programarea,
    roleInProgramArea,
  }
}

export default function DataTable() {
  const [users, setUsers] = useState([])
  // const classes = useStyles()
  // Call the strapi API to GET all users
  useEffect(() => {
    getAllUsers()
      .then(function (result) {
        const users = result.filter((user) => user.confirmed === true)

        return users.map((user) => {
          return createData(
            user.id,
            user.firstname,
            user.lastname,
            user.email,
            user.organization,
            user.RoleInHeal,
            user.programarea,
            user.roleInProgramArea
          )
        })
      })
      .then((result) => {
        setUsers(result)
      })
  }, [])
  return (
    <div style={{ height: 600, width: "100%" }} className={"container mb-8"}>
      <DataGrid
        // className={classes.table}
        rows={users}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
          columns: { columnVisibilityModel: { id: false } },
        }}
        checkboxSelection
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </div>
  )
}
