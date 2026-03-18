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
import { QueryCacheProvider } from "utils/use-query"
import { sendCustomEvent } from "utils/analytics"
import { getRandomSuggestions } from "./data/search-suggestions"

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

export default function SemanticSearch({ data }) {
  const router = useRouter()

  const path = typeof window !== "undefined" ? window.location.pathname : ""
  const searchLocation =
    path === "/resources/semantic-search"
      ? "HSS Landing Page"
      : path.startsWith("/resources/semantic-search/results")
      ? "HSS Results Page"
      : "unknown"

  const [searchInputValue, setSearchInputValue] = useState(
    getQueryParam(data.redirect_query_param) ?? ""
  )
  const [selectedSuggestions, setSelectedSuggestions] = useState(
    getRandomSuggestions(3)
  )

  // Fire event BEFORE navigation
  const searchTermHandler = (term) => {
    sendCustomEvent("hss_example_term_selected", {
      search_term: term,
      search_location: searchLocation,
    })

    router.push({
      pathname: data.redirect_url,
      query: { [data.redirect_query_param]: term },
    })
  }

  const submitSearch = (term) => {
    sendCustomEvent("hss_search_submitted", {
      search_term: term,
      search_location: searchLocation,
    })

    router.push({
      pathname: data.redirect_url,
      query: { [data.redirect_query_param]: term },
    })
  }

  const changeRandomSuggestions = useCallback(() => {
    setSelectedSuggestions(getRandomSuggestions(3))
  }, [setSelectedSuggestions])

  return (
    <QueryCacheProvider>
      <div className="bg-[#f4f1f5] w-full sm:py-16 py-10 sm:my-8">
        <div className="container text-[#8b3264] font-bold text-lg flex flex-col gap-4">
          <span className="text-xl">{data?.guide_text}</span>

          <form
            className="flex"
            onSubmit={(e) => {
              e.preventDefault()
              submitSearch(searchInputValue || "*")
            }}
          >
            <SearchBar
              id="search-bar"
              value={searchInputValue}
              onChange={(e) => {
                setSearchInputValue(e.target.value)
              }}
            />
            <SearchButton variant="contained" type="submit">
              {data?.button_text}
            </SearchButton>
          </form>

          <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center max-w-full">
            <span>Example terms to search for:</span>
            <div className="flex gap-2 max-w-full overflow-auto">
              <Tooltip
                title="Generate new example search terms."
                placement="bottom"
              >
                <IconButton onClick={changeRandomSuggestions}>
                  <Refresh />
                </IconButton>
              </Tooltip>
              <div className="flex gap-4 text-white">
                {selectedSuggestions.map((term) => (
                  <Button
                    variant="contained"
                    key={term}
                    sx={{ whiteSpace: "nowrap" }}
                    onMouseDown={() => {
                      setSearchInputValue(term)
                      searchTermHandler(term)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSearchInputValue(term)
                        searchTermHandler(term)
                      }
                    }}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueryCacheProvider>
  )
}
