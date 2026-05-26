import { SearchHit } from "./search-hit"

export function SearchDropdown({ id, hits, activeIndex, onHitSelect }) {
  return (
    <ul
      id={id}
      role="listbox"
      aria-label="Search results"
      className="absolute right-0 mt-1 w-[28rem] max-w-[calc(100vw-2rem)] bg-white rounded shadow-lg border border-gray-light divide-y divide-gray-light z-[1200] overflow-y-auto max-h-[70vh]"
    >
      {hits.map((hit, index) => (
        <SearchHit
          key={hit.objectID}
          id={`search-hit-${index}`}
          hit={hit}
          isActive={activeIndex === index}
          onSelect={onHitSelect}
        />
      ))}
    </ul>
  )
}
