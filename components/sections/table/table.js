import React, { useEffect, useState } from "react"
import List from "@mui/material/List"
import WorkingGroupListItem from "./list-item"
import { getAllUsers } from "utils/api"
import Button from "@mui/material/Button"
import { useSession, getSession } from "next-auth/client"

export default function WorkingGroupTable({ data }) {
  const [session, loading] = useSession()
  const [users, setUsers] = useState([])
  // Call the strapi API to GET all users
  useEffect(() => {
    if (session) {
      getAllUsers().then(function (result) {
        const users = result.filter(
          (user) => user.workgroup === data.title.workinggroup
        )
        setUsers(users)
      })
    }
  }, [data.title.workinggroup, session])

  const mailTo = users
    .map((user) => {
      return user.username + ";"
    })
    .join()

  return (
    <div className="container">
      <section>
        <h1 className="text-2xl text-purple p-2" style={{ fontWeight: "600" }}>
          Members
        </h1>
      </section>
      <nav aria-label="working group list">
        <List className="flex flex-wrap">
          {users.map((member, index) => {
            return (
              <WorkingGroupListItem
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
      <section className="mb-8 mt-8">
        <p className="pr-3 pb-3">
          To copy a list of email addresses for all collaboration group members,
          right click the &apos;EMAILS&apos; button and select &apos;Copy Email
          Address&apos; from the menu.
        </p>
        <Button variant="contained" href={`mailto:${mailTo}`}>
          Emails
        </Button>
      </section>
      <section
        style={{
          margin: "0 0 25px 0",
        }}
      >
        <h1
          className="text-3xl text-purple p-3"
          style={{ background: "#e5e0e7", fontWeight: "600" }}
        >
          Resources
        </h1>
      </section>
    </div>
  )
}
