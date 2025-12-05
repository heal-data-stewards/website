import React from "react"
import Link from "next/link"
import Typography from "@mui/material/Typography"
import { sendCustomEvent } from "utils/analytics"

export default function ResourceBlock({ data }) {
  return (
    <Link href={`/${data.url || "coming-soon"}`} passHref>
      <div
        className="resource-block"
        onClick={() =>
          sendCustomEvent("resource_box_click", {
            resource_title: data.title,
            resource_url: data.url || "",
          })
        }
        style={{
          position: "relative",
          backgroundImage: `url(${data.img.url})`,
          clipPath:
            "polygon(0px 0px, 100% 0px,100% calc(100%  - 48px),calc(100% - 48px) 100%, 0px 100%)",
          backgroundSize: "cover",
          cursor: "pointer",
          height: "300px",
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
    </Link>
  )
}
