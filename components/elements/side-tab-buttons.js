import { styled } from "@mui/material/styles"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const Block = ({ title, onMouseEnter, isSelected, index }) => {
  return (
    <button
      aria-selected={isSelected}
      aria-controls={`tabpanel-${index}`}
      style={{
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "start",
        marginBottom: "15px",
        padding: "15px",
        minHeight: "75px",
        background:
          "linear-gradient(315deg, transparent 17px, rgb(229, 224, 231) 0)",
        cursor: "pointer",
        color: "rgba(83, 37, 101, 1)",
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

