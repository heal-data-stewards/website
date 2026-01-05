import React from "react"
import Link from "next/link"
import { styled } from "@mui/material/styles"
import Markdown from "../../elements/markdown"

const Card = styled("a")(({ theme }) => ({
  position: "relative",
  display: "block",
  height: 300,
  width: "calc((100% - 50px) / 3)",
  marginBottom: "2.5rem",
  cursor: "pointer",
  overflow: "hidden",
  color: "white",
  textDecoration: "none",
  clipPath:
    "polygon(0px 0px, 100% 0px,100% calc(100%  - 48px),calc(100% - 48px) 100%, 0px 100%)",
  [theme.breakpoints.down(1024)]: {
    width: "calc((100% - 25px) / 2)",
  },
  [theme.breakpoints.down(700)]: {
    width: "100%",
  },
  "&:focus-visible": {
    outline: "2px solid #ffffff",
    outlineOffset: 4,
  },
}))

const VisualLayer = styled("div")(({ img }) => ({
  position: "absolute",
  inset: 0,
  backgroundImage: `url(${img})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  transition: "opacity 0.3s ease",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    backgroundColor: "#532565",
    opacity: 0.8,
    transition: "opacity 0.3s ease, background-color 0.3s ease",
  },
}))

const PreviewBaseLayer = styled("div")({
  position: "absolute",
  inset: 0,
  backgroundColor: "#250033",
  color: "white",
  padding: "1rem",
  overflowY: "auto",
  zIndex: 0,
  "& h3": {
    marginTop: 0,
    fontWeight: 600,
    fontSize: "1.5rem",
  },
  "& li": {
    fontSize: "1.1rem",
    lineHeight: 1.1,
    paddingBottom: "0.25rem",
  },
})

const CardContainer = styled(Card)(({ hasTooltip }) => ({
  "&:hover .visual, &:focus .visual": hasTooltip
    ? { opacity: 0 }
    : {
        "&::before": {
          backgroundColor: "#250033",
          opacity: 0.9,
        },
      },
}))

export function ResourceBlock({ data }) {
  const hasTooltip = Boolean(data.tooltip)

  return (
    <Link href={`/${data.url || "coming-soon"}`} passHref legacyBehavior>
      <CardContainer aria-label={data.title} hasTooltip={hasTooltip}>
        <PreviewBaseLayer>
          <h3>{data.title}</h3>
          {hasTooltip && <Markdown>{data.tooltip}</Markdown>}
        </PreviewBaseLayer>

        <VisualLayer img={data.img.url} className="visual">
          <h3
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              margin: 0,
              zIndex: 2,
              fontSize: "2.25rem",
            }}
          >
            {data.title}
          </h3>
        </VisualLayer>
      </CardContainer>
    </Link>
  )
}
