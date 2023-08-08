import ReactMarkdown from "react-markdown"
import React, { Fragment } from "react"
import Typography from "@mui/material/Typography"
import Link from "../elements/link"


// this object defines a map:
//    DOM elements --> React components.
// this allows us to streamline styles for content coming
// from Strapi with that of content built here by Nextjs.

const componentMap = {
  // for links, we'll use our smart link component.
  a: ({ node, href, ...props }) => <Link to={href} {...props} />,
  p: ({ node, children, ...props }) => (
    <Typography paragraph>{children}</Typography>
  ),
}

const Markdown = ({ children }) => {
  return <ReactMarkdown components={componentMap}>{children}</ReactMarkdown>
}

export default Markdown
