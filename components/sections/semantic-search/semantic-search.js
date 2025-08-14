import { Button, IconButton, OutlinedInput, styled } from "@mui/material"
import PageTitle from "../page-title"
import { useMemo, useState } from "react"
import { Results } from "./results"
import { QueryCacheProvider } from "utils/use-query"
import { Refresh } from "@mui/icons-material"
import { useCallback } from "react"
import { useRouter } from "next/router"

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

export default function SemanticSearch({ data }) {
  const router = useRouter()

  const [searchInputValue, setSearchInputValue] = useState("")
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
      <div className="bg-[#f4f1f5] w-full px-11 py-16 my-8">
        <div className="container text-[#8b3264] font-bold text-lg flex flex-col gap-4">
          <span className="text-xl">{data?.guide_text}</span>

          <div className="flex">
            <SearchBar
              id="search-bar"
              value={searchInputValue}
              onChange={(e) => {
                setSearchInputValue(e.target.value)
              }}
            />
            <SearchButton
              variant="contained"
              onClick={() => {
                searchTermHandler(searchInputValue)
              }}
            >
              {data?.button_text}
            </SearchButton>
          </div>
          <div className="flex gap-2 items-center">
            <span>Example terms to search for:</span>
            <ul className="flex gap-4 text-white">
              {selectedSuggestions.map((term) => (
                <Button
                  variant="contained"
                  key={term}
                  onClick={() => {
                    searchTermHandler(term)
                    setSearchInputValue(term)
                  }}
                >
                  {term}
                </Button>
              ))}
            </ul>
            <IconButton onClick={changeRandomSuggestions}>
              <Refresh />
            </IconButton>
          </div>
        </div>
      </div>
    </QueryCacheProvider>
  )
}
