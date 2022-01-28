import * as React from "react"
import Typography from "@mui/material/Typography"
// import Link from "next/link";
import Image from "next/image"
import Markdown from "react-markdown"
import LinkedInIcon from "@mui/icons-material/LinkedIn"

export default function PublicWorkingGroupListItem({
  name,
  organization,
  //   email,
  picture,
  bio,
  linkedin,
}) {
  return (
    <div className="basic-card-container" style={{ width: "100%" }}>
      <div className="basic-card-content">
        <div className="event-img">
          <Image alt="Webinar" width={275} height={275} src={picture.url} />
        </div>
        <div className="card-blurb">
          <Typography
            sx={{ fontWeight: "bold", color: "#532565", fontSize: 28 }}
            color="text.secondary"
          >
            {name}
          </Typography>
          <Typography
            gutterBottom
            component="div"
            sx={{
              fontWeight: "bold",
              color: "#532565",
              textTransform: "capitalize",
            }}
          >
            {organization}
          </Typography>
          <div className="public-member-bio">
            <Markdown>{bio}</Markdown>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          padding: "0 25px 0 0",
          marginTop: "-42px",
          color: "#532565",
        }}
      >
        <a
          target="_blank"
          href={linkedin}
          style={{ zIndex: 2 }}
          rel="noreferrer"
        >
          {" "}
          <LinkedInIcon
            sx={{
              fontSize: 100,
              cursor: "pointer",
              "&:hover": {
                color: "#982568",
              },
            }}
          />
        </a>
      </div>
    </div>
  )
}
