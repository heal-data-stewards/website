import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";

export default function WorkingGroupListItem(props) {
  return (
    <ListItem disablePadding>
      <ListItemButton>
        {/* <ListItemIcon>
          map different working group tags here
        </ListItemIcon> */}
        <ListItemText primary={props.name} />
      </ListItemButton>
    </ListItem>
  );
}
