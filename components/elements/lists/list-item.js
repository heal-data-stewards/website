import React from "react"
import classNames from "classnames"
import PropTypes from "prop-types"
import ListItem from "@mui/material/ListItem"

export const CustomListItem = ({ children }) => {
  return (
    <ListItem
      sx={{
        display: "list-item",
        fontSize: "1.1rem",
        paddingTop: "0",
        paddingBottom: "0",
      }}
    >
      {children}
    </ListItem>
  )
}
