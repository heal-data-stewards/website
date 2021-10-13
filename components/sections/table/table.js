import * as React from "react";
import List from "@mui/material/List";
import WorkingGroupListItem from "./list-item";

const dummyData = [
  { name: "Sergio Rocha", organization: "renci" },
  { name: "Sergio Rocha", organization: "renci"  },
  { name: "Sergio Rocha", organization: "renci"  },
  { name: "Sergio Rocha", organization: "renci"  },
  { name: "Sergio Rocha", organization: "renci"  },
];

export default function WorkingGroupTable({ data }) {
  console.log(data);
  return (
    <div className="container">
      <nav aria-label="working group list">
        <List className="flex flex-wrap">
          {dummyData.map((member, index) => {
            return (
              <WorkingGroupListItem
                key={member.name + index}
                name={member.name}
                organization={member.organization}
              />
            );
          })}
        </List>
      </nav>
    </div>
  );
}
