import React, { useEffect, useState } from "react"
import List from "@mui/material/List"
import { getAllUsers } from "utils/api"
// import Button from "@mui/material/Button"
import PublicWorkingGroupListItem from "./list-item"

export default function Boardlist({ data }) {
  const [users, setUsers] = useState([])
  // Call the strapi API to GET all users
  useEffect(() => {
    getAllUsers().then(function (result) {
      const users = result.filter(
        (user) => user.workgroup === "COLLECTIVE_BOARD"
      )
      setUsers(users.sort((a, b) => a.lastname.localeCompare(b.lastname)))
    })
  }, [])
  return (
    <div className="container">
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
                bio={member.bio}
                linkedin={member.linkedin}
              />
            )
          })}
        </List>
      </nav>
    </div>
  )
}
