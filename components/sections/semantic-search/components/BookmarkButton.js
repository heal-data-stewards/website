import { Bookmark, BookmarkBorder } from "@mui/icons-material"
import { IconButton, Tooltip } from "@mui/material"
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
  const isBookmarked = entityCollection.has(entity)

  return (
    <Tooltip
      title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
      placement="top"
    >
      <IconButton
        size={size}
        {...iconButtonProps}
        onClick={(e) => {
          e.stopPropagation()
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
        {isBookmarked ? (
          <Bookmark fontSize={size} sx={{ color: "#4d2862" }} />
        ) : (
          <BookmarkBorder fontSize={size} sx={{ color: "#4d2862" }} />
        )}
      </IconButton>
    </Tooltip>
  )
}
