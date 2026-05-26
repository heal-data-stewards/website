import Link from "next/link"
import { Highlight, Snippet } from "react-instantsearch"

// Tailwind classes that override instantsearch satellite theme highlight styles
const highlightClass = [
  "[&_.ais-Highlight-highlighted]:bg-blue-100",
  "[&_.ais-Highlight-highlighted]:text-purple",
  "[&_.ais-Highlight-highlighted]:not-italic",
].join(" ")

const snippetHighlightClass = [
  "[&_.ais-Snippet-highlighted]:bg-blue-100",
  "[&_.ais-Snippet-highlighted]:text-gray-dark",
  "[&_.ais-Snippet-highlighted]:not-italic",
  "[&_.ais-Snippet-highlighted]:font-semibold",
].join(" ")

export function SearchHit({ id, hit, isActive, onSelect }) {
  return (
    <li id={id} role="option" aria-selected={isActive}>
      <Link
        href={hit.path}
        onClick={onSelect}
        className={[
          "block px-4 py-3 no-underline border-l-[6px] transition-colors",
          isActive
            ? "border-l-purple"
            : "border-l-transparent hover:border-l-purple",
        ].join(" ")}
      >
        <span
          className={`text-purple font-semibold text-base ${highlightClass}`}
        >
          <Highlight attribute="title" hit={hit} />
        </span>
        <div className="text-gray text-[13.125px] mt-0.5">{hit.path}</div>
        <p
          className={`text-gray-dark text-[13.125px] mt-1 line-clamp-2 m-0 ${snippetHighlightClass}`}
        >
          <Snippet attribute="content" hit={hit} />
        </p>
      </Link>
    </li>
  )
}
