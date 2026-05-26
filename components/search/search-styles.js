// Shared Algolia highlight override classes and MUI input styling

export const titleHighlightClass = [
  "[&_.ais-Highlight-highlighted]:bg-blue-100",
  "[&_.ais-Highlight-highlighted]:text-purple",
  "[&_.ais-Highlight-highlighted]:not-italic",
].join(" ")

export const snippetHighlightClass = [
  "[&_.ais-Snippet-highlighted]:bg-blue-100",
  "[&_.ais-Snippet-highlighted]:text-gray-dark",
  "[&_.ais-Snippet-highlighted]:not-italic",
  "[&_.ais-Snippet-highlighted]:font-semibold",
].join(" ")

// Purple-bordered OutlinedInput styling, shared between navbar and results page.
// marginBottom: 0 cancels the body1 spread in MUI's InputBase root styles.
export const searchInputSx = {
  marginBottom: 0,
  backgroundColor: "white",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#532565",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#532565",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#532565",
    borderWidth: 2,
  },
}
