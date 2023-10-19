import React from "react"
import classNames from "classnames"
import PropTypes from "prop-types"
import List from "@mui/material/List"

export const CustomUnorderedList = ({ children }) => {
  return (
    <List sx={{ listStyleType: "square", marginLeft: "50px" }}>{children}</List>
  )
}
