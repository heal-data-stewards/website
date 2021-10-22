import * as React from "react"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemButton from "@mui/material/ListItemButton"
import Chip from "@mui/material/Chip"

export default function WorkingGroupListItem({ name, organization }) {
  return (
    <ListItem sx={{ width: "33.3%", padding: "10px 0" }}>
      <ListItemButton>
        <ListItemText primary={name} sx={{ color: "#532565", padding: "0 16px" }} />
        <Chip label={organization} />
      </ListItemButton>
    </ListItem>
  )
}
