import { useState, useEffect } from "react"

/**
 * Manages keyboard navigation for a search combobox (ARIA listbox pattern).
 * Handles ArrowDown/ArrowUp, Home/End, Enter, and Escape.
 *
 * @param {object} options
 * @param {{ path: string, objectID: string }[]} options.hits - Current array of Algolia hit objects.
 * @param {string} options.query - Current search query string. Resetting it clears the active index.
 * @param {boolean} options.isOpen - Whether the results listbox is visible.
 * @param {(url: string) => void} options.onNavigate - Called with a URL string when the user confirms
 *   a selection. Receives `hit.path` for a highlighted hit, or `/search?q=...` when Enter is pressed
 *   with no highlighted item.
 * @param {() => void} options.onClose - Called when the user presses Escape.
 * @param {string} [options.idPrefix="search-hit"] - DOM id prefix used to scroll the active item into
 *   view. Must match the `id` prop on each rendered hit element.
 * @returns {{ activeIndex: number, handleKeyDown: (e: KeyboardEvent) => void }}
 */
export function useKeyboardNav({
  hits,
  query,
  isOpen,
  onNavigate,
  onClose,
  idPrefix = "search-hit",
}) {
  const [activeIndex, setActiveIndex] = useState(-1)

  // Reset selection whenever the query changes
  useEffect(() => {
    setActiveIndex(-1)
  }, [query])

  // Scroll the active item into view without disrupting page scroll
  useEffect(() => {
    if (activeIndex >= 0) {
      document
        .getElementById(`${idPrefix}-${activeIndex}`)
        ?.scrollIntoView({ block: "nearest" })
    }
  }, [activeIndex, idPrefix])

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
      case "Home":
        e.preventDefault()
        if (isOpen) setActiveIndex(0)
        break
      case "End":
        e.preventDefault()
        if (isOpen) setActiveIndex(hits.length - 1)
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
