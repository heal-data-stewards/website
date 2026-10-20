import { useRef, useState } from "react"
import { useSearchBox, useHits, Configure } from "react-instantsearch"
import { ClickAwayListener } from "@mui/material"
import { useRouter } from "next/router"
import { SearchInput } from "./search-input"
import { SearchDropdown } from "./search-dropdown"
import { useKeyboardNav } from "./use-keyboard-nav"
import {
  IncludeEventsToggle,
  EVENTS_EXCLUDED_FILTER,
  EVENTS_PARAM_VALUE,
} from "./include-events-toggle"
import { sendCustomEvent } from "utils/analytics"

const LISTBOX_ID = "global-search-listbox"

export function SearchCombobox() {
  const { query, refine, clear } = useSearchBox()
  const { items: hits } = useHits()
  const inputRef = useRef(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [includeEvents, setIncludeEvents] = useState(false)
  const router = useRouter()

  const isOpen = isExpanded && query.length > 0 && hits.length > 0

  const trackSearchSubmitted = (searchTerm, submissionMethod) => {
    sendCustomEvent("site_search_submitted", {
      search_term: searchTerm,
      search_location: "desktop_nav",
      submission_method: submissionMethod,
      include_events: includeEvents ? "on" : "off",
      page_path: window.location.pathname,
    })
  }

  const handleExpand = () => {
    sendCustomEvent("site_search_icon_toggled", {
      search_location: "desktop_nav",
      toggle_state: "open",
      page_path: window.location.pathname,
    })
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

  const handleNavigateToResults = (submissionMethod = "icon_click") => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return

    trackSearchSubmitted(trimmedQuery, submissionMethod)
    handleNavigate(
      `/search?q=${encodeURIComponent(trimmedQuery)}${
        includeEvents ? `&events=${EVENTS_PARAM_VALUE}` : ""
      }`
    )
  }

  const handleToggleIncludeEvents = (checked) => {
    setIncludeEvents(checked)
    sendCustomEvent("site_search_events_toggled", {
      search_location: "desktop_nav",
      toggle_state: checked ? "on" : "off",
      search_term: query.trim(),
      page_path: window.location.pathname,
    })
  }

  const handleResultInteraction = ({ linkUrl, linkText, resultIndex }) => {
    sendCustomEvent("site_search_result_clicked", {
      search_term: query,
      link_url: linkUrl,
      link_text: linkText,
      result_index: resultIndex,
      page_path: window.location.pathname,
    })
  }

  const { activeIndex, handleKeyDown } = useKeyboardNav({
    hits,
    query,
    isOpen,
    onNavigate: handleNavigate,
    onClose: handleClose,
    onSelectHit: (hit, index) => {
      handleResultInteraction({
        linkUrl: hit.path,
        linkText: hit.title || "",
        resultIndex: index + 1,
      })
    },
    onSubmitQuery: () => handleNavigateToResults("enter_key"),
  })

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (isExpanded) handleClose()
      }}
    >
      <div className="relative">
        <Configure filters={includeEvents ? "" : EVENTS_EXCLUDED_FILTER} />
        <SearchInput
          ref={inputRef}
          isExpanded={isExpanded}
          value={query}
          onChange={refine}
          onExpand={handleExpand}
          onClose={handleClose}
          onKeyDown={handleKeyDown}
          onNavigateToResults={handleNavigateToResults}
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
            onResultInteraction={handleResultInteraction}
            footer={
              <IncludeEventsToggle
                id="global-search-include-events"
                checked={includeEvents}
                onChange={handleToggleIncludeEvents}
              />
            }
          />
        )}
      </div>
    </ClickAwayListener>
  )
}
