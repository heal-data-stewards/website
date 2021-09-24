import React, { useEffect, useState } from "react"
import { DataGrid, GridToolbar } from "@material-ui/data-grid"
import { getAllUsers } from "utils/api"
import { styled } from "@material-ui/core/styles"
import { makeStyles } from "@material-ui/core/styles"
const useStyles = makeStyles({
  table: {
    background: "#fff",
  },
})
const TestComponent = styled(GridToolbar)({
  background: "#c0b3c569",
})

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
]
function createData(id, firstname, lastname, username, email, org) {
  return { id, firstname, lastname, username, email, org }
}

export default function DataTable() {
  const [users, setUsers] = useState([])
  const classes = useStyles()
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
            user.username,
            user.email,
            user.organization
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
        className={classes.table}
        rows={users}
        columns={columns}
        pageSize={25}
        checkboxSelection
        components={{
          Toolbar: TestComponent,
        }}
      />
    </div>
  )
}
