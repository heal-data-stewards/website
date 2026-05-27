import { useRef, useState } from "react"
import { useSearchBox, useHits } from "react-instantsearch"
import { ClickAwayListener } from "@mui/material"
import { useRouter } from "next/router"
import { SearchInput } from "./search-input"
import { SearchDropdown } from "./search-dropdown"
import { useKeyboardNav } from "./use-keyboard-nav"

const LISTBOX_ID = "global-search-listbox"

export function SearchCombobox() {
  const { query, refine, clear } = useSearchBox()
  const { items: hits } = useHits()
  const inputRef = useRef(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const router = useRouter()

  const isOpen = isExpanded && query.length > 0 && hits.length > 0

  const handleExpand = () => {
    setIsExpanded(true)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const handleClose = () => {
    setIsExpanded(false)
    clear()
  }

  const handleNavigate = (path) => {
    router.push(path)
    handleClose()
  }

  const { activeIndex, handleKeyDown } = useKeyboardNav({
    hits,
    query,
    isOpen,
    onNavigate: handleNavigate,
    onClose: handleClose,
  })

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (isExpanded) handleClose()
      }}
    >
      <div className="relative">
        <SearchInput
          ref={inputRef}
          isExpanded={isExpanded}
          value={query}
          onChange={refine}
          onExpand={handleExpand}
          onClose={handleClose}
          onKeyDown={handleKeyDown}
          onNavigateToResults={() =>
            handleNavigate(`/search?q=${encodeURIComponent(query.trim())}`)
          }
          listboxId={LISTBOX_ID}
          isOpen={isOpen}
          activeIndex={activeIndex}
        />
        {isOpen && (
          <SearchDropdown
            id={LISTBOX_ID}
            hits={hits}
            activeIndex={activeIndex}
            onHitSelect={handleClose}
          />
        )}
      </div>
    </ClickAwayListener>
  )
}
