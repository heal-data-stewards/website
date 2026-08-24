import { useCallback, useEffect, useRef, useState } from "react"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Fab from "@mui/material/Fab"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import TextField from "@mui/material/TextField"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded"
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded"
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded"
import SendRoundedIcon from "@mui/icons-material/SendRounded"
import { useChatHistory } from "utils/use-chat-history"
import AssistantMessage from "./assistant-message"

const SUGGESTIONS = [
  "What are the FAIR principles?",
  "How do I register my study on the HEAL Data Platform?",
  "Which repositories are recommended for HEAL data?",
  "How should I create a Data Management and Sharing Plan?",
]

const GENERIC_ERROR = "Something went wrong. Please try again."

const TypingIndicator = () => (
  <Box sx={{ display: "flex", gap: 0.5, px: 0.5, py: 1 }}>
    {[0, 1, 2].map((dot) => (
      <Box
        key={dot}
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "primary.light",
          animation: "healbot-blink 1.4s infinite ease-in-out both",
          animationDelay: `${dot * 0.16}s`,
          "@keyframes healbot-blink": {
            "0%, 80%, 100%": { opacity: 0.25 },
            "40%": { opacity: 1 },
          },
        }}
      />
    ))}
  </Box>
)

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user"
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <Box
        sx={{
          maxWidth: "88%",
          px: 1.5,
          py: 1,
          borderRadius: 2,
          borderTopRightRadius: isUser ? 0 : 2,
          borderTopLeftRadius: isUser ? 2 : 0,
          backgroundColor: isUser ? "primary.main" : "grey.100",
          color: isUser ? "primary.contrastText" : "text.primary",
          overflowWrap: "anywhere",
        }}
      >
        {isUser ? (
          <Typography
            sx={{
              fontSize: "0.875rem",
              lineHeight: 1.55,
              whiteSpace: "pre-wrap",
            }}
          >
            {message.content}
          </Typography>
        ) : (
          <AssistantMessage content={message.content} />
        )}
      </Box>
    </Box>
  )
}

const AssistantPopup = () => {
  const { messages, appendMessage, clearMessages } = useChatHistory()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)

  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const container = scrollRef.current
    if (open && container) container.scrollTop = container.scrollHeight
  }, [open, messages, pending, error])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const send = useCallback(
    async (text) => {
      const question = text.trim()
      if (!question || pending) return

      setInput("")
      setError(null)
      appendMessage({ role: "user", content: question })
      setPending(true)

      try {
        const response = await fetch("/api/healbot/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // `messages` excludes the question above, which the API takes separately.
          body: JSON.stringify({ message: question, history: messages }),
        })
        const data = await response.json().catch(() => null)

        if (!response.ok) {
          setError(data?.message || GENERIC_ERROR)
          return
        }

        appendMessage({ role: "assistant", content: data.reply })
      } catch {
        setError(GENERIC_ERROR)
      } finally {
        setPending(false)
      }
    },
    [appendMessage, messages, pending]
  )

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      send(input)
    }
  }

  if (!open) {
    return (
      <Fab
        color="primary"
        aria-label="Open the HEAL assistant"
        onClick={() => setOpen(true)}
        sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1200 }}
      >
        <ChatBubbleOutlineRoundedIcon />
      </Fab>
    )
  }

  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        bottom: 24,
        right: { xs: 16, sm: 24 },
        left: { xs: 16, sm: "auto" },
        width: { xs: "auto", sm: 380 },
        height: "min(560px, calc(100dvh - 120px))",
        zIndex: 1200,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1.25,
          backgroundColor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <Typography sx={{ flex: 1, fontWeight: 600, fontSize: "0.95rem" }}>
          HEAL Assistant
        </Typography>
        <Tooltip title="Clear conversation">
          <span>
            <IconButton
              size="small"
              color="inherit"
              aria-label="Clear conversation"
              disabled={!messages.length}
              onClick={() => {
                clearMessages()
                setError(null)
              }}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <IconButton
          size="small"
          color="inherit"
          aria-label="Close the HEAL assistant"
          onClick={() => setOpen(false)}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box
        ref={scrollRef}
        role="log"
        aria-live="polite"
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          px: 2,
          py: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {!messages.length && (
          <>
            <Typography sx={{ fontSize: "0.875rem", lineHeight: 1.55 }}>
              Ask about HEAL data sharing, FAIR principles, metadata, and
              repositories. Answers are grounded in resources from
              healdatafair.org.
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {SUGGESTIONS.map((suggestion) => (
                <Chip
                  key={suggestion}
                  label={suggestion}
                  size="small"
                  variant="outlined"
                  onClick={() => send(suggestion)}
                  sx={{
                    height: "auto",
                    borderColor: "primary.light",
                    "& .MuiChip-label": {
                      whiteSpace: "normal",
                      fontSize: "0.75rem",
                      py: 0.5,
                    },
                  }}
                />
              ))}
            </Box>
          </>
        )}

        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}

        {pending && <TypingIndicator />}

        {error && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              color: "error.main",
            }}
          >
            <ErrorOutlineRoundedIcon fontSize="small" />
            <Typography sx={{ fontSize: "0.8125rem" }}>{error}</Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: 1,
          px: 1.5,
          py: 1.25,
          borderTop: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <TextField
          inputRef={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question…"
          aria-label="Message"
          multiline
          maxRows={4}
          size="small"
          fullWidth
          InputProps={{
            sx: {
              fontSize: "0.875rem",
              borderRadius: 2,
              // @tailwindcss/forms styles bare textareas, which double up on
              // the outline MUI already draws.
              "& textarea": {
                border: 0,
                borderRadius: 0,
                boxShadow: "none",
                p: 0,
                "&:focus": { outline: 0, boxShadow: "none" },
              },
            },
          }}
        />
        <IconButton
          color="primary"
          aria-label="Send message"
          disabled={pending || !input.trim()}
          onClick={() => send(input)}
        >
          <SendRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  )
}

export default AssistantPopup
