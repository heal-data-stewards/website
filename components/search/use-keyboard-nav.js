import { useState, useEffect } from "react"

export function useKeyboardNav({ hits, query, isOpen, onNavigate, onClose }) {
  const [activeIndex, setActiveIndex] = useState(-1)

  // Reset selection whenever the query changes
  useEffect(() => {
    setActiveIndex(-1)
  }, [query])

  // Scroll the active item into view without disrupting page scroll
  useEffect(() => {
    if (activeIndex >= 0) {
      document
        .getElementById(`search-hit-${activeIndex}`)
        ?.scrollIntoView({ block: "nearest" })
    }
  }, [activeIndex])

  function handleKeyDown(e) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        if (isOpen) setActiveIndex((i) => Math.min(i + 1, hits.length - 1))
        break
      case "ArrowUp":
        e.preventDefault()
        if (isOpen) setActiveIndex((i) => Math.max(i - 1, -1))
        break
      case "Enter":
        e.preventDefault()
        if (isOpen && activeIndex >= 0 && hits[activeIndex]) {
          onNavigate(hits[activeIndex].path)
        } else if (query.trim()) {
          onNavigate(`/search?q=${encodeURIComponent(query.trim())}`)
        }
        break
      case "Escape":
        e.preventDefault()
        onClose()
        break
    }
  }

  return { activeIndex, handleKeyDown }
}
