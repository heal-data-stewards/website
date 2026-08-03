import { trackLeftListClick, UI_SURFACES } from "../analytics"
import { BookmarkButton } from "./BookmarkButton"

export function EntitySidebarItem({
  entity,
  collectionKey,
  panelLocation,
  searchTerm,
  onClick,
  active,
  title,
  bookmarkSx,
  children,
}) {
  const handleClick = () => {
    trackLeftListClick({
      entity,
      panelLocation,
      referringSearchTerm: searchTerm,
      uiSurface: UI_SURFACES.LEFT_LIST,
    })

    onClick()
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleClick()
        }
      }}
      className={
        `w-full p-4 border-b border-gray-200 cursor-pointer text-left` +
        (active ? " bg-[#eeecf0]" : "")
      }
    >
      <div className="flex gap-2 items-start justify-between">
        {title}
        <BookmarkButton
          entity={entity}
          collectionKey={collectionKey}
          panelLocation={panelLocation}
          uiSurface={UI_SURFACES.LEFT_LIST}
          searchTerm={searchTerm}
          size="small"
          sx={bookmarkSx}
        />
      </div>
      {children}
    </div>
  )
}
