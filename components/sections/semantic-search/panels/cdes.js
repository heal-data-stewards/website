import { Download } from "@mui/icons-material"
import { CircularProgress, IconButton, styled } from "@mui/material"
import { useState } from "react"
import { useQuery } from "utils/use-query"
import { VariableQuestionDisplay } from "../components/VariableQuestionDisplay"
import { fetchCDEs } from "../data/cdes"
import { ParentStudiesDisplay } from "../components/ParentStudiesDisplay"

export const CDEsPanel = ({ searchTerm }) => {
  const payload = {
    query: searchTerm,
  }

  const cdesQuery = useQuery({
    queryFn: () => {
      if (!searchTerm) return null
      return fetchCDEs(payload)
    },
    queryKey: `cdes-${JSON.stringify(payload)}`,
  })

  const [activeSidebarItem, setActiveSidebarItem] = useState(0)

  if (cdesQuery.isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <CircularProgress />
      </div>
    )
  }

  if (cdesQuery.error) {
    return (
      <div className="h-full flex items-center justify-center rounded-lg bg-red-50 p-4 font-bold text-lg">
        <span className="text-red-600">Error loading results</span>
      </div>
    )
  }

  if (cdesQuery.data === null) {
    return null
  }

  const cdes = cdesQuery.data.results
  if (cdes.length < 1)
    return (
      <div className="w-full h-full flex items-center justify-center p-2">
        <span className="italic">No CDEs found</span>
      </div>
    )
  const activeCde = cdes[activeSidebarItem]

  return (
    <div className="flex flex-row max-h-full">
      <div className="min-w-[200px] max-w-[400px] flex flex-col min-h-0 overflow-auto">
        {cdes.map((cde, index) => (
          <SidebarItem
            key={cde.id}
            name={cde.name}
            id={cde.id}
            description={cde.description}
            onClick={() => setActiveSidebarItem(index)}
            active={activeSidebarItem === index}
          />
        ))}
      </div>
      <div className="flex-1 p-4 min-h-0 overflow-auto">
        <div className="flex gap-2">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold leading-relaxed text-[#592963]">
              {activeCde.name}{" "}
            </h2>
            <p className="text-lg text-gray-500 font-normal">{activeCde.id}</p>
          </div>
        </div>
        <p className="mt-4">{activeCde.description}</p>

        <hr className="my-4" />

        <h3 className="text-xl font-semibold mt-6 mb-1">Measures</h3>
        <VariableQuestionDisplay variableList={activeCde.variable_list} />

        <ParentStudiesDisplay studyIds={activeCde.parents} />

        <h3 className="text-xl font-semibold mt-6 mb-2">Downloads</h3>
        {activeCde.metadata.urls.length === 0 ? (
          <p className="text-gray-400 italic">
            No downloads found for this CDE
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {activeCde.metadata.urls.map((url) => (
              <DownloadCard
                className="p-4 flex gap-1 shadow-md transition-all duration-150 rounded-md border-[1px] border-gray-200"
                key={url.filename}
                href={url.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-500 mb-1">
                    {url.filename}
                  </p>
                  <p>{url.description}</p>
                </div>
                <Download />
              </DownloadCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const DownloadCard = styled("a")`
  &:hover {
    background-color: #fafafa;
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`

function SidebarItem({ name, description, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={
        `p-4 border-b border-gray-200 cursor-pointer text-left` +
        (active ? " bg-[#eeecf0]" : "")
      }
    >
      <div className="flex gap-2 items-start justify-between">
        <h4 className="font-semibold">{name}</h4>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </button>
  )
}
