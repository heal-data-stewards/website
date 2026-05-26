import { forwardRef } from "react"
import { OutlinedInput, InputAdornment, IconButton } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import CloseIcon from "@mui/icons-material/Close"

export const SearchInput = forwardRef(function SearchInput(
  {
    isExpanded,
    value,
    onChange,
    onExpand,
    onClose,
    onKeyDown,
    listboxId,
    isOpen,
    activeIndex,
  },
  ref
) {
  return (
    <div className="flex items-center">
      {/* Icon is always visible; expand trigger when collapsed, re-focus when expanded */}
      <button
        onClick={isExpanded ? () => ref.current?.focus() : onExpand}
        aria-label={isExpanded ? "Focus search" : "Open search"}
        className="text-purple hover:text-magenta p-1 leading-none"
      >
        <SearchIcon fontSize="medium" />
      </button>

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
          sx={{
            marginBottom: 0,
            backgroundColor: "white",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#532565",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#532565",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#532565",
              borderWidth: 2,
            },
          }}
        />
      </div>
    </div>
  )
})
