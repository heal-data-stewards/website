import Link from "next/link"
import PropTypes from "prop-types"
import { linkPropTypes } from "utils/types"
import { ThemeProvider } from "@emotion/react"
import { createTheme } from "@mui/material/styles"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

const theme = createTheme({
  palette: {
    primary: {
      light: "#c0b3c5",
      dark: "#982568",
      main: "#532565",
      contrastText: "#fff",
    },
  },
})

const CustomLink = ({ link, children, onClick }) => {
  const isInternalLink =
    typeof link.url === "string" && link.url.startsWith("/")

  // For internal links, use the Next.js Link component
  if (isInternalLink) {
    return (
      <Link href="/[[...slug]]" as={link.url}>
        <a
          onMouseDown={onClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClick()
            }
          }}
        >
          {children}
        </a>
      </Link>
    )
  }

  // Plain <a> tags for external links
  if (link.newTab) {
    return (
      // <ThemeProvider theme={theme}>
      <Button
        variant="contained"
        color="primary"
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseDown={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClick()
          }
        }}
        style={{
          padding: "0.5rem 1rem",
          color: "white",
          margin: "0.25rem",
        }}
      >
        {children}
      </Button>
      // </ThemeProvider>
    )
  }

  return (
    <a
      href={link.url}
      target="_self"
      onMouseDown={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick()
        }
      }}
    >
      {children}
    </a>
  )
}

CustomLink.propTypes = {
  link: linkPropTypes,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default CustomLink
