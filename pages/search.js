import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/router"
import { liteClient as algoliasearch } from "algoliasearch/lite"
import {
  InstantSearch,
  useSearchBox,
  useHits,
  useStats,
  usePagination,
  Configure,
} from "react-instantsearch"
import { OutlinedInput, InputAdornment, IconButton } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import CloseIcon from "@mui/icons-material/Close"
import Layout from "@/components/layout"
import { SearchResultsHit } from "@/components/search/search-results-hit"

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
        <Configure hitsPerPage={10} />
        <SearchResultsContent />
      </InstantSearch>
    </Layout>
  )
}

function SearchResultsContent() {
  const { query, refine } = useSearchBox()
  const { items: hits } = useHits()
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
      <form onSubmit={handleSubmit} className="flex">
        <OutlinedInput
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
                <IconButton
                  onClick={handleClear}
                  aria-label="Clear search"
                  edge="end"
                >
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ) : null
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
          type="submit"
          className="shrink-0 px-4 rounded-r font-semibold bg-purple text-white hover:bg-magenta transition-colors self-stretch"
        >
          Search
        </button>
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

      {hits.length > 0 && <SearchPagination />}
    </div>
  )
}

function SearchPagination() {
  const { pages, currentRefinement, nbPages, isFirstPage, isLastPage, refine } =
    usePagination({ padding: 2 })

  if (nbPages <= 1) return null

  const goTo = (page) => {
    refine(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const btnBase =
    "min-w-[2rem] h-8 px-2 rounded text-sm font-semibold transition-colors"
  const activeBtn = `${btnBase} bg-purple text-white`
  const inactiveBtn = `${btnBase} text-purple hover:text-magenta`
  const disabledBtn = `${btnBase} text-gray-light cursor-not-allowed`

  const showLeadingEllipsis = pages[0] > 1
  const showTrailingEllipsis = pages[pages.length - 1] < nbPages - 2

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 mt-8 mb-4"
    >
      <button
        onClick={() => goTo(currentRefinement - 1)}
        disabled={isFirstPage}
        className={isFirstPage ? disabledBtn : inactiveBtn}
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {pages[0] > 0 && (
        <>
          <button onClick={() => goTo(0)} className={inactiveBtn}>
            1
          </button>
          {showLeadingEllipsis && (
            <span className="px-1 text-gray text-sm">…</span>
          )}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => goTo(page)}
          className={page === currentRefinement ? activeBtn : inactiveBtn}
          aria-current={page === currentRefinement ? "page" : undefined}
        >
          {page + 1}
        </button>
      ))}

      {pages[pages.length - 1] < nbPages - 1 && (
        <>
          {showTrailingEllipsis && (
            <span className="px-1 text-gray text-sm">…</span>
          )}
          <button onClick={() => goTo(nbPages - 1)} className={inactiveBtn}>
            {nbPages}
          </button>
        </>
      )}

      <button
        onClick={() => goTo(currentRefinement + 1)}
        disabled={isLastPage}
        className={isLastPage ? disabledBtn : inactiveBtn}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  )
}
