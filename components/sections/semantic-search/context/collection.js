import { useLocalStorage } from "utils/use-local-storage"
import { generateStudiesCsv } from "./csv/studies"

const { createContext, useContext } = require("react")

const CollectionContext = createContext({})

function createCollectionFns(items, setItems, generateCsv) {
  return {
    list: items,
    add(item) {
      setItems((prev) => [...prev, item])
    },
    remove(item) {
      setItems((prev) => prev.filter((s) => s.id !== item.id))
    },
    has(item) {
      return items.some((s) => s.id === item.id)
    },
    toggle(item) {
      setItems((prev) => {
        const exists = prev.some((s) => s.id === item.id)
        return exists ? prev.filter((s) => s.id !== item.id) : [...prev, item]
      })
    },
    downloadCsv(filename) {
      const csvContent = generateCsv(this.list)
      const blob = new Blob([csvContent], {
        type: "text/csv",
      })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `${filename}.csv`
      a.click()
      URL.revokeObjectURL(url)
    },
  }
}

export const CollectionContextProvider = ({ children }) => {
  const [studies, setStudies] = useLocalStorage("collection-studies", [])
  const [concepts, setConcepts] = useLocalStorage("collection-concepts", [])
  const [cdes, setCdes] = useLocalStorage("collection-cdes", [])
  const [variables, setVariables] = useLocalStorage("collection-variables", [])

  return (
    <CollectionContext.Provider
      value={{
        studies: createCollectionFns(studies, setStudies, generateStudiesCsv),
        concepts: createCollectionFns(concepts, setConcepts),
        cdes: createCollectionFns(cdes, setCdes),
        variables: createCollectionFns(variables, setVariables),
        downloadAll() {
          const data = {
            studies,
            concepts,
            cdes,
            variables,
          }
          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          })
          const url = URL.createObjectURL(blob)

          const a = document.createElement("a")
          a.href = url
          a.download = "collection.json"
          a.click()
          URL.revokeObjectURL(url)
        },
        clearAll() {
          setStudies([])
          setConcepts([])
          setCdes([])
          setVariables([])
        },
        hasItems:
          studies.length > 0 ||
          concepts.length > 0 ||
          cdes.length > 0 ||
          variables.length > 0,
      }}
    >
      {children}
    </CollectionContext.Provider>
  )
}

export const useCollectionContext = () => {
  const context = useContext(CollectionContext)
  if (context === undefined)
    throw new Error(
      "useCollectionContext must be used under a CollectionContext"
    )
  return context
}
