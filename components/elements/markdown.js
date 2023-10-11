import ReactMarkdown from "react-markdown"
import React, { useMemo } from "react"
import Typography from "@mui/material/Typography"
import Link from "../elements/link"
import ListItem from "@mui/material/ListItem"
import List from "@mui/material/List"
// this object defines a map:
//    DOM elements --> React components.
// this allows us to streamline styles for content coming
// from Strapi with that of content built here by Nextjs.

const Markdown = ({ children }) => {
  const componentMap = useMemo(
    () => ({
      p: function Anchor({ node, children, ...props }) {
        return <Typography variant="body1">{children}</Typography>
      },
      a: function Anchor({ node, href, ...props }) {
        return <Link to={href} {...props} />
      },
      ul: function Anchor({ node, children, ...props }) {
        return (
          <List sx={{ listStyleType: "square", marginLeft: "50px" }}>
            {children}
          </List>
        )
      },
      li: function Anchor({ node, children, ...props }) {
        return (
          <ListItem
            sx={{ display: "list-item", lineHeight: 1.45, fontSize: "1.1rem" }}
          >
            {children}
          </ListItem>
        )
      },
      h1: function Anchor({ node, children, ...props }) {
        return <Typography variant="h1">{children}</Typography>
      },
    }),
    []
  )
  return <ReactMarkdown components={componentMap}>{children}</ReactMarkdown>
}

export default Markdown
