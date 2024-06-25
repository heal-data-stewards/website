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
import { CustomUnorderedList } from "../elements/lists/unordered-list"
import { CustomListItem } from "../elements/lists/list-item"

const Markdown = ({ children, sensitiveTool, darkBackground }) => {
  const componentMap = useMemo(
    () => ({
      p: function Anchor({ node, children, ...props }) {
        return (
          <Typography className={sensitiveTool} variant="body1">
            {children}
          </Typography>
        )
      },
      a: function Anchor({ node, href, ...props }) {
        return <Link to={href} darkBackground={darkBackground} {...props} />
      },
      ul: function Anchor({ node, children, ...props }) {
        return <CustomUnorderedList>{children}</CustomUnorderedList>
      },
      li: function Anchor({ node, children, ...props }) {
        return <CustomListItem>{children}</CustomListItem>
      },
      h1: function Anchor({ node, children, ...props }) {
        return (
          <Typography
            variant="h2"
            color="primary"
            sx={{ paddingTop: "1.25rem" }}
          >
            {children}
          </Typography>
        )
      },
      h2: function Anchor({ node, children, ...props }) {
        return (
          <Typography
            variant="h2"
            color="primary"
            sx={{ paddingTop: "1.25rem" }}
          >
            {children}
          </Typography>
        )
      },
      h3: function Anchor({ node, children, ...props }) {
        return <Typography variant="h3">{children}</Typography>
      },
      h4: function Anchor({ node, children, ...props }) {
        return <Typography variant="h4">{children}</Typography>
      },
    }),
    [sensitiveTool, darkBackground]
  )
  return <ReactMarkdown components={componentMap}>{children}</ReactMarkdown>
}

export default Markdown
