import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

export default function WorkingGroupListItem({name, organization}) {
  return (
    <ListItem sx={{ width: "33.3%", padding: "8px 0"}} >
      <ListItemButton>
        <ListItemText primary={name} sx={{ color: "#532565"}} />
        <ListItemText secondary={organization} sx={{ color: "#532565"}} />
      </ListItemButton>
    </ListItem>
  );
}
