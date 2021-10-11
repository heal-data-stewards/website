import * as React from "react";
import List from "@mui/material/List";
import WorkingGroupListItem from "./list-item";

const dummyData = [
  { name: "Sergio Rocha" },
  { name: "Sergio Rocha" },
  { name: "Sergio Rocha" },
  { name: "Sergio Rocha" },
  { name: "Sergio Rocha" },
];

export default function WorkingGroupTable({ data }) {
  return (
    <nav aria-label="working group list">
      <List>
        {dummyData.map((member, index) => {
          return (
            <WorkingGroupListItem
              key={member.name + index}
              name={member.name}
            />
          );
        })}
      </List>
    </nav>
  );
}
