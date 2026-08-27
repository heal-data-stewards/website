import React, { useEffect, useState } from "react"
import List from "@mui/material/List"
import { getAllUsers } from "utils/api"
import PublicWorkingGroupListItem from "./list-item"
import Typography from "@mui/material/Typography"

function partitionBoardUsers(result) {
  const users = (result || [])
    .filter((user) => user.workgroup === "COLLECTIVE_BOARD")
    .sort((a, b) => a.lastname.localeCompare(b.lastname))
  return {
    currentUsers: users.filter((user) => user.current === true),
    formerUsers: users.filter((user) => user.current !== true),
  }
}

export default function Boardlist({ data }) {
  const initial = partitionBoardUsers(data?.boardUsers)
  const [currentUsers, setCurrentUsers] = useState(initial.currentUsers)
  const [formerUsers, setFormerUsers] = useState(initial.formerUsers)

  // Fall back to a client-side fetch only if no build-time data was provided.
  useEffect(() => {
    if (data?.boardUsers) return
    getAllUsers().then(function (result) {
      const { currentUsers, formerUsers } = partitionBoardUsers(result)
      setCurrentUsers(currentUsers)
      setFormerUsers(formerUsers)
    })
  }, [data?.boardUsers])
  return (
    <div className="container">
      <nav aria-label="working group list">
        <Typography
          variant="h2"
          color="primary"
          gutterBottom
          sx={{ fontWeight: "700" }}
        >
          {"Current"}
        </Typography>
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
        <Typography
          variant="h2"
          color="primary"
          gutterBottom
          sx={{ fontWeight: "600" }}
        >
          {"Former"}
        </Typography>
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
