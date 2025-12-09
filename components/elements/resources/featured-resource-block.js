import React from "react"
import Link from "next/link"
import Markdown from "../../elements/markdown"
import { styled } from "@mui/material/styles"

const Card = styled("a")(({ theme }) => ({
  position: "relative",
  display: "block",
  height: 250,
  width: "calc((100% - 25px) / 2)",
  marginBottom: "2.5rem",
  cursor: "pointer",
  clipPath:
    "polygon(0px 0px, 100% 0px,100% calc(100%  - 48px),calc(100% - 48px) 100%, 0px 100%)",
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
  zIndex: 1,
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
  padding: "1rem",
  overflowY: "auto",
  zIndex: 0,
  "& h3": {
    marginTop: 0,
    fontWeight: 600,
    fontSize: "1.5rem",
  },
})

const Title = styled("h3")({
  position: "absolute",
  top: "1rem",
  left: "1rem",
  margin: 0,
  paddingRight: "1rem",
  fontSize: "2rem",
  zIndex: 2,
  wordBreak: "break-word",
})

const CardContainer = styled(Card)(({ hasBlurb }) => ({
  "&:hover .visual, &:focus .visual": hasBlurb
    ? { opacity: 0 } // fade out image
    : {
        "&::before": {
          backgroundColor: "#420F2C",
          opacity: 0.9, // darken hover cue
        },
      },
}))

export function FeaturedResourceBlock({ data }) {
  const hasBlurb = Boolean(data.blurb)
  const href = `/${data.url || "coming-soon"}`

  return (
    <Link href={href} passHref legacyBehavior>
      <CardContainer aria-label={data.title} hasBlurb={hasBlurb}>
        {hasBlurb && (
          <PreviewLayer>
            <h3>{data.title}</h3>
            <Markdown>{data.blurb}</Markdown>
          </PreviewLayer>
        )}

        <VisualLayer img={data.img.url} className="visual" />
        <Title>{data.title}</Title>
      </CardContainer>
    </Link>
  )
}

export default FeaturedResourceBlock
