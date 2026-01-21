import { styled } from "@mui/material/styles"
import { Box } from "@mui/material"
import { OpenInNew } from "@mui/icons-material"
import trackTabClick from "./analytics/track-tab-click"

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
  const handleClick = () => {
    trackTabClick({ title, isMobile: false })
    onClick?.()
  }
  return (
    <button
      role="tab"
      aria-controls={`tabpanel-${index}`}
      style={getBlockStyles({ isSelected })}
      className={"sensitive-data-blocks"}
      onClick={handleClick}
    >
      {title}
    </button>
  )
}

const LinkTab = ({ title, url }) => {
  const handleClick = () => {
    trackTabClick({ title, url, isMobile: false })
  }
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
      onClick={handleClick}
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
