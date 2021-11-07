import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Chip from "@mui/material/Chip";

export default function WorkingGroupListItem({ name, organization }) {
  return (
    <ListItem sx={{ width: "50%", padding: "10px 0" }}>
      <ListItemButton>
        <h2
          style={{
            color: "#982568",
            padding: "0 16px",
            textTransform: "capitalize",
            fontWeight: "600",
          }}
        >
          {name}
        </h2>
        <Chip label={organization} />
      </ListItemButton>
    </ListItem>
  );
}
