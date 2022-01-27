import React, { useEffect, useState } from "react"
import List from "@mui/material/List"
import WorkingGroupListItem from "../table/list-item"
import { getAllUsers } from "utils/api"
import Button from "@mui/material/Button"
import PublicWorkingGroupListItem from "./list-item"

export default function Boardlist({ data }) {
  const [users, setUsers] = useState([])
  // Call the strapi API to GET all users
  useEffect(() => {
    getAllUsers().then(function (result) {
      const users = result.filter(
        (user) => user.workgroup === "COLLECTIVE_BOARD"
      )
      setUsers(users)
    })
  }, [])

  const mailTo = users
    .map((user) => {
      return user.username + ";"
    })
    .join()

  return (
    <div className="container">
      {/* <section>
        <h1 className="text-2xl text-purple p-2" style={{ fontWeight: "600" }}>
          Co-PIs
        </h1>
      </section> */}
      <nav aria-label="working group list">
        <List className="flex flex-wrap">
          {users.map((member, index) => {
            return (
              <PublicWorkingGroupListItem
                key={member.firstname + index}
                name={member.firstname + " " + member.lastname}
                organization={member.organization}
                email={member.email}
                picture={member.picture}
              />
            )
          })}
        </List>
      </nav>
    </div>
  )
}
