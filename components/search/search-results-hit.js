import Link from "next/link"
import { Highlight, Snippet } from "react-instantsearch"
import { titleHighlightClass, snippetHighlightClass } from "./search-styles"

export function SearchResultsHit({ hit }) {
  return (
    <li>
      <Link
        href={hit.path}
        className={[
          "block py-5 no-underline border-l-[6px] pl-4 transition-colors",
          "border-l-transparent hover:border-l-purple",
        ].join(" ")}
      >
        <span
          className={`text-purple font-semibold text-xl ${titleHighlightClass}`}
        >
          <Highlight attribute="title" hit={hit} />
        </span>
        <div className="text-gray text-[13.125px] mt-0.5">{hit.path}</div>
        <p
          className={`text-gray-dark text-sm mt-1 line-clamp-3 m-0 ${snippetHighlightClass}`}
        >
          <Snippet attribute="content" hit={hit} />
        </p>
      </Link>
    </li>
  )
}
