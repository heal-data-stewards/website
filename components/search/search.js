import { Box, ClickAwayListener, Popper, useTheme } from "@mui/material"
import Link from "next/link"
import maxSize from "popper-max-size-modifier"
import { useState } from "react"
import {
  Highlight,
  Hits,
  InstantSearch,
  SearchBox,
  Snippet,
} from "react-instantsearch"

const applyMaxSize = {
  name: "applyMaxSize",
  enabled: true,
  phase: "beforeWrite",
  requires: ["maxSize"],
  fn({ state }) {
    // The `maxSize` modifier provides this data
    const { width, height } = state.modifiersData.maxSize

    state.styles.popper = {
      ...state.styles.popper,
      maxWidth: `${width - 16}px`,
      maxHeight: `${height - 16}px`,
    }
  },
}

export function Search({ searchClient, indexName }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const theme = useTheme()

  const open = anchorEl !== null

  const handleClickAway = (e) => {
    if (anchorEl && anchorEl.contains(e.target)) {
      return
    }

    setAnchorEl(null)
  }

  return (
    <InstantSearch
      aria-autocomplete="list"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls="search-listbox"
      searchClient={searchClient}
      indexName={indexName}
      insights
    >
      <SearchBox
        onInput={(e) => {
          setAnchorEl(e.currentTarget)
          const value = e.target.value

          if (value === "") {
            setAnchorEl(null)
          }
        }}
        onClick={(e) => {
          if (e.target.value !== "") {
            setAnchorEl(e.currentTarget)
          }
        }}
      />
      <ClickAwayListener onClickAway={handleClickAway}>
        <Popper
          open={open}
          id="search-listbox"
          role="listbox"
          anchorEl={anchorEl}
          placement="bottom-end"
          sx={{
            zIndex: 1500,
            width: 400,
            backgroundColor: "red",
            overflow: "auto",
            boxShadow: theme.shadows[4],
          }}
          modifiers={[maxSize, applyMaxSize]}
        >
          <Hits hitComponent={Hit} />
        </Popper>
      </ClickAwayListener>
    </InstantSearch>
  )
}

function Hit({ hit }) {
  return (
    <Box
      component={Link}
      href={hit.path}
      role="option"
      aria-selected={false}
      id={hit.route}
      sx={{
        p: 2,
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
    >
      <h1 className="text-base font-semibold">
        <Highlight attribute="title" hit={hit} />
      </h1>
      <p className="text-sm">
        <Snippet attribute="content" hit={hit} />
      </p>
    </Box>
  )
}
