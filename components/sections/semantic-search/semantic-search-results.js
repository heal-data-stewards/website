import { QueryCacheProvider } from "utils/use-query"
import { Results } from "./results"

const SemanticSearchResults = ({ data }) => {
  return (
    <QueryCacheProvider>
      <Results queryParam={data.query_param} />
    </QueryCacheProvider>
  )
}

export default SemanticSearchResults
