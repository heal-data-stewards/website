import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Box from "@mui/material/Box"
import Link from "../link"
import ChatMarkdown from "./chat-markdown"

const SOURCES_MARKER = "**Sources:**"
const SOURCE_LINE = /^\[(\d+)\]\s*(.+)$/
const TRAILING_URL = /^(.*?)\s*\[(https?:\/\/[^\]\s]+)\]$/

const HIGHLIGHT_MS = 1800

const parseSource = (line) => {
  const match = SOURCE_LINE.exec(line.trim())
  if (!match) return null

  const rest = match[2].trim()
  const withUrl = TRAILING_URL.exec(rest)

  return {
    number: Number(match[1]),
    label: withUrl ? withUrl[1].trim() : rest,
    url: withUrl ? withUrl[2] : null,
  }
}

// Replies end with a "**Sources:**" block of `[n] Label [url]` lines. Pulling it
// out lets each source own an anchor the inline citations can target; anything
// that doesn't match that shape falls back to rendering as plain markdown.
const parseReply = (content) => {
  const index = content.lastIndexOf(SOURCES_MARKER)
  if (index === -1) return { body: content, sources: [] }

  const sources = content
    .slice(index + SOURCES_MARKER.length)
    .split("\n")
    .map(parseSource)
    .filter(Boolean)

  if (!sources.length) return { body: content, sources: [] }

  return { body: content.slice(0, index).trimEnd(), sources }
}

const AssistantMessage = ({ content }) => {
  const [highlighted, setHighlighted] = useState(null)
  const sourceRefs = useRef(new Map())
  const timeout = useRef(null)

  const { body, sources } = useMemo(() => parseReply(content), [content])
  const citations = useMemo(
    () => new Set(sources.map((source) => source.number)),
    [sources]
  )

  useEffect(() => () => clearTimeout(timeout.current), [])

  const goToSource = useCallback((number) => {
    const element = sourceRefs.current.get(number)
    if (!element) return

    element.scrollIntoView({ block: "center", behavior: "smooth" })
    setHighlighted(number)
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setHighlighted(null), HIGHLIGHT_MS)
  }, [])

  return (
    <>
      <ChatMarkdown citations={citations} onCitationClick={goToSource}>
        {body}
      </ChatMarkdown>

      {sources.length > 0 && (
        <Box sx={{ mt: 1.5 }}>
          <Box
            component="h4"
            sx={{
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "text.secondary",
              m: 0,
              mb: 0.5,
            }}
          >
            Sources
          </Box>
          {/* `&&` doubles the class specificity: a single class loses to the
              global `ol` padding-inline-start rule. */}
          <Box
            component="ol"
            sx={{
              "&&": {
                listStyle: "none",
                margin: 0,
                padding: 0,
                paddingInlineStart: "20px",
              },
            }}
          >
            {sources.map((source) => (
              <Box
                component="li"
                key={source.number}
                ref={(node) => {
                  if (node) sourceRefs.current.set(source.number, node)
                  else sourceRefs.current.delete(source.number)
                }}
                sx={{
                  display: "flex",
                  gap: 0.75,
                  fontSize: "0.8125rem",
                  lineHeight: 1.45,
                  px: 0.75,
                  py: 0.5,
                  mx: -0.75,
                  borderRadius: 1,
                  transition: "background-color 200ms",
                  backgroundColor:
                    highlighted === source.number
                      ? "rgba(152, 37, 104, 0.16)"
                      : "transparent",
                }}
              >
                <Box component="span" sx={{ fontWeight: 700, flexShrink: 0 }}>
                  [{source.number}]
                </Box>
                {source.url ? (
                  <Link
                    to={source.url}
                    sx={{ fontSize: "inherit", fontWeight: 400 }}
                  >
                    {source.label}
                  </Link>
                ) : (
                  <Box component="span">{source.label}</Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </>
  )
}

export default AssistantMessage
