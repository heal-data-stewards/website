import { InstantSearch } from "react-instantsearch"
import { SearchCombobox } from "./search-combobox"

export function Search({ searchClient, indexName }) {
  return (
    <InstantSearch searchClient={searchClient} indexName={indexName} insights>
      <SearchCombobox />
    </InstantSearch>
  )
}
