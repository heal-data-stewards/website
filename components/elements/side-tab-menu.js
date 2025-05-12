import { styled } from "@mui/material/styles"
import { Box } from "@mui/material"
import { OpenInNew } from "@mui/icons-material"

const getBlockStyles = ({ isSelected }) => ({
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
})

export const Block = ({ title, url, onClick, isSelected, index }) => {
  return !url ? (
    <Tab
      title={title}
      index={index}
      isSelected={isSelected}
      onClick={onClick}
    />
  ) : (
    <LinkTab title={title} url={url} />
  )
}

const Tab = ({ title, onClick, isSelected, index }) => {
  return (
    <button
      role="tab"
      aria-controls={`tabpanel-${index}`}
      style={getBlockStyles({ isSelected })}
      className={"sensitive-data-blocks"}
      onClick={onClick}
    >
      {title}
    </button>
  )
}

const LinkTab = ({ title, url }) => {
  return (
    <a
      style={{
        ...getBlockStyles({ isSelected: false }),
        display: "flex",
      }}
      className={"sensitive-data-blocks"}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {title}
      <OpenInNew />
    </a>
  )
}

export const ButtonBlockContainer = styled(Box)({
  marginRight: "20px",
  flex: 1,
})

export const PanelContainer = styled(Box)({
  flex: 4,
})
