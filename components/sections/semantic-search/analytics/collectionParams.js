const COLLECTION_ENTITY_KEYS = {
  studies: "study",
  cdes: "cde",
  concepts: "concept",
  variables: "variable",
}

function stringify(value) {
  return JSON.stringify(value)
}

export function buildCollectionAnalyticsParams(collection) {
  const params = Object.entries(COLLECTION_ENTITY_KEYS).reduce(
    (params, [entityKey, singularEntityKey]) => {
      const entityAnalytics = collection[entityKey]

      return {
        ...params,
        [`collection_${singularEntityKey}_ids`]: stringify(entityAnalytics.ids),
        [`collection_${singularEntityKey}_labels`]: stringify(
          entityAnalytics.labels
        ),
        [`collection_${singularEntityKey}_count`]: entityAnalytics.count,
      }
    },
    {}
  )

  const collectionSnapshot = Object.entries(COLLECTION_ENTITY_KEYS).reduce(
    (snapshot, [entityKey, singularEntityKey]) => ({
      ...snapshot,
      [`${singularEntityKey}_count`]: collection[entityKey].count,
    }),
    {}
  )

  return {
    ...params,
    collection_snapshot: stringify(collectionSnapshot),
  }
}

export function buildDownloadedCollectionAnalyticsParams(collection) {
  const params = Object.entries(COLLECTION_ENTITY_KEYS).reduce(
    (params, [entityKey, singularEntityKey]) => {
      const entityAnalytics = collection[entityKey]

      return {
        ...params,
        [`downloaded_collection_${singularEntityKey}_ids`]: stringify(
          entityAnalytics.ids
        ),
        [`downloaded_collection_${singularEntityKey}_labels`]: stringify(
          entityAnalytics.labels
        ),
        [`downloaded_collection_${singularEntityKey}_count`]:
          entityAnalytics.count,
      }
    },
    {}
  )

  const collectionSnapshot = Object.entries(COLLECTION_ENTITY_KEYS).reduce(
    (snapshot, [entityKey, singularEntityKey]) => ({
      ...snapshot,
      [`${singularEntityKey}_count`]: collection[entityKey].count,
    }),
    {}
  )

  return {
    ...params,
    downloaded_collection_snapshot: stringify(collectionSnapshot),
  }
}
