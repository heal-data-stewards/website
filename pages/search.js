import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/router"
import { liteClient as algoliasearch } from "algoliasearch/lite"
import {
  InstantSearch,
  useSearchBox,
  useHits,
  useStats,
  Configure,
} from "react-instantsearch"
import { OutlinedInput, InputAdornment, IconButton } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import CloseIcon from "@mui/icons-material/Close"
import Layout from "@/components/layout"
import { SearchResultsHit } from "@/components/search/search-results-hit"
import { searchInputSx } from "@/components/search/search-styles"

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
)

const PAGE_CONTEXT = { isFullscreen: false }

export default function SearchPage({ global }) {
  return (
    <Layout global={global} pageContext={PAGE_CONTEXT}>
      <InstantSearch
        searchClient={searchClient}
        indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
      >
        <Configure hitsPerPage={20} />
        <SearchResultsContent />
      </InstantSearch>
    </Layout>
  )
}

function SearchResultsContent() {
  const { query, refine } = useSearchBox()
  const { hits } = useHits()
  const { nbHits } = useStats()
  const router = useRouter()

  // inputValue tracks the text field; query tracks what Algolia has committed.
  // They only sync on submit so rapid typing doesn't fire a request per keystroke.
  const [inputValue, setInputValue] = useState("")
  const seeded = useRef(false)

  // Seed both input and Algolia from the URL once the router is ready
  useEffect(() => {
    if (!router.isReady || seeded.current) return
    seeded.current = true
    const q = typeof router.query.q === "string" ? router.query.q : ""
    setInputValue(q)
    if (q) refine(q)
  }, [router.isReady]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e) => {
    e.preventDefault()
    refine(inputValue)
    router.replace(
      { pathname: "/search", query: inputValue ? { q: inputValue } : {} },
      undefined,
      { shallow: true }
    )
  }

  const handleClear = () => {
    setInputValue("")
    refine("")
    router.replace({ pathname: "/search" }, undefined, { shallow: true })
  }

  return (
    <div className="container py-8 max-w-3xl">
      <form onSubmit={handleSubmit}>
        <OutlinedInput
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a search term and press Enter"
          autoFocus
          autoComplete="off"
          aria-label="Search"
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#532565" }} />
            </InputAdornment>
          }
          endAdornment={
            inputValue ? (
              <InputAdornment position="end">
                <IconButton onClick={handleClear} aria-label="Clear search" edge="end">
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ) : null
          }
          sx={searchInputSx}
        />
      </form>

      {query && (
        <p className="text-gray text-[13.125px] mt-3">
          {nbHits} result{nbHits !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
        </p>
      )}

      {hits.length > 0 && (
        <ul className="mt-2 divide-y divide-gray-light">
          {hits.map((hit) => (
            <SearchResultsHit key={hit.objectID} hit={hit} />
          ))}
        </ul>
      )}

      {query && hits.length === 0 && (
        <p className="text-gray mt-8 text-center">
          No results for &ldquo;{query}&rdquo;
        </p>
      )}
    </div>
  )
}
