import createCache from "@emotion/cache"

export default function createEmotionCache() {
  let insertionPoint

  if (typeof document !== "undefined") {
    const emotionInsertionPoint = document.querySelector(
      'meta[name="emotion-insertion-point"]'
    )
    insertionPoint = emotionInsertionPoint ?? undefined
  }

  return createCache({ key: "css", insertionPoint })
}
