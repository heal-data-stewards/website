import { forwardRef } from "react"
import { OutlinedInput, InputAdornment, IconButton } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import CloseIcon from "@mui/icons-material/Close"
import { searchInputSx } from "./search-styles"

export const SearchInput = forwardRef(function SearchInput(
  {
    isExpanded,
    value,
    onChange,
    onExpand,
    onClose,
    onKeyDown,
    onNavigateToResults,
    listboxId,
    isOpen,
    activeIndex,
  },
  ref
) {
  const handleIconClick = () => {
    if (!isExpanded) return onExpand()
    if (value.trim() && onNavigateToResults) return onNavigateToResults()
    ref.current?.focus()
  }

  return (
    <div className="flex items-center">
      {/* MUI input animates in/out via width transition */}
      <div
        className={[
          "flex items-center overflow-hidden whitespace-nowrap",
          "transition-[width,opacity] duration-200 ease-in-out",
          isExpanded ? "w-56 opacity-100" : "w-0 opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <OutlinedInput
          fullWidth
          size="small"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search…"
          inputRef={ref}
          autoComplete="off"
          inputProps={{
            role: "combobox",
            "aria-expanded": isOpen,
            "aria-controls": listboxId,
            "aria-activedescendant":
              activeIndex >= 0 ? `search-hit-${activeIndex}` : undefined,
            "aria-autocomplete": "list",
            "aria-label": "Search site",
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={onClose}
                aria-label="Close search"
                edge="end"
                tabIndex={isExpanded ? 0 : -1}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          }
          sx={searchInputSx}
        />
      </div>

      {/* Collapsed: opens search. Expanded with query: goes to results. Expanded empty: re-focuses. */}
      <button
        onClick={handleIconClick}
        aria-label={
          isExpanded && value.trim()
            ? "Go to search results"
            : isExpanded
            ? "Focus search"
            : "Open search"
        }
        className="text-purple hover:text-magenta p-1 leading-none"
      >
        <SearchIcon fontSize="medium" />
      </button>
    </div>
  )
})
