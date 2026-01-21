import { Refresh } from "@mui/icons-material"
import {
  Button,
  IconButton,
  OutlinedInput,
  styled,
  Tooltip,
} from "@mui/material"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { backgroundColor } from "tailwindcss/defaultTheme"
import { QueryCacheProvider } from "utils/use-query"
import { sendCustomEvent } from "utils/analytics"
import { getRandomSuggestions } from "../data/search-suggestions"
import Link from "next/link"

const SearchBar = styled(OutlinedInput)(() => ({
  marginBottom: "0",
  borderTopRightRadius: "0",
  borderBottomRightRadius: "0",
  backgroundColor: "white",
  flex: 1,
}))

const SearchButton = styled(Button)(() => ({
  borderTopLeftRadius: "0",
  borderBottomLeftRadius: "0",

  ["&.Mui-disabled"]: {
    color: "#f4f4f4",
    backgroundColor: "#bdbbbe !important",
  },
}))

function getQueryParam(param) {
  if (typeof window === "undefined") return null
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

export function IntegratedSearchBar({
  redirectUrl,
  redirectQueryParam,
  buttonText,
  guideText,
}) {
  const router = useRouter()

  const path = typeof window !== "undefined" ? window.location.pathname : ""
  const searchLocation =
    path === "/resources/semantic-search"
      ? "HSS Landing Page"
      : path.startsWith("/resources/semantic-search/results")
      ? "HSS Results Page"
      : "Unknown"

  const [searchInputValue, setSearchInputValue] = useState(
    getQueryParam(redirectQueryParam) ?? ""
  )
  const [selectedSuggestions, setSelectedSuggestions] = useState(
    getRandomSuggestions(3)
  )

  const searchTermHandler = (term) => {
    router.push({
      pathname: redirectUrl,
      query: { [redirectQueryParam]: term },
    })
  }

  const changeRandomSuggestions = useCallback(() => {
    setSelectedSuggestions(getRandomSuggestions(3))
  }, [setSelectedSuggestions])

  return (
    <div className="bg-[#f2eff3] p-4">
      <div className="container flex flex-col gap-1">
        <form
          className="flex"
          onSubmit={(e) => {
            e.preventDefault()
            searchTermHandler(searchInputValue)
            sendCustomEvent("hss_search_submitted", {
              search_term: searchInputValue,
              search_location: searchLocation,
            })
          }}
        >
          <SearchBar
            id="search-bar"
            value={searchInputValue}
            placeholder={guideText}
            size="small"
            onChange={(e) => {
              setSearchInputValue(e.target.value)
            }}
          />
          <SearchButton
            variant="contained"
            type="submit"
            disabled={searchInputValue === ""}
          >
            {buttonText}
          </SearchButton>
        </form>

        <div className="flex items-center gap-1">
          <Tooltip
            title="Generate new example search terms."
            placement="bottom"
          >
            <IconButton onClick={changeRandomSuggestions} size="small">
              <Refresh fontSize="small" />
            </IconButton>
          </Tooltip>
          <span>
            Example terms to search for:{" "}
            {selectedSuggestions.reduce((arr, term, i) => {
              const link = (
                <span
                  className="cursor-pointer text-[#982568] hover:underline font-semibold"
                  onClick={() => {
                    sendCustomEvent("hss_example_term_selected", {
                      search_term: term,
                      search_location: searchLocation,
                    })
                    searchTermHandler(term)
                    setSearchInputValue(term)
                  }}
                >
                  {term}
                </span>
              )

              return i === selectedSuggestions.length - 1
                ? [...arr, link]
                : [...arr, link, <span key={term}> | </span>]
            }, [])}
          </span>
        </div>
      </div>
    </div>
  )
}
