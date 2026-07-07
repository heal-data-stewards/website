import { Bookmark, BookmarkBorder } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { useCollectionContext } from "../context/collection"
import { trackBookmarkClick } from "../analytics"

export function BookmarkButton({
  entity,
  collectionKey,
  panelLocation,
  uiSurface,
  searchTerm,
  size = "small",
  ...iconButtonProps
}) {
  const collection = useCollectionContext()
  const entityCollection = collection[collectionKey]

  return (
    <IconButton
      size={size}
      {...iconButtonProps}
      onClick={(e) => {
        e.stopPropagation()
        const isBookmarked = entityCollection.has(entity)
        entityCollection.toggle(entity)
        trackBookmarkClick({
          action: isBookmarked ? "remove" : "add",
          entity,
          panelLocation,
          uiSurface,
          referringSearchTerm: searchTerm,
        })
      }}
    >
      {entityCollection.has(entity) ? (
        <Bookmark fontSize={size} sx={{ color: "#4d2862" }} />
      ) : (
        <BookmarkBorder fontSize={size} sx={{ color: "#4d2862" }} />
      )}
    </IconButton>
  )
}
