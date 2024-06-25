import { Box } from "@mui/material/"
import Markdown from "../elements/markdown"

const FloatingInfoBox = ({ data }) => {
  return (
    <div className="container pb-4  text-gray-dark">
      <Box
        sx={{
          float: data.alignment === "left" ? "left" : "right",
          marginRight: data.alignment === "left" ? "1.2rem" : 0,
          marginLeft: data.alignment === "left" ? 0 : "1.2rem",
          marginBottom: "1rem",
          width: "40%",
          background: "linear-gradient(315deg, transparent 17px, #e5e0e7 0)",
          padding: "1rem 1.5rem",
        }}
      >
        <Markdown>{data.content}</Markdown>
      </Box>
      <Markdown>{data.textWrapContent}</Markdown>
    </div>
  )
}
export default FloatingInfoBox
