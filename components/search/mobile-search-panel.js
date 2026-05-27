import { useRef } from "react"
import { InstantSearch, useSearchBox, useHits } from "react-instantsearch"
import { OutlinedInput, InputAdornment } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { useRouter } from "next/router"
import { SearchHit } from "./search-hit"
import { useKeyboardNav } from "./use-keyboard-nav"

const LISTBOX_ID = "mobile-search-listbox"
const HIT_ID_PREFIX = "mobile-search-hit"

export function MobileSearchPanel({ searchClient, indexName, onClose }) {
  return (
    <InstantSearch searchClient={searchClient} indexName={indexName}>
      <MobileSearchInner onClose={onClose} />
    </InstantSearch>
  )
}

function MobileSearchInner({ onClose }) {
  const { query, refine, clear } = useSearchBox()
  const { items: hits } = useHits()
  const inputRef = useRef(null)
  const router = useRouter()

  const isOpen = query.length > 0 && hits.length > 0

  const handleClose = () => {
    clear()
    onClose()
  }

  const { activeIndex, handleKeyDown } = useKeyboardNav({
    hits,
    query,
    isOpen,
    onNavigate: (path) => {
      router.push(path)
      handleClose()
    },
    onClose: handleClose,
    idPrefix: HIT_ID_PREFIX,
  })

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      handleClose()
    }
  }

  return (
    <div className="w-full">
      <div className="container py-2 flex">
        <OutlinedInput
          size="small"
          value={query}
          onChange={(e) => refine(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search…"
          inputRef={inputRef}
          autoFocus
          autoComplete="off"
          inputProps={{
            role: "combobox",
            "aria-expanded": isOpen,
            "aria-controls": LISTBOX_ID,
            "aria-activedescendant":
              activeIndex >= 0 ? `${HIT_ID_PREFIX}-${activeIndex}` : undefined,
            "aria-autocomplete": "list",
            "aria-label": "Search site",
          }}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon fontSize="small" sx={{ color: "#532565" }} />
            </InputAdornment>
          }
          sx={{
            flex: 1,
            marginBottom: 0,
            backgroundColor: "white",
            borderRadius: "4px 0 0 4px",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#532565" },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#532565",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#532565",
              borderWidth: 2,
            },
          }}
        />
        <button
          onClick={handleSearch}
          className="shrink-0 px-3 rounded-r text-sm font-semibold bg-purple text-white hover:bg-magenta transition-colors self-stretch"
        >
          Search
        </button>
      </div>

      {isOpen && (
        <ul
          id={LISTBOX_ID}
          role="listbox"
          aria-label="Search results"
          className="w-full bg-white divide-y divide-gray-light overflow-y-auto max-h-[60vh]"
        >
          {hits.map((hit, index) => (
            <SearchHit
              key={hit.objectID}
              id={`${HIT_ID_PREFIX}-${index}`}
              hit={hit}
              isActive={activeIndex === index}
              onSelect={handleClose}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
