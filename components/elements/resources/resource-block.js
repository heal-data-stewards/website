// src/components/resources/resource-block.js
import React from "react"
import Link from "next/link"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { styled } from "@mui/material/styles"
import Markdown from "../../elements/markdown"

const Block = styled("a")(({ img }) => ({
  width: "calc((100% - 50px) / 3)",
  position: "relative",
  overflow: "hidden",
  height: 300,
  marginBottom: "2.5rem",
  cursor: "pointer",
  display: "block",
  backgroundImage: `url(${img})`,
  backgroundSize: "cover",
  backgroundPosition: "center",

  "&:before": {
    content: '""',
    backgroundColor: "#532565",
    opacity: 0.8,
    display: "block",
    height: "100%",
    position: "absolute",
    width: "100%",
    transition: "opacity 0.25s ease",
  },

  "&:hover:before": {
    backgroundColor: "#250033",
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
    outline: "3px solid #0044B3",
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

export function ResourceBlock({ data }) {
  return (
    <Link href={`/${data.url || "coming-soon"}`} passHref legacyBehavior>
      {data.tooltip ? (
        <Tooltip
          placement="top"
          arrow
          disableInteractive
          title={<Markdown>{data.tooltip}</Markdown>}
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
          <Block img={data.img.url} aria-label={data.title}>
            <Title>{data.title}</Title>
          </Block>
        </Tooltip>
      ) : (
        <Block img={data.img.url} aria-label={data.title}>
          <Title>{data.title}</Title>
        </Block>
      )}
    </Link>
  )
}
