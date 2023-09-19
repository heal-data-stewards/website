import ReactMarkdown from "react-markdown"
import React, { useMemo } from "react"
import Typography from "@mui/material/Typography"
import Link from "../elements/link"

// this object defines a map:
//    DOM elements --> React components.
// this allows us to streamline styles for content coming
// from Strapi with that of content built here by Nextjs.

const Markdown = ({ children }) => {
  const componentMap = useMemo(
    () => ({
      p: function Anchor({ node, children, ...props }) {
        return <Typography paragraph>{children}</Typography>
      },
      a: function Anchor({ node, href, ...props }) {
        return <Link to={href} {...props} />
      },
      ul: function Anchor({ node, children, ...props }) {
        return (
          <Typography>
            <ul>{children}</ul>
          </Typography>
        )
      },
    }),
    []
  )
  return <ReactMarkdown components={componentMap}>{children}</ReactMarkdown>
}

export default Markdown
