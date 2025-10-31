import React from "react"
import Link from "next/link"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"

export function FeaturedResourceBlock({ data }) {
  return (
    <Link href={`/${data.url || "coming-soon"}`} passHref>
      <Tooltip
        title={data.blurb || ""}
        placement="top-end"
        arrow
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
            },
          },
        }}
      >
        <div
          className="featured-resource-block"
          style={{
            position: "relative",
            backgroundImage: `url(${data.img.url})`,
            clipPath:
              "polygon(0px 0px, 100% 0px,100% calc(100%  - 48px),calc(100% - 48px) 100%, 0px 100%)",
            backgroundSize: "cover",
            cursor: "pointer",
            height: "200px",
            marginBottom: "2.5rem",
          }}
        >
          <h1
            className="text-white text-4xl p-10 resource-block-title"
            style={{
              backgroundColor: "transparent",
              position: "absolute",
              zIndex: "2",
              wordBreak: "break-word",
            }}
          >
            {data.title}
          </h1>
        </div>
      </Tooltip>
    </Link>
  )
}
