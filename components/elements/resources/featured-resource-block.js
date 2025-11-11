import React from "react"
import Link from "next/link"
import Tooltip from "@mui/material/Tooltip"
import Markdown from "../../elements/markdown"
import { styled } from "@mui/material/styles"

const FeaturedBlock = styled("a")(({ img }) => ({
  position: "relative",
  backgroundImage: `url(${img})`,
  backgroundSize: "cover",
  cursor: "pointer",
  height: "200px",
  marginBottom: "2.5rem",
  width: "calc((100% - 25px) / 2)",
  overflow: "hidden",
  display: "block",

  "&:before": {
    content: '""',
    backgroundColor: "#982568",
    opacity: 0.8,
    display: "block",
    height: "100%",
    position: "absolute",
    width: "100%",
    transition: "opacity 0.25s ease",
  },

  "&:hover:before": {
    backgroundColor: "#420F2C",
    opacity: 0.9,
  },

  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    right: -50,
    width: 100,
    height: 100,
    background: "white",
    transform: "rotate(45deg) translate(50px, 50px)",
  },

  "&:focus": {
    border: "3px solid #0044B3",
    outlineOffset: 3,
  },
}))

const Title = styled("h1")({
  position: "absolute",
  zIndex: 2,
  color: "white",
  fontSize: "2.25rem",
  padding: "2rem",
  wordBreak: "break-word",
  margin: 0,
})

export function FeaturedResourceBlock({ data }) {
  return (
    <Link href={`/${data.url || "coming-soon"}`} passHref legacyBehavior>
      {data.blurb ? (
        <Tooltip
          placement="top-end"
          arrow
          disableInteractive
          title={<Markdown>{data.blurb || ""}</Markdown>}
          componentsProps={{
            tooltip: {
              sx: {
                fontSize: "1rem",
                padding: "8px 12px",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "& .MuiTooltip-arrow": {
                  color: "primary.main",
                },
                minWidth: "500px",
              },
            },
          }}
        >
          <FeaturedBlock aria-label={data.title} img={data.img.url}>
            <Title>{data.title}</Title>
          </FeaturedBlock>
        </Tooltip>
      ) : (
        <FeaturedBlock aria-label={data.title} img={data.img.url}>
          <Title>{data.title}</Title>
        </FeaturedBlock>
      )}
    </Link>
  )
}
export default FeaturedResourceBlock
