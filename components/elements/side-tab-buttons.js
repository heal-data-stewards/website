import { styled } from "@mui/material/styles"
//if id is the same as whats active, make it this color
export const Block = ({ title, onMouseEnter, isSelected, index }) => {
  return (
    <button
      aria-selected={isSelected}
      aria-controls={`tabpanel-${index}`}
      style={{
        fontSize: "1.1rem",
        fontWeight: "500",
        textAlign: "start",
        marginBottom: "15px",
        padding: "1rem 15px",
        // minHeight: "75px",
        background: isSelected
          ? "linear-gradient(315deg, transparent 17px, rgba(83, 37, 101, 1) 0)"
          : "linear-gradient(315deg, transparent 17px, rgb(229, 224, 231) 0)",
        cursor: "pointer",
        color: isSelected ? "#fff" : "rgba(83, 37, 101, 1)",
        maxWidth: "300px",
        display: "block",
        width: "-webkit-fill-available",
      }}
      className={"sensitive-data-blocks"}
      onClick={onMouseEnter}
    >
      {title}
    </button>
  )
}

export const ButtonBlockContainer = styled("div")({
  width: "50%",
  maxWidth: "350px",
  marginRight: "20px",
})

export const PanelContainer = styled("div")({
  width: "-webkit-fill-available",
})
