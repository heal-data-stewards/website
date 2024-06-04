import { styled } from "@mui/material/styles"
import { Box } from "@mui/material"

export const Block = ({ title, onMouseEnter, isSelected, index }) => {
  return (
    <button
      role="tab"
      aria-controls={`tabpanel-${index}`}
      style={{
        fontSize: "1.1rem",
        fontWeight: "500",
        textAlign: "start",
        marginBottom: "15px",
        padding: "1rem 15px",
        background: isSelected
          ? "linear-gradient(315deg, transparent 17px, rgba(83, 37, 101, 1) 0)"
          : "linear-gradient(315deg, transparent 17px, rgb(229, 224, 231) 0)",
        cursor: "pointer",
        color: isSelected ? "#fff" : "rgba(83, 37, 101, 1)",
      }}
      className={"sensitive-data-blocks"}
      onClick={onMouseEnter}
    >
      {title}
    </button>
  )
}

export const ButtonBlockContainer = styled(Box)({
  marginRight: "20px",
  flex: 1,
})

export const PanelContainer = styled(Box)({
  flex: 4,
})
