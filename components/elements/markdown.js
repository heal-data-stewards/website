import ReactMarkdown from "react-markdown"
import React, { useMemo } from "react"

const Markdown = ({ src }) => {
  const componentMap = useMemo(
    () => ({
      p: function Anchor({ node, href, children, ...props }) {
        return (
          <p
            style={{
              paddingBottom: "1rem",
            }}
          >
            {children}
          </p>
        )
      },
      li: function Anchor({ node, href, children, ...props }) {
        return (
          <li style={{ lineHeight: "1.5", letterSpacing: "0.2px" }}>
            {children}
          </li>
        )
      },
    }),
    []
  )

  return <ReactMarkdown components={componentMap} children={src} />
}

export default Markdown
