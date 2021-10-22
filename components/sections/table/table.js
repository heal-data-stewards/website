import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import WorkingGroupListItem from "./list-item";
import { getAllUsers } from "utils/api";
import Button from "@mui/material/Button";

export default function WorkingGroupTable({ data }) {
  const [users, setUsers] = useState([]);
  // Call the strapi API to GET all users
  useEffect(() => {
    getAllUsers().then(function (result) {
      const users = result.filter(
        (user) => user.workgroup === data.title.workinggroup
      );
      setUsers(users);
    });
  }, [data.title.workinggroup]);

  const mailTo = users
    .map((user) => {
      return user.username + ";";
    })
    .join();

  return (
    <div className="container">
      <section
        style={{
          boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
          margin: "0 0 55px 0",
        }}
      >
        <h1
          className="text-3xl text-purple text-center p-3"
          style={{ background: "#e5e0e7" }}
        >
          Chair
        </h1>
      </section>
      <section
        style={{
          boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
          margin: "0 0 15px 0",
        }}
      >
        <h1
          className="text-3xl text-purple text-center p-3"
          style={{ background: "#e5e0e7" }}
        >
          {data.title.title}
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
              />
            );
          })}
        </List>
      </nav>
      <section className="mb-8 mt-8">
        <p className="pr-3 pb-3">
          To copy a list of email addresses for all collaboration group members,
          right click the 'EMAILS' button and select 'Copy Email Address' from
          the menu.
        </p>
        <Button variant="contained" href={`mailto:${mailTo}`}>
          Emails
        </Button>
      </section>
      <section
        style={{
          boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
          margin: "0 0 55px 0",
        }}
      >
        <h1
          className="text-3xl text-purple text-center p-3"
          style={{ background: "#e5e0e7" }}
        >
          Resources
        </h1>
      </section>
    </div>
  );
}
