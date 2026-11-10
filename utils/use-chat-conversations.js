import { useCallback, useEffect, useMemo, useRef, useState } from "react"

const STORAGE_KEY = "healbot-conversations"
const TITLE_MAX = 48

const isMessage = (value) =>
  value &&
  (value.role === "user" || value.role === "assistant") &&
  typeof value.content === "string"

const isConversation = (value) =>
  value && typeof value.id === "string" && Array.isArray(value.messages)

const titleFrom = (content) => {
  const text = content.trim().replace(/\s+/g, " ")
  return text.length > TITLE_MAX ? `${text.slice(0, TITLE_MAX - 1)}…` : text
}

const createId = () =>
  window.crypto?.randomUUID?.() ?? `chat-${Date.now()}-${Math.random()}`

export const useChatConversations = () => {
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [hydrated, setHydrated] = useState(false)

  // Mirrored in a ref so an in-flight send can target its own conversation
  // without capturing a stale id.
  const activeIdRef = useRef(null)

  const setActive = useCallback((id) => {
    activeIdRef.current = id
    setActiveId(id)
  }, [])

  // Past conversations are restored, but the selection is not: every page load
  // starts on a new chat.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      const parsed = stored ? JSON.parse(stored) : null
      if (Array.isArray(parsed)) {
        setConversations(
          parsed.filter(isConversation).map((conversation) => ({
            ...conversation,
            messages: conversation.messages.filter(isMessage),
          }))
        )
      }
    } catch (error) {
      console.error(error.message)
    }
    setHydrated(true)
  }, [])

  // Gated on hydration so the empty initial state can't overwrite what's stored.
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
    } catch (error) {
      console.error(error.message)
    }
  }, [hydrated, conversations])

  const sorted = useMemo(
    () => [...conversations].sort((a, b) => b.updatedAt - a.updatedAt),
    [conversations]
  )

  const messages = useMemo(
    () =>
      conversations.find((conversation) => conversation.id === activeId)
        ?.messages ?? [],
    [conversations, activeId]
  )

  // A conversation is created by its first message, so an unused "new chat"
  // never shows up in the history list.
  const startConversation = useCallback(() => {
    if (activeIdRef.current) return activeIdRef.current
    const id = createId()
    setActive(id)
    return id
  }, [setActive])

  const appendMessage = useCallback((conversationId, message) => {
    setConversations((previous) => {
      const updatedAt = Date.now()
      const index = previous.findIndex(
        (conversation) => conversation.id === conversationId
      )

      if (index === -1) {
        return [
          {
            id: conversationId,
            title: titleFrom(message.content),
            updatedAt,
            messages: [message],
          },
          ...previous,
        ]
      }

      const next = [...previous]
      next[index] = {
        ...next[index],
        updatedAt,
        messages: [...next[index].messages, message],
      }
      return next
    })
  }, [])

  const newChat = useCallback(() => setActive(null), [setActive])

  const selectConversation = useCallback((id) => setActive(id), [setActive])

  const deleteConversation = useCallback(
    (id) => {
      setConversations((previous) =>
        previous.filter((conversation) => conversation.id !== id)
      )
      if (activeIdRef.current === id) setActive(null)
    },
    [setActive]
  )

  return {
    conversations: sorted,
    activeId,
    messages,
    startConversation,
    appendMessage,
    newChat,
    selectConversation,
    deleteConversation,
  }
}
