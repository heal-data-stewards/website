import { useCallback, useEffect, useMemo } from "react"
import lunr, { tokenizer as lunrTokenizer } from "lunr"

export const useLunr = (initIndex, populateIndex) => {
  const index = useMemo(() => {
    const idx = lunr(function () {
      initIndex.call(this)
      populateIndex.call(null, this)
    })
    return idx
  }, [initIndex, populateIndex])
  // Takes a lexical search, i.e. a user inputted search query, transforms it into a lunr search query, and executes the search.
  const lexicalSearch = useCallback(
    (
      searchQuery,
      options = {
        /**
         * Can be either a number or a function with signature (term: string) => number (e.g. if you want to increase fuzziness for longer terms)
         * By default, use fuzziness of 1 character and give an extra character of fuzziness to terms longer than 4 characters.
         *
         * NOTE: Lunr stems each word before it makes it into the index. This means that the edit distance may be more forgiving
         * than specified. For example: `interim` and `interval` have an LD of 3. However, when stemmed, we get `interim` => `interim`
         * and `interval` => `interv` and `interim/interv` only have an LD of 2.
         */
        fuzziness: (term) => (term.length >= 5 ? 2 : 1),
        prefixSearch: true,
      }
    ) => {
      const {
        prefixSearch = true,
        fuzziness = (term) => (term.length >= 5 ? 2 : 1),
      } = options
      const tokens = lunrTokenizer(searchQuery)

      // Build tokenized search terms into a generalized lunr query with fuzziness and prefix search.
      const results = index.query(function (q) {
        tokens.forEach(({ str: token }) => {
          // Basic search
          q.term(token, { boost: 100 })
          if (prefixSearch) {
            // Trailing wildcard search (prefix search)
            q.term(token, {
              boost: 10,
              usePipeline: false,
              wildcard: lunr.Query.wildcard.TRAILING,
            })
          }
          if (fuzziness) {
            // Fuzzy search without prefix
            q.term(token, {
              boost: 1,
              usePipeline: false,
              editDistance:
                typeof fuzziness === "function"
                  ? fuzziness.call(null, token)
                  : fuzziness,
            })
          }
        })
      })
      return results
    },
    [index]
  )
  return {
    index,
    lexicalSearch,
  }
}

export const useLunrSearch = ({
  index: { ref, fields, tokenSeparator = undefined },
  docs,
}) => {
  const initIndex = useCallback(
    function () {
      this.ref(ref)
      fields.forEach((field) => {
        this.field(field)
      })
      this.metadataWhitelist = ["position"]
      // Lunr has really bad docs for how the engine tokenizes text.
      // As far as I can tell, Lunr strictly uses pattern-based tokenization.
      // All punctuation marks and whitespace separate fields into tokens (by default it is only whitespace and hyphens).
      const separators = `\\s,\\.<>{}\\[\\]"':;!@#\\$%\\^&\\*\\(\\)-_\\+=~`
      if (tokenSeparator) {
        this.tokenizer.separator = tokenSeparator
      } else this.tokenizer.separator = new RegExp("[" + separators + "]")
    },
    [docs, ref, fields, tokenSeparator]
  )

  const populateIndex = useCallback(
    (index) => {
      docs.forEach((doc) => index.add(doc))
    },
    [docs]
  )

  const { index, lexicalSearch: lunrLexicalSearch } = useLunr(
    initIndex,
    populateIndex
  )

  const docMap = useMemo(() => {
    const map = new Map()
    docs.forEach((doc) => map.set(doc[ref], doc))
    return map
  }, [docs, ref])

  const getDocByRef = useCallback((ref) => docMap.get(ref), [docMap])

  const lexicalSearch = useCallback(
    (...args) => {
      const result = lunrLexicalSearch(...args)
      const searchTokens = []
      result.forEach(({ ref: id, score, matchData: { metadata } }) => {
        // `ref` is always a string, so the doc ref needs to be converted to a string.
        const doc = getDocByRef(id)
        Object.entries(metadata).forEach(([partialTerm, hitFields]) => {
          Object.entries(hitFields).forEach(([field, meta]) => {
            const {
              position: [[start, length]],
            } = meta
            const fieldValue = doc[field]
            const fullTerm = fieldValue.slice(start, start + length)
            searchTokens.push(fullTerm)
          })
        })
      })
      return { hits: result, tokens: searchTokens }
    },
    [docs, getDocByRef, lunrLexicalSearch]
  )

  return {
    index,
    lexicalSearch,
  }
}
