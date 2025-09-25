import { useLocalStorage } from "utils/use-local-storage"

const { createContext, useContext } = require("react")

const CollectionContext = createContext({})

function createCollectionFns(items, setItems) {
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
        studies: createCollectionFns(studies, setStudies),
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
