import React from "react"
import Link from "next/link"
import Markdown from "../../elements/markdown"
import { styled } from "@mui/material/styles"
import { sendCustomEvent } from "utils/analytics"

const Card = styled("a")(({ theme }) => ({
  position: "relative",
  display: "block",
  height: 250,
  width: "calc((100% - 25px) / 2)",
  marginBottom: "2.5rem",
  cursor: "pointer",
  clipPath:
    "polygon(0px 0px, 100% 0px,100% calc(100% - 48px),calc(100% - 48px) 100%, 0px 100%)",
  overflow: "hidden",
  textDecoration: "none",
  color: "white",
  [theme.breakpoints.down(1024)]: {
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
  zIndex: 0,
  transition: "opacity 0.3s ease",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    backgroundColor: "#982568",
    opacity: 0.8,
    transition: "opacity 0.3s ease, background-color 0.3s ease",
  },
}))

const PreviewLayer = styled("div")({
  position: "absolute",
  inset: 0,
  backgroundColor: "#420F2C",
  color: "white",
  padding: "1rem",
  overflowY: "auto",
  zIndex: 1,
  opacity: 0,
  transition: "opacity 0.3s ease",
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

const CardContainer = styled(Card)(({ hasBlurb }) => ({
  "&:hover .preview, &:focus .preview": {
    opacity: 1,
  },
  "&:hover .visual, &:focus .visual": hasBlurb
    ? { opacity: 0 }
    : {
        "&::before": {
          backgroundColor: "#420F2C",
          opacity: 0.9,
        },
      },
}))

export function FeaturedResourceBlock({ data }) {
  const hasBlurb = Boolean(data.blurb)
  const href = `/${data.link || "/"}`

  return (
    <Link href={href} passHref legacyBehavior>
      <CardContainer
        aria-label={data.title}
        hasBlurb={hasBlurb}
        onMouseDown={() =>
          sendCustomEvent("featured_resource_box_click", {
            resource_title: data.title,
            resource_url: data.link,
          })
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            sendCustomEvent("featured_resource_box_click", {
              resource_title: data.title,
              resource_url: data.link,
            })
          }
        }}
      >
        {hasBlurb && (
          <PreviewLayer className="preview">
            <h3>{data.title}</h3>
            <Markdown>{data.blurb}</Markdown>
          </PreviewLayer>
        )}
        <VisualLayer img={data.img.url} className="visual">
          <h3
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              margin: 0,
              zIndex: 2,
              fontSize: "2rem",
            }}
          >
            {data.title}
          </h3>
        </VisualLayer>
      </CardContainer>
    </Link>
  )
}

export default FeaturedResourceBlock
