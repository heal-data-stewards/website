import { Refresh } from "@mui/icons-material"
import { Button, IconButton, OutlinedInput, styled } from "@mui/material"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { QueryCacheProvider } from "utils/use-query"

const SUGGESTIONS = [
  "addiction treatment",
  "buprenorphine",
  "chronic pain",
  "cognitive behavioral therapy",
  "depression",
  "fibromyalgia",
  "GAD 7",
  "lower back pain",
  "migraine",
  "naloxone",
  "neuropathic pain",
  "osteoarthritis",
  "opioid use disorder",
  "pain management",
  "physical therapy",
]

const getRandomSuggestions = (count) =>
  SUGGESTIONS.sort(() => 0.5 - Math.random()).slice(0, count)

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
}))

function getQueryParam(param) {
  if (typeof window === "undefined") return null
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(param)
}

export default function SemanticSearch({ data }) {
  const router = useRouter()

  const [searchInputValue, setSearchInputValue] = useState(
    getQueryParam(data.redirect_query_param) ?? ""
  )
  const [selectedSuggestions, setSelectedSuggestions] = useState(
    getRandomSuggestions(3)
  )

  const searchTermHandler = (term) => {
    router.push({
      pathname: "/resources/semanticsearch/results",
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
              searchTermHandler(searchInputValue)
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
              <div className="flex gap-4 text-white">
                {selectedSuggestions.map((term) => (
                  <Button
                    variant="contained"
                    key={term}
                    sx={{ whiteSpace: "nowrap" }}
                    onClick={() => {
                      searchTermHandler(term)
                      setSearchInputValue(term)
                    }}
                  >
                    {term}
                  </Button>
                ))}
              </div>
              <IconButton onClick={changeRandomSuggestions}>
                <Refresh />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </QueryCacheProvider>
  )
}
