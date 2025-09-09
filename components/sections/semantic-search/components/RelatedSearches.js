import { SearchRounded } from "@mui/icons-material"
import { useRouter } from "next/router"
import Link from "../../../elements/link"

const RELATED = ["Chronic Pain", "Migraine", "Headache"]

export function RelatedSearches({ queryParam }) {
  const router = useRouter()

  return (
    <div className="border-solid border-[1px] border-gray-200 shadow-md p-4 rounded-md">
      <div className="flex items-center gap-2 text-[#4d2862]">
        <SearchRounded fontSize="medium" />
        <h3 className="text-lg font-semibold">People also searched for</h3>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col">
        {RELATED.map((term) => (
          <Link
            to={`/resources/semanticsearch/results?${new URLSearchParams({
              q: term,
            })}`}
            key={term}
          >
            {term}
          </Link>
        ))}
      </div>
    </div>
  )
}
