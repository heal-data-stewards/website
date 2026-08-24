import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY = "healbot-chat-history"
const MAX_MESSAGES = 60

const isMessage = (value) =>
  value &&
  (value.role === "user" || value.role === "assistant") &&
  typeof value.content === "string"

export const useChatHistory = () => {
  const [messages, setMessages] = useState([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      const parsed = stored ? JSON.parse(stored) : null
      if (Array.isArray(parsed)) {
        setMessages(parsed.filter(isMessage).slice(-MAX_MESSAGES))
      }
    } catch (error) {
      console.error(error.message)
    }
    setHydrated(true)
  }, [])

  // Gated on hydration so the empty initial state can't overwrite stored
  // messages before they are read back.
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch (error) {
      console.error(error.message)
    }
  }, [hydrated, messages])

  const appendMessage = useCallback((message) => {
    setMessages((previous) => [...previous, message].slice(-MAX_MESSAGES))
  }, [])

  const clearMessages = useCallback(() => setMessages([]), [])

  return { messages, appendMessage, clearMessages, hydrated }
}
