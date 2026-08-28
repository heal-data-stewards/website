import { useMemo } from "react"
import ReactMarkdown from "react-markdown"
import gfm from "remark-gfm"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import MUILink from "@mui/material/Link"
import Link from "../link"

// Splits on fenced blocks and inline spans so code is left verbatim; the
// captured delimiters land on odd indices.
const CODE = /(```[\s\S]*?```|`[^`\n]*`)/g
const SINGLE_NEWLINE = /([^\n])\n(?!\n)/g
const CITATION = /\[(\d+)\]/g

const CITATION_HREF = "#healbot-citation-"
const CITATION_HREF_PATTERN = /^#healbot-citation-(\d+)$/

// The assistant separates citations and short lines with single newlines, which
// CommonMark folds into one paragraph. Promote them to hard breaks.
const withHardBreaks = (segment) => segment.replace(SINGLE_NEWLINE, "$1  \n")

// Turn `[1]` into a link, but only where a matching source exists so stray
// bracketed numbers stay as written.
const withCitationLinks = (segment, citations) =>
  segment.replace(CITATION, (match, number) =>
    citations.has(Number(number))
      ? `[\\[${number}\\]](${CITATION_HREF}${number})`
      : match
  )

const prepare = (markdown, citations) =>
  markdown
    .split(CODE)
    .map((segment, index) => {
      if (index % 2) return segment
      const withBreaks = withHardBreaks(segment)
      return citations.size
        ? withCitationLinks(withBreaks, citations)
        : withBreaks
    })
    .join("")

const body = {
  fontSize: "0.875rem",
  lineHeight: 1.55,
  marginBottom: 0,
}

const heading = {
  ...body,
  fontWeight: 700,
  color: "primary.main",
  paddingBottom: 0,
  mt: 1.5,
  mb: 0.5,
  "&:first-of-type": { mt: 0 },
}

const codeFont = {
  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
  fontSize: "0.8125rem",
}

// Plain elements rather than MUI Typography: index.css pins every
// .MuiTypography-* variant with !important, which no sx value can override.
const Heading = ({ children }) => (
  <Box component="h4" sx={heading}>
    {children}
  </Box>
)

const baseComponents = {
  p: function Paragraph({ children }) {
    return (
      <Box component="p" sx={{ ...body, mb: 1, "&:last-child": { mb: 0 } }}>
        {children}
      </Box>
    )
  },
  h1: Heading,
  h2: Heading,
  h3: Heading,
  h4: Heading,
  h5: Heading,
  h6: Heading,
  ul: function UnorderedList({ children }) {
    return (
      <Box component="ul" sx={{ ...body, pl: 2.5, my: 1, listStyle: "disc" }}>
        {children}
      </Box>
    )
  },
  ol: function OrderedList({ children }) {
    return (
      <Box
        component="ol"
        sx={{ ...body, pl: 2.5, my: 1, listStyle: "decimal" }}
      >
        {children}
      </Box>
    )
  },
  li: function ListItem({ children }) {
    return (
      <Box component="li" sx={{ ...body, mb: 0.5, "& p": { mb: 0 } }}>
        {children}
      </Box>
    )
  },
  code: function Code({ inline, children }) {
    return (
      <Box
        component="code"
        sx={{
          ...codeFont,
          ...(inline && {
            backgroundColor: "rgba(83, 37, 101, 0.08)",
            borderRadius: "3px",
            px: 0.5,
            py: "1px",
          }),
        }}
      >
        {children}
      </Box>
    )
  },
  pre: function Pre({ children }) {
    return (
      <Box
        component="pre"
        sx={{
          ...codeFont,
          backgroundColor: "rgba(83, 37, 101, 0.06)",
          borderRadius: "6px",
          p: 1,
          my: 1,
          overflowX: "auto",
        }}
      >
        {children}
      </Box>
    )
  },
  blockquote: function Blockquote({ children }) {
    return (
      <Box
        component="blockquote"
        sx={{
          borderLeft: "3px solid",
          borderColor: "primary.light",
          pl: 1.5,
          my: 1,
          color: "text.secondary",
        }}
      >
        {children}
      </Box>
    )
  },
  table: function Table({ children }) {
    return (
      <Box sx={{ overflowX: "auto", my: 1 }}>
        <Box
          component="table"
          sx={{
            ...body,
            borderCollapse: "collapse",
            "& th, & td": {
              border: "1px solid",
              borderColor: "grey.300",
              px: 1,
              py: 0.5,
              textAlign: "left",
            },
            "& th": { fontWeight: 700, backgroundColor: "grey.100" },
          }}
        >
          {children}
        </Box>
      </Box>
    )
  },
  hr: function Rule() {
    return <Divider sx={{ my: 1.5 }} />
  },
}

const EMPTY_CITATIONS = new Set()

const ChatMarkdown = ({
  children,
  citations = EMPTY_CITATIONS,
  onCitationClick,
}) => {
  const components = useMemo(
    () => ({
      ...baseComponents,
      a: function Anchor({ href, children: label }) {
        if (!href) return <>{label}</>

        const citation = CITATION_HREF_PATTERN.exec(href)
        if (citation) {
          const number = Number(citation[1])
          return (
            <MUILink
              component="button"
              type="button"
              underline="hover"
              aria-label={`Jump to source ${number}`}
              onClick={() => onCitationClick?.(number)}
              sx={{
                font: "inherit",
                fontWeight: 600,
                color: "#982568",
                background: "none",
                border: 0,
                p: 0,
                cursor: "pointer",
                verticalAlign: "baseline",
              }}
            >
              {label}
            </MUILink>
          )
        }
        return (
          <Link to={href} sx={{ fontSize: "inherit", wordBreak: "break-word" }}>
            {label}
          </Link>
        )
      },
    }),
    [onCitationClick]
  )

  return (
    <ReactMarkdown remarkPlugins={[gfm]} components={components}>
      {prepare(children, citations)}
    </ReactMarkdown>
  )
}

export default ChatMarkdown
