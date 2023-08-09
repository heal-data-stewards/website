import React, { useEffect, useState } from "react"
import List from "@mui/material/List"
import { getAllUsers } from "utils/api"
import PublicWorkingGroupListItem from "./list-item"

export default function Boardlist({ data }) {
  const [users, setUsers] = useState([])
  const [currentUsers, setCurrentUsers] = useState([])
  const [formerUsers, setFormerUsers] = useState([])
  // Call the strapi API to GET all users
  useEffect(() => {
    getAllUsers().then(function (result) {
      const users = result.filter(
        (user) => user.workgroup === "COLLECTIVE_BOARD"
      )
      setUsers(users.sort((a, b) => a.lastname.localeCompare(b.lastname)))
      let current = users.filter((user) => user.current === true)
      let former = users.filter((user) => user.current !== true)
      setCurrentUsers(current)
      setFormerUsers(former)
    })
  }, [])
  return (
    <div className="container">
      <nav aria-label="working group list">
        <h2 className="text-3xl font-bold pb-4 text-purple mb-8">
          {"Current"}
        </h2>
        <List className="flex flex-wrap">
          {currentUsers.map((member, index) => {
            return (
              <PublicWorkingGroupListItem
                key={member.firstname + index}
                name={member.firstname + " " + member.lastname}
                organization={member.organization}
                email={member.email}
                picture={member.picture}
                bio={member.bio}
                linkedin={member.linkedin}
                current={member.current}
              />
            )
          })}
        </List>
        <h2 className="text-3xl font-bold pb-4 text-purple mb-8">{"Former"}</h2>
        <List className="flex flex-wrap">
          {formerUsers.map((member, index) => {
            return (
              <PublicWorkingGroupListItem
                key={member.firstname + index}
                name={member.firstname + " " + member.lastname}
                organization={member.organization}
                email={member.email}
                picture={member.picture}
                bio={member.bio}
                linkedin={member.linkedin}
                current={member.current}
              />
            )
          })}
        </List>
      </nav>
    </div>
  )
}
